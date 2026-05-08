function create_resize_slider(selector_elem, selector_neighbour, vetical, horizontal, bar_width, bar_height) {
    $(`${selector_elem} + ${selector_neighbour}`).each(function () {
        $("<div>").css({
                "background-color": "rgba(0, 0, 0, 0.5)",
                "width": bar_width,
                "height": bar_height,
                "position": "relative",
                "top": `calc((100% - ${bar_height}) / 2.0)`,
                "left": `calc((100% - ${bar_width}) / 2.0)`,
                "border-radius": "1000px"
            }).appendTo($(this))
    })

    $(selector_elem).resizable({
        handleSelector: selector_neighbour,
        resizeHeight: vetical ? true : false,
        resizeWidth: horizontal ? true : false
    });
}

function create_popup(is_fail, title, text, close_callback) {
    let holder = $('<div class="popup-holder">')

    holder.load('popup-template.html', function () {
        if (is_fail) {
            holder.find('*').each(function () {
                $(this).addClass("popup-fail")
            })
        }

        holder.find("#popup-title-text > div").html(title)
        holder.find(".popup-content").html(text)
        holder.find(".popup-close-btn").click(close_callback)

        holder.appendTo($('body'))
    })
}

function humanFileSize(size) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}

async function create_download_popup(is_fail, title, file_name, file_size, close_callback) {
    var resolveFunction;
    const loadPromise = new Promise(function(resolve, _) {
        resolveFunction = resolve;
    });

    let holder = $('<div class="popup-holder">')

    holder.load('popup-download-template.html', function () {
        if (is_fail) {
            holder.find('*').each(function () {
                $(this).addClass("popup-fail")
            })
        }

        holder.find("#popup-title-text > div").html(title)
        holder.find(".popup-file-info > .file-info > .name > .value").html(file_name)
        holder.find(".popup-file-info > .file-info > .size > .value").html(humanFileSize(file_size))
        holder.find(".popup-close-btn").click(close_callback)

        holder.appendTo($('body'))

        resolveFunction({
            "bar": $(holder.find(".popup-download .progress-bar > .progress")[0]),
            "text": $(holder.find(".popup-download .progress-bar > .text")[0])
        });
    })

    return loadPromise;
}

function download_file(blob, xhr) {
    let filename = "";
    let disposition = xhr.getResponseHeader('Content-Disposition');

    if (disposition && disposition.indexOf('attachment') !== -1) {
        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        let matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1])
            filename = matches[1].replace(/['"]/g, '');
    }

    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);

        if (filename) {
            // use HTML5 a[download] attribute to specify filename
            var a = document.createElement("a");
            // safari doesn't support this yet
            if (typeof a.download === 'undefined') {
                window.location.href = downloadUrl;
            } else {
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

            }
        } else {
            window.location.href = downloadUrl;
        }

        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
    }
}

function makeSimpleRequest(method, url, binary, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (binary) {
        xhr.setRequestHeader("Accept", "application/octet-stream");
        xhr.responseType = "arraybuffer";
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject({ status: xhr.status, statusText: xhr.statusText });
      }
    };
    xhr.onerror = () => reject({ status: xhr.status, statusText: xhr.statusText });
    xhr.send(data);
  });
}

