// Notes board. Talks to Supabase RPC functions (see NOTES_SETUP.md in the repo).
// The password is held in memory only and sent with each request; the server checks it.
(() => {
  const cfg = window.NOTES_CONFIG || {};
  const $ = (id) => document.getElementById(id);

  const gate = $("gate");
  const passInput = $("pass");
  const unlockBtn = $("unlock");
  const gateMsg = $("gate-msg");
  const board = $("board");
  const compose = $("compose");
  const authorInput = $("author");
  const bodyInput = $("body");
  const postBtn = $("post");
  const chars = $("chars");
  const composeMsg = $("compose-msg");
  const list = $("notes");
  const count = $("note-count");

  const when = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
  let pass = "";

  if (!cfg.supabaseUrl || !cfg.supabaseKey) {
    gateMsg.textContent = "Notes storage isn't connected yet.";
    gateMsg.classList.add("msg--bad");
    unlockBtn.disabled = true;
    passInput.disabled = true;
    return;
  }

  async function rpc(fn, args) {
    const headers = { "Content-Type": "application/json", apikey: cfg.supabaseKey };
    // Legacy anon keys are JWTs and also go in Authorization; newer publishable keys don't.
    if (cfg.supabaseKey.startsWith("eyJ")) headers.Authorization = `Bearer ${cfg.supabaseKey}`;

    const res = await fetch(`${cfg.supabaseUrl.replace(/\/+$/, "")}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers,
      body: JSON.stringify(args),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const err = new Error((data && data.message) || `Request failed (${res.status})`);
      err.denied = data && data.message === "bad password";
      throw err;
    }
    return data;
  }

  function setMsg(el, text, bad) {
    el.textContent = text;
    el.classList.toggle("msg--bad", Boolean(bad));
  }

  function render(notes) {
    list.replaceChildren();
    count.textContent = notes.length ? `(${notes.length})` : "";

    if (!notes.length) {
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = "Nothing here yet. Be the first.";
      list.append(li);
      return;
    }

    for (const note of notes) {
      const li = document.createElement("li");
      li.className = "note";

      const head = document.createElement("header");
      const who = document.createElement("span");
      who.className = "who";
      who.textContent = note.author || "anonymous";
      const time = document.createElement("time");
      time.dateTime = note.created_at;
      time.textContent = when.format(new Date(note.created_at));
      const del = document.createElement("button");
      del.className = "del";
      del.type = "button";
      del.textContent = "Remove";
      del.addEventListener("click", () => removeNote(note.id, del));
      head.append(who, time, del);

      const body = document.createElement("p");
      body.textContent = note.body;

      li.append(head, body);
      list.append(li);
    }
  }

  async function load() {
    render(await rpc("notes_list", { pass }));
  }

  async function removeNote(id, btn) {
    if (!window.confirm("Remove this note for everyone?")) return;
    btn.disabled = true;
    try {
      await rpc("notes_delete", { pass, note_id: id });
      await load();
    } catch (err) {
      btn.disabled = false;
      setMsg(composeMsg, err.message, true);
    }
  }

  function lock() {
    pass = "";
    list.replaceChildren();
    board.hidden = true;
    gate.hidden = false;
    passInput.value = "";
    setMsg(gateMsg, "");
    passInput.focus();
  }

  gate.addEventListener("submit", async (e) => {
    e.preventDefault();
    pass = passInput.value;
    unlockBtn.disabled = true;
    setMsg(gateMsg, "Checking…");
    try {
      await load();
      gate.hidden = true;
      board.hidden = false;
      setMsg(gateMsg, "");
      bodyInput.focus();
    } catch (err) {
      pass = "";
      setMsg(gateMsg, err.denied ? "Wrong password." : err.message, true);
      passInput.select();
    } finally {
      unlockBtn.disabled = false;
    }
  });

  compose.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = bodyInput.value.trim();
    if (!body) return;
    postBtn.disabled = true;
    setMsg(composeMsg, "Posting…");
    try {
      await rpc("notes_add", { pass, author: authorInput.value.trim(), body });
      bodyInput.value = "";
      chars.textContent = "0 / 4000";
      setMsg(composeMsg, "Posted.");
      await load();
    } catch (err) {
      if (err.denied) lock();
      else setMsg(composeMsg, err.message, true);
    } finally {
      postBtn.disabled = false;
    }
  });

  bodyInput.addEventListener("input", () => {
    chars.textContent = `${bodyInput.value.length} / 4000`;
  });

  $("lock").addEventListener("click", lock);
})();
