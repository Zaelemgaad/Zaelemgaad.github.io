class ZembedClient extends EventTarget {
  constructor(iframe, options = {}) {
    super();
    this.iframe = iframe;
    this.options = {
      targetOrigin: "*",
      requestTimeoutMs: 20000,
      readyTimeoutMs: 20000,
      ...options,
    };
    this.pending = new Map();
    this.ready = false;
    this.capabilities = null;
    this.lastSnapshot = null;
    this._boundMessage = this._handleMessage.bind(this);
    window.addEventListener("message", this._boundMessage);
  }

  destroy() {
    window.removeEventListener("message", this._boundMessage);
    for (const { reject, timeoutId } of this.pending.values()) {
      clearTimeout(timeoutId);
      reject(new Error("Zembed client destroyed."));
    }
    this.pending.clear();
  }

  load(src) {
    this.ready = false;
    this.capabilities = null;
    this.lastSnapshot = null;
    this.dispatchEvent(new CustomEvent("status", { detail: { ready: false, src } }));
    this.iframe.src = src;
  }

  async waitForReady(timeoutMs = this.options.readyTimeoutMs) {
    if (this.ready) return this.capabilities;
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error("Timed out waiting for zembed ready event."));
      }, timeoutMs);
      const cleanup = () => {
        clearTimeout(timeoutId);
        this.removeEventListener("ready", onReady);
      };
      const onReady = (event) => {
        cleanup();
        resolve(event.detail?.capabilities || this.capabilities);
      };
      this.addEventListener("ready", onReady, { once: true });
    });
  }

  async send(action, data = {}, opts = {}) {
    const requestId = `zembed-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const timeoutMs = opts.timeoutMs || this.options.requestTimeoutMs;
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pending.delete(requestId);
        reject(new Error(`Timed out waiting for zembed response to "${action}".`));
      }, timeoutMs);
      this.pending.set(requestId, { resolve, reject, timeoutId, action });
      this.iframe.contentWindow?.postMessage(
        {
          type: "zembed",
          action,
          requestId,
          data,
        },
        opts.targetOrigin || this.options.targetOrigin,
      );
    });
  }

  ping() {
    return this.send("ping");
  }

  getSnapshot() {
    return this.send("getSnapshot");
  }

  getFields() {
    return this.send("getFields");
  }

  setInputs(values) {
    return this.send("setInputs", { values });
  }

  generateAndWait(timeoutMs = 180000) {
    return this.send("generateAndWait", { timeoutMs }, { timeoutMs: timeoutMs + 5000 });
  }

  async applyInputsAndGenerate(values, timeoutMs = 180000) {
    await this.setInputs(values);
    return this.generateAndWait(timeoutMs);
  }

  _handleMessage(event) {
    if (event.source !== this.iframe.contentWindow) return;
    const data = event.data;
    if (!data || data.source !== "perchance-zembed") return;

    if (data.type === "zembed-response") {
      const pending = this.pending.get(data.requestId);
      if (!pending) return;
      clearTimeout(pending.timeoutId);
      this.pending.delete(data.requestId);
      if (data.ok) {
        pending.resolve(data.result);
      } else {
        pending.reject(new Error(data.error || `zembed "${pending.action}" failed.`));
      }
      return;
    }

    if (data.type === "zembed-event") {
      const detail = data.payload || {};
      if (data.event === "ready") {
        this.ready = true;
        this.capabilities = detail.capabilities || null;
        this.lastSnapshot = detail.snapshot || null;
      } else if (data.event === "snapshot" || data.event === "generate-finished") {
        this.lastSnapshot = detail;
      }

      this.dispatchEvent(new CustomEvent(data.event, { detail }));
      this.dispatchEvent(new CustomEvent("event", { detail: { name: data.event, payload: detail } }));
    }
  }
}

window.ZembedClient = ZembedClient;
