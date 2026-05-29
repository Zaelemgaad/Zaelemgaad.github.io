(function () {
  function titleFromPage() {
    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle?.textContent.trim()) return heroTitle.textContent.trim();
    const title = document.title.split("|").pop();
    return title ? title.trim() : "Game";
  }

  function collectDrawerTargets(shell, layout) {
    const targets = [];
    const seen = new Set();
    const addTarget = (node) => {
      if (node && !seen.has(node)) {
        seen.add(node);
        targets.push(node);
      }
    };

    if (layout) {
      Array.from(layout.children)
        .filter((node) => node.matches?.("aside.sidebar, aside.side, section.controls-strip"))
        .forEach(addTarget);
    }

    shell
      .querySelectorAll(":scope > section.controls-strip, :scope > .game-shell > .controls-strip")
      .forEach(addTarget);

    return targets;
  }

  function cardTitle(card) {
    const summary = card.matches("details") ? card.querySelector(":scope > summary") : null;
    const heading = summary || card.querySelector(":scope > h2, :scope > h3, :scope > .panel-head .eyebrow, h2, h3");
    return heading?.textContent.trim() || "Panel";
  }

  function makeSectionCollapsible(card, open) {
    if (card.matches("details")) {
      card.classList.add("game-menu-section");
      card.open = open;
      return;
    }

    const heading = card.querySelector(":scope > h2, :scope > h3");
    const details = document.createElement("details");
    details.className = `${card.className} game-menu-section`.trim();
    details.open = open;

    const summary = document.createElement("summary");
    summary.textContent = cardTitle(card);
    details.append(summary);

    if (heading) heading.remove();
    while (card.firstChild) {
      details.append(card.firstChild);
    }

    card.replaceWith(details);
  }

  function makeDrawerContentCollapsible(content) {
    const cardSelector = ":scope > .sidebar-card, :scope > .side-card, :scope > .panel, :scope > .controls-strip";
    const containers = [content, ...content.querySelectorAll(".sidebar, .side")];
    for (const container of containers) {
      const cards = Array.from(container.querySelectorAll(cardSelector));
      cards.forEach((card, index) => makeSectionCollapsible(card, index === 0));
    }
  }

  function createDrawer(targets) {
    const toggle = document.createElement("button");
    toggle.className = "game-menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "gameDrawer");
    toggle.textContent = "Menu";

    const drawer = document.createElement("aside");
    drawer.className = "game-drawer";
    drawer.id = "gameDrawer";
    drawer.setAttribute("aria-label", "Game menu");

    const head = document.createElement("div");
    head.className = "game-drawer-head";
    const title = document.createElement("p");
    title.className = "game-drawer-title";
    title.textContent = "Game Menu";
    const close = document.createElement("button");
    close.className = "game-drawer-close";
    close.type = "button";
    close.setAttribute("aria-label", "Close game menu");
    close.textContent = "X";
    head.append(title, close);

    const content = document.createElement("div");
    content.className = "game-drawer-content";
    for (const target of targets) {
      content.append(target);
    }
    makeDrawerContentCollapsible(content);

    drawer.append(head, content);
    document.body.append(toggle, drawer);

    function setOpen(open) {
      document.body.classList.toggle("game-drawer-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) {
        close.focus({ preventScroll: true });
      } else {
        toggle.focus({ preventScroll: true });
      }
    }

    toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("game-drawer-open")));
    close.addEventListener("click", () => setOpen(false));
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("game-drawer-open")) {
        setOpen(false);
      }
    });
  }

  function installConfirm() {
    let resolver = null;
    const layer = document.createElement("div");
    layer.className = "game-site-confirm";
    layer.hidden = true;
    layer.innerHTML = `
      <div class="game-site-confirm-card" role="dialog" aria-modal="true" aria-labelledby="gameSiteConfirmTitle">
        <h2 id="gameSiteConfirmTitle">Confirm Action</h2>
        <p id="gameSiteConfirmText"></p>
        <div class="game-site-confirm-actions">
          <button class="button game-site-confirm-cancel" type="button">Cancel</button>
          <button class="button primary game-site-confirm-accept" type="button">Confirm</button>
        </div>
      </div>
    `;
    document.body.append(layer);
    const title = layer.querySelector("#gameSiteConfirmTitle");
    const text = layer.querySelector("#gameSiteConfirmText");
    const cancel = layer.querySelector(".game-site-confirm-cancel");
    const accept = layer.querySelector(".game-site-confirm-accept");

    function settle(value) {
      layer.hidden = true;
      if (resolver) resolver(value);
      resolver = null;
    }

    cancel.addEventListener("click", () => settle(false));
    accept.addEventListener("click", () => settle(true));
    layer.addEventListener("click", (event) => {
      if (event.target === layer) settle(false);
    });
    window.addEventListener("keydown", (event) => {
      if (!layer.hidden && event.key === "Escape") settle(false);
    });

    window.siteConfirm = function siteConfirm(message, options = {}) {
      title.textContent = options.title || "Confirm Action";
      text.textContent = message;
      accept.textContent = options.confirmLabel || "Confirm";
      cancel.textContent = options.cancelLabel || "Cancel";
      accept.classList.toggle("danger", Boolean(options.danger));
      layer.hidden = false;
      accept.focus({ preventScroll: true });
      return new Promise((resolve) => {
        resolver = resolve;
      });
    };
  }

  function blockAccidentalContextMenus() {
    document.addEventListener("contextmenu", (event) => {
      if (!document.body.classList.contains("game-shell-active")) return;
      if (event.target.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.target.closest(".shell, .game-drawer, .game-site-confirm")) {
        event.preventDefault();
      }
    });
  }

  function init() {
    if (document.body.dataset.noGameShell === "true") return;
    const shell = document.querySelector(".shell");
    const layout = document.querySelector(".layout");
    if (!shell && !layout) return;

    document.body.classList.add("game-shell-active");

    const pageTitle = document.createElement("div");
    pageTitle.className = "game-page-title";
    pageTitle.textContent = titleFromPage();
    document.body.append(pageTitle);

    const targets = collectDrawerTargets(shell || document.body, layout);
    if (targets.length) {
      createDrawer(targets);
    }
    installConfirm();
    blockAccidentalContextMenus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
