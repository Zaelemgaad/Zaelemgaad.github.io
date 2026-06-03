(function () {
  function titleFromPage() {
    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle?.textContent.trim()) return heroTitle.textContent.trim();
    const title = document.title.split("|").pop();
    return title ? title.trim() : "Game";
  }

  function menuTitle(node) {
    const heading = node.matches("details")
      ? node.querySelector(":scope > summary")
      : node.querySelector(":scope > h2, :scope > h3, :scope > .panel-head .eyebrow, h2, h3");
    return heading?.textContent.trim() || "Panel";
  }

  function addMenuItem(items, node, title) {
    if (!node || items.some((item) => item.node === node)) return;
    node.hidden = false;
    items.push({ node, title: title || menuTitle(node) });
  }

  function addSourceItems(items, source) {
    if (source.matches("aside.sidebar, aside.side")) {
      const children = Array.from(source.children);
      for (const child of children) {
        const nestedCards = child.matches(".panel") && !child.querySelector(":scope > .panel-head")
          ? Array.from(child.querySelectorAll(":scope > .store > .sidebar-card"))
          : [];
        if (nestedCards.length > 1) {
          nestedCards.forEach((card) => addMenuItem(items, card));
          child.hidden = true;
        } else {
          addMenuItem(items, child);
        }
      }
      source.hidden = true;
      source.classList.add("game-menu-source-empty");
      return;
    }

    addMenuItem(items, source, source.matches(".controls-strip") ? "Controls" : undefined);
  }

  function collectMenuItems(shell, layout) {
    const items = [];
    const sources = [];
    const seen = new Set();
    const addSource = (node) => {
      if (node && !seen.has(node)) {
        seen.add(node);
        sources.push(node);
      }
    };

    if (layout) {
      Array.from(layout.children)
        .filter((node) => node.matches?.("aside.sidebar, aside.side, section.controls-strip"))
        .forEach(addSource);
    }

    shell
      .querySelectorAll(":scope > section.controls-strip, :scope > .game-shell > .controls-strip")
      .forEach(addSource);

    sources.forEach((source) => addSourceItems(items, source));
    return items;
  }

  function createMenu(items) {
    const toggle = document.createElement("button");
    toggle.className = "game-menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "gameDock");
    toggle.textContent = "Menu";

    const dock = document.createElement("section");
    dock.className = "game-dock";
    dock.id = "gameDock";
    dock.setAttribute("aria-label", "Game menu");

    const head = document.createElement("div");
    head.className = "game-dock-head";
    const title = document.createElement("p");
    title.className = "game-dock-title";
    title.textContent = "Game Panel";
    const close = document.createElement("button");
    close.className = "game-dock-close";
    close.type = "button";
    close.setAttribute("aria-label", "Close game panel");
    close.textContent = "X";
    head.append(title, close);

    const tabs = document.createElement("div");
    tabs.className = "game-dock-tabs";
    tabs.setAttribute("role", "tablist");

    const content = document.createElement("div");
    content.className = "game-dock-content";

    const tabButtons = [];
    const panels = [];

    items.forEach((item, index) => {
      const tabId = `gameDockTab${index}`;
      const panelId = `gameDockPanel${index}`;

      const tab = document.createElement("button");
      tab.className = "game-dock-tab";
      tab.type = "button";
      tab.id = tabId;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panelId);
      tab.textContent = item.title;

      const panel = document.createElement("div");
      panel.className = "game-dock-panel";
      panel.id = panelId;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tabId);
      panel.append(item.node);

      tabs.append(tab);
      content.append(panel);
      tabButtons.push(tab);
      panels.push(panel);
    });

    function setActive(nextIndex) {
      tabButtons.forEach((tab, index) => {
        const active = index === nextIndex;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[index].hidden = !active;
      });
    }

    tabButtons.forEach((tab, index) => {
      tab.addEventListener("click", () => setActive(index));
    });

    tabs.addEventListener("keydown", (event) => {
      const currentIndex = tabButtons.findIndex((tab) => tab.classList.contains("active"));
      let nextIndex = currentIndex;
      if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabButtons.length;
      if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabButtons.length - 1;
      if (nextIndex !== currentIndex) {
        event.preventDefault();
        setActive(nextIndex);
        tabButtons[nextIndex].focus({ preventScroll: true });
      }
    });

    setActive(0);
    dock.append(head, tabs, content);
    document.body.append(toggle, dock);

    function setOpen(open) {
      document.body.classList.toggle("game-menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) {
        const activeTab = tabButtons.find((tab) => tab.classList.contains("active")) || tabButtons[0];
        activeTab?.focus({ preventScroll: true });
      } else {
        toggle.focus({ preventScroll: true });
      }
    }

    toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("game-menu-open")));
    close.addEventListener("click", () => setOpen(false));
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("game-menu-open")) {
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
      if (event.target.closest(".shell, .game-dock, .game-site-confirm")) {
        event.preventDefault();
      }
    });
  }

  function flushGameLayout() {
    const notifyResize = () => window.dispatchEvent(new Event("resize"));
    requestAnimationFrame(() => {
      notifyResize();
      requestAnimationFrame(notifyResize);
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

    const items = collectMenuItems(shell || document.body, layout);
    if (items.length) {
      createMenu(items);
    }
    installConfirm();
    blockAccidentalContextMenus();
    flushGameLayout();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