async function start_download(url, remain_hanging) {
    var data = new FormData();
    data.append('file', url);

    let continue_download = true;

    const reponse = await makeSimpleRequest('POST', '/start_download.php', false, data);
    const jsonResponse = JSON.parse(reponse);

    const f_name = jsonResponse.name;
    const f_size = jsonResponse.size;
    const f_mime = jsonResponse.mime;

    const progress_bar = await create_download_popup(
        false, "Downloading the file", f_name, f_size,
        function () {
            if (!remain_hanging) {
                window.location.reload();
            }
            else {
                continue_download = false;
                window.location.pathname = "";
            }
    });
    progress_bar.bar.css("width", "0%");
    progress_bar.text.text("0%");

    await new Promise(resolve => setTimeout(resolve, 500));

    const root = await navigator.storage.getDirectory();

    window.addEventListener("beforeunload", async () => {
        await root.remove({ recursive: true });
    });
    try {
        await root.remove({ recursive: true });
    } catch { }

    const fileHandle = await root.getFileHandle(f_name, { create: true });
    let accessHandle = undefined;

    try {
        accessHandle = await fileHandle.createSyncAccessHandle();
    } catch {
        accessHandle = await fileHandle.createWritable();
    }

    var offset = 0;
    var fail_count = 0;

    while(continue_download && offset < f_size) {
        var file_part = undefined
        while (fail_count < 3) {
            try {
                file_part = await makeSimpleRequest('GET', '/download_part.php?offset=' + offset, true);
                break;
            } catch {
                fail_count += 1;
            }
        }

        if (fail_count >= 3) {
            throw("failed to download file");
        }

        fail_count = 0;

        if (!continue_download)
            return;

        accessHandle.write(file_part);
        offset += file_part.byteLength;

        const percent = Math.round((offset / f_size) * 100.0) + "%";
        progress_bar.bar.css("width", percent);
        progress_bar.text.text(percent);
    }

    if (!continue_download)
        return;
    else
        await accessHandle.close();

    const local_file_url = window.URL.createObjectURL(await fileHandle.getFile());
    console.log(local_file_url);

    var a = document.createElement('a');
    a.download = f_name;
    a.href = local_file_url;
    a.click();

    if (!remain_hanging) {
        setTimeout(() => {
            $(".popup-holder").remove();
        }, 1500);
    }
    else {
        $(".popup-holder .popup .popup-buttons .popup-close-btn").remove();
    }
}

let col_sortable = []

function set_table_col_sortable(th_elem) {
    $(th_elem).click(function() {
        var table = $(this).parents('table').eq(0)
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
        this.asc = !this.asc

        asc_cln = "col-srt-asc-"
        dsc_cln = "col-srt-dsc-"

        if ($(this).attr("srt-sym-plc") === "after") {
            asc_cln += "a"
            dsc_cln += "a"
        }
        else {
            asc_cln += "b"
            dsc_cln += "b"
        }

        for (var i = 0; i < col_sortable.length; i++) {
            col_sortable[i].attr('class', function (i, c) {
                return c.replace(/(^|\s)col-srt-\S+/g, '')
            })
        }

        if (!this.asc) {
            rows = rows.reverse()
            $(this).addClass(dsc_cln)
        }
        else {
            $(this).addClass(asc_cln)
        }

        for (var i = 0; i < rows.length; i++)
            table.append(rows[i])
    })

    col_sortable.push($(th_elem))
}


function comparer(index) {
    return function(a, b) {
        var valA = get_cell_value(a, index), valB = get_cell_value(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}

function get_cell_value(row, index) {
    let cell = $(row).children('td').eq(index)

    if (cell.attr("val"))
        return cell.attr("val")
    else
        return cell.text()
}

$.ajaxTransport("+binary", function (options, originalOptions, jqXHR) {
    // check for conditions and support for blob / arraybuffer response type
    if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob))))) {
        return {
            // create new XMLHttpRequest
            send: function (headers, callback) {
                // setup all variables
                var xhr = new XMLHttpRequest(),
                    url = options.url,
                    type = options.type,
                    async = options.async || true,
                    // blob or arraybuffer. Default is blob
                    dataType = options.responseType || "blob",
                    data = options.data || null,
                    username = options.username || null,
                    password = options.password || null;

                xhr.addEventListener('load', function () {
                    var data = {};
                    data[options.dataType] = xhr.response;
                    // make callback and send data
                    callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                });

                xhr.open(type, url, async, username, password);

                // setup custom headers
                for (var i in headers) {
                    xhr.setRequestHeader(i, headers[i]);
                }

                xhr.responseType = dataType;
                xhr.send(data);
            },
            abort: function () {
                jqXHR.abort();
            }
        };
    }
});

