var F = Object.defineProperty;
var B = (h, t, e) => t in h ? F(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : h[t] = e;
var v = (h, t, e) => B(h, typeof t != "symbol" ? t + "" : t, e);
const V = 44848, U = 44592, z = 44545, O = 44546, G = 384, k = 32, W = 24e3, X = 100;
var S = /* @__PURE__ */ ((h) => (h[h.ApplyEnergy = 190] = "ApplyEnergy", h[h.GetDeviceState = 163] = "GetDeviceState", h[h.GetDeviceInfo = 168] = "GetDeviceInfo", h[h.UpdateDevice = 169] = "UpdateDevice", h[h.SetDpi = 164] = "SetDpi", h[h.Lattice = 166] = "Lattice", h[h.Retract = 160] = "Retract", h[h.Feed = 161] = "Feed", h[h.Speed = 189] = "Speed", h[h.Energy = 175] = "Energy", h[h.Bitmap = 162] = "Bitmap", h))(S || {}), E = /* @__PURE__ */ ((h) => (h[h.Transfer = 0] = "Transfer", h[h.Response = 1] = "Response", h))(E || {});
function N(h) {
  let t = 0;
  for (const e of h) {
    t ^= e;
    for (let i = 0; i < 8; i++)
      t & 128 ? t = t << 1 ^ 7 : t <<= 1;
    t &= 255;
  }
  return t;
}
function x(h, t = 128) {
  const e = new Uint8Array(Math.ceil(h.length / 8));
  for (let i = 0; i < h.length; i++) {
    const r = Math.floor(i / 8), o = i % 8, s = h[i], a = s & 255, n = s >> 8 & 255, c = s >> 16 & 255;
    (a + n + c) / 3 < t && (e[r] |= 1 << o);
  }
  return e;
}
class _ {
  /**
   * Applies threshold dithering to the image data.
   * @param imageData The ImageData object.
   * @param options Image options, specifically the brightness threshold.
   * @returns The dithered ImageData.
   */
  dither(t, e) {
    const i = t.data, r = e.brightness !== void 0 ? e.brightness : 128;
    for (let o = 0; o < i.length; o += 4) {
      const a = (i[o] + i[o + 1] + i[o + 2]) / 3 < r ? 0 : 255;
      i[o] = i[o + 1] = i[o + 2] = a;
    }
    return t;
  }
}
class A {
  constructor() {
    v(this, "thresholdMap", [
      [0, 2],
      [3, 1]
    ]);
  }
  /**
   * Applies Bayer dithering to the image data.
   * @param imageData The ImageData object.
   * @param _options Image options (not directly used in this algorithm).
   * @returns The dithered ImageData.
   */
  dither(t, e) {
    const i = t.data, r = t.width, o = t.height;
    for (let s = 0; s < o; s++)
      for (let a = 0; a < r; a++) {
        const n = (s * r + a) * 4, c = i[n], l = i[n + 1], f = i[n + 2], u = (c + l + f) / 3, m = (this.thresholdMap[s % 2][a % 2] + 1) * (255 / 5), g = u < m ? 0 : 255;
        i[n] = i[n + 1] = i[n + 2] = g;
      }
    return t;
  }
}
class C {
  /**
   * Applies Floyd-Steinberg dithering to the image data.
   * @param imageData The ImageData object.
   * @param _options Image options (not directly used in this algorithm).
   * @returns The dithered ImageData.
   */
  dither(t, e) {
    const i = t.data, r = t.width, o = t.height;
    for (let s = 0; s < o; s++)
      for (let a = 0; a < r; a++) {
        const n = (s * r + a) * 4, c = i[n], l = i[n + 1], f = i[n + 2], m = (c + l + f) / 3 < 128 ? 0 : 255, g = m, w = m, b = m;
        i[n] = g, i[n + 1] = w, i[n + 2] = b;
        const y = c - g, d = l - w, p = f - b;
        this.distributeError(
          i,
          r,
          a + 1,
          s,
          y * 7 / 16,
          d * 7 / 16,
          p * 7 / 16
        ), this.distributeError(
          i,
          r,
          a - 1,
          s + 1,
          y * 3 / 16,
          d * 3 / 16,
          p * 3 / 16
        ), this.distributeError(
          i,
          r,
          a,
          s + 1,
          y * 5 / 16,
          d * 5 / 16,
          p * 5 / 16
        ), this.distributeError(
          i,
          r,
          a + 1,
          s + 1,
          y * 1 / 16,
          d * 1 / 16,
          p * 1 / 16
        );
      }
    return t;
  }
  distributeError(t, e, i, r, o, s, a) {
    if (i >= 0 && i < e && r >= 0 && r < t.length / (e * 4)) {
      const n = (r * e + i) * 4;
      t[n] = Math.max(0, Math.min(255, t[n] + o)), t[n + 1] = Math.max(0, Math.min(255, t[n + 1] + s)), t[n + 2] = Math.max(0, Math.min(255, t[n + 2] + a));
    }
  }
}
class I {
  /**
   * Applies random dithering to the image data.
   * @param imageData The ImageData object.
   * @param _options Image options (not directly used in this algorithm).
   * @returns The dithered ImageData.
   */
  dither(t, e) {
    const i = t.data;
    for (let r = 0; r < i.length; r += 4) {
      const o = (i[r] + i[r + 1] + i[r + 2]) / 3, s = Math.random() * 255, a = o < s ? 0 : 255;
      i[r] = i[r + 1] = i[r + 2] = a;
    }
    return t;
  }
}
class D {
  /**
   * Creates a new PixelDithering instance.
   * @param binSize The size of pixel bins (default: 3).
   * @param shadesCount Number of brightness levels (default: 20).
   */
  constructor(t = 3, e = 20) {
    v(this, "binSize");
    v(this, "shadesCount");
    this.binSize = Math.max(1, Math.floor(t)), this.shadesCount = Math.max(2, Math.floor(e));
  }
  dither(t, e) {
    const i = t.data, r = t.width, o = t.height;
    for (let s = 0; s < o; s += this.binSize)
      for (let a = 0; a < r; a += this.binSize) {
        let n = 0, c = 0;
        const l = Math.min(s + this.binSize, o), f = Math.min(a + this.binSize, r);
        for (let b = s; b < l; b++)
          for (let y = a; y < f; y++) {
            const d = (b * r + y) * 4, p = i[d], P = i[d + 1], M = i[d + 2];
            n += (p + P + M) / 3, c++;
          }
        const u = n / c, m = 255 / (this.shadesCount - 1), w = Math.min(
          Math.floor(u / m),
          this.shadesCount - 1
        ) * m;
        for (let b = s; b < l; b++)
          for (let y = a; y < f; y++) {
            const d = (b * r + y) * 4;
            i[d] = i[d + 1] = i[d + 2] = w;
          }
      }
    return t;
  }
}
class R {
  dither(t, e) {
    const i = t.data, r = t.width, o = t.height, s = 4, a = new Uint8ClampedArray(i.length);
    for (let n = 3; n < i.length; n += 4)
      a[n] = i[n];
    for (let n = 0; n < o; n++)
      for (let c = 0; c < r; c++) {
        const l = (n * r + c) * 4, f = (i[l] + i[l + 1] + i[l + 2]) / 3, u = Math.floor((255 - f) / 50), m = Math.floor(c / s) * s, g = Math.floor(n / s) * s, w = c - m, b = n - g, d = Math.sqrt(
          (w - s / 2) ** 2 + (b - s / 2) ** 2
        ) < u ? 0 : 255;
        a[l] = a[l + 1] = a[l + 2] = d;
      }
    return new ImageData(a, r, o);
  }
}
class T {
  dither(t, e) {
    const i = t.data, r = t.width, o = t.height;
    for (let s = 0; s < o; s++)
      for (let a = 0; a < r; a++) {
        const n = (s * r + a) * 4, c = (i[n] + i[n + 1] + i[n + 2]) / 3, f = (a % 5 === 0 || s % 5 === 0) && c < 128 ? 0 : 255;
        i[n] = i[n + 1] = i[n + 2] = f;
      }
    return t;
  }
}
const L = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BayerDithering: A,
  BoxDithering: T,
  DotDithering: R,
  FloydSteinbergDithering: C,
  PixelDithering: D,
  RandomDithering: I,
  ThresholdDithering: _
}, Symbol.toStringTag, { value: "Module" }));
class $ {
  /**
   * Creates an instance of the CatPrinter.
   * @param options Optional settings for the SDK.
   */
  constructor(t = {}) {
    v(this, "device", null);
    v(this, "server", null);
    v(this, "txCharacteristic", null);
    v(this, "rxCharacteristic", null);
    v(this, "printerState", {
      outOfPaper: !1,
      coverOpen: !1,
      overheat: !1,
      lowPower: !1,
      paused: !1,
      busy: !1
    });
    v(this, "options");
    v(this, "modelName", "");
    this.options = {
      debug: !1,
      speed: 32,
      energy: 24e3,
      finishFeed: 100,
      ...t
    };
  }
  /**
   * Connect to a Cat Printer device.
   * @returns A Promise that resolves with the initial printer state when connected.
   * @throws Error if Bluetooth is not available or connection fails.
   */
  async connect() {
    if (!navigator.bluetooth)
      throw new Error("Bluetooth API is not available in this browser");
    try {
      if (this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [44848] }],
        optionalServices: [44592]
      }), this.modelName = this.device.name || "", this.log(`Connected to printer model: ${this.modelName}`), !this.device.gatt)
        throw new Error("Bluetooth GATT not available");
      this.server = await this.device.gatt.connect();
      const t = await this.server.getPrimaryService(44592);
      return this.txCharacteristic = await t.getCharacteristic(44545), this.rxCharacteristic = await t.getCharacteristic(44546), await this.rxCharacteristic.startNotifications(), this.rxCharacteristic.addEventListener(
        "characteristicvaluechanged",
        this.handleNotification.bind(this)
      ), await this.getDeviceState(), await this.prepare(this.options.speed, this.options.energy), this.printerState;
    } catch (t) {
      throw console.error("Connection error:", t), t;
    }
  }
  /**
   * Disconnect from the printer.
   * @returns A Promise that resolves when disconnected.
   */
  async disconnect() {
    if (this.rxCharacteristic)
      try {
        await this.rxCharacteristic.stopNotifications();
      } catch (t) {
        this.log("Error stopping notifications:", t);
      }
    this.server && this.server.connected && this.server.disconnect(), this.device = null, this.server = null, this.txCharacteristic = null, this.rxCharacteristic = null, this.log("Disconnected from printer");
  }
  /**
   * Get the current printer state.
   * @returns The current printer state object.
   */
  getState() {
    return { ...this.printerState };
  }
  /**
   * Check if the printer is currently connected.
   * @returns True if connected, false otherwise.
   */
  isConnected() {
    var t;
    return ((t = this.server) == null ? void 0 : t.connected) === !0 && this.txCharacteristic !== null;
  }
  /**
   * Print text content.
   * @param text The text to print.
   * @param options Optional text formatting options.
   * @returns A Promise that resolves when printing is complete.
   * @throws Error if the printer is not connected.
   */
  async printText(t, e = {}) {
    if (!this.isConnected())
      throw new Error("Printer not connected");
    const r = { ...{
      fontFamily: "sans-serif",
      fontSize: 16,
      align: "start",
      lineSpacing: 8,
      rotate: 0,
      flipH: !1,
      flipV: !1,
      brightness: 128,
      offset: 0
    }, ...e }, o = await this.textToBitmap(t, r);
    r.offset && r.offset !== 0 && (await this.setSpeed(8), r.offset > 0 ? await this.feed(r.offset) : await this.retract(-r.offset), await this.setSpeed(this.options.speed)), await this.printBitmap(o);
  }
  /**
   * Print an image from a URL.
   * @param imageUrl The URL of the image to print.
   * @param options Optional image formatting options.
   * @returns A Promise that resolves when printing is complete.
   * @throws Error if the printer is not connected or the image fails to load.
   */
  async printImage(t, e = {}) {
    if (!this.isConnected())
      throw new Error("Printer not connected");
    const r = { ...{
      dither: "bayer",
      // Default to Bayer dithering as suggested
      rotate: 0,
      flipH: !1,
      flipV: !1,
      brightness: 128,
      offset: 0
    }, ...e }, o = await this.imageToBitmap(t, r);
    r.offset && r.offset !== 0 && (await this.setSpeed(8), r.offset > 0 ? await this.feed(r.offset) : await this.retract(-r.offset), await this.setSpeed(this.options.speed)), await this.printBitmap(o);
  }
  /**
   * Print multiple items (text or images) in sequence.
   * @param items An array of items to print, each with a type ('text' or 'image'), content, and optional options.
   * @returns A Promise that resolves when all items are printed.
   * @throws Error if the printer is not connected.
   */
  async printMultiple(t) {
    if (!this.isConnected())
      throw new Error("Printer not connected");
    await this.prepare(this.options.speed, this.options.energy);
    for (const e of t)
      e.type === "text" ? await this.printText(e.content, e.options) : e.type === "image" && await this.printImage(e.content, e.options);
    await this.finish(this.options.finishFeed);
  }
  /**
   * Feed paper forward by a specified number of lines.
   * @param lines The number of lines to feed.
   * @returns A Promise that resolves when the feed command is sent.
   */
  async feed(t) {
    if (t <= 0) return;
    const e = this.makeCommand(
      S.Feed,
      new Uint8Array([t & 255, t >> 8 & 255])
    );
    await this.write(e);
  }
  /**
   * Retract paper (reverse feed) by a specified number of lines.
   * @param lines The number of lines to retract.
   * @returns A Promise that resolves when the retract command is sent.
   */
  async retract(t) {
    if (t <= 0) return;
    const e = this.makeCommand(
      S.Retract,
      new Uint8Array([t & 255, t >> 8 & 255])
    );
    await this.write(e);
  }
  /**
   * Set the print speed.
   * @param speed The print speed value.
   * @returns A Promise that resolves when the speed command is sent.
   */
  async setSpeed(t) {
    const e = this.makeCommand(S.Speed, new Uint8Array([t]));
    await this.write(e);
  }
  /**
   * Set the print energy/density.
   * @param energy The energy value.
   * @returns A Promise that resolves when the energy command is sent.
   */
  async setEnergy(t) {
    const e = new Uint8Array([
      t & 255,
      t >> 8 & 255,
      t >> 16 & 255,
      t >> 24 & 255
    ]), i = this.makeCommand(S.Energy, e);
    await this.write(i);
  }
  /**
   * Apply the current energy settings to the printer.
   * @returns A Promise that resolves when the apply energy command is sent.
   */
  async applyEnergy() {
    const t = this.makeCommand(S.ApplyEnergy, new Uint8Array([1]));
    await this.write(t);
  }
  /**
   * Get the current device state from the printer.
   * @returns A Promise that resolves with the current printer state.
   */
  async getDeviceState() {
    const t = this.makeCommand(
      S.GetDeviceState,
      new Uint8Array([1])
    );
    return await this.write(t), this.printerState;
  }
  /**
   * Prepare the printer for printing by setting speed and energy.
   * @param speed The print speed.
   * @param energy The print energy/density.
   * @returns A Promise that resolves when the prepare commands are sent.
   */
  async prepare(t, e) {
    await this.setSpeed(t), await this.setEnergy(e), await this.applyEnergy();
  }
  /**
   * Finish printing with an optional paper feed.
   * @param feed The number of lines to feed at the end of printing. Default is 0.
   * @returns A Promise that resolves when the finish commands are sent.
   */
  async finish(t = 0) {
    t > 0 && (await this.setSpeed(8), await this.feed(t));
  }
  /**
   * Draw a single line of bitmap data to the printer.
   * @param line The bitmap line data as a Uint8Array.
   * @returns A Promise that resolves when the draw command is sent.
   * @throws Error if the printer is not connected.
   */
  async draw(t) {
    if (!this.isConnected())
      throw new Error("Printer not connected");
    const e = this.makeCommand(S.Bitmap, t);
    await this.write(e);
  }
  /**
   * Print a full bitmap.
   * @param bitmap An object containing the width, height, and bitmap data.
   * @returns A Promise that resolves when the entire bitmap is printed.
   */
  async printBitmap(t) {
    const { width: e, height: i, data: r } = t, o = Math.ceil(e / 8);
    for (let s = 0; s < i; s++) {
      const a = s * o, n = a + o, c = r.slice(a, n);
      c.every((l) => l === 0) || await this.draw(c);
    }
  }
  // Private methods
  /**
   * Create a command packet to send to the printer.
   * @param command The command to send.
   * @param payload The data payload for the command.
   * @param type The type of command (Transfer or Response). Default is Transfer.
   * @returns The complete command packet as a Uint8Array.
   */
  makeCommand(t, e, i = E.Transfer) {
    return new Uint8Array([
      81,
      120,
      t,
      i,
      e.length & 255,
      e.length >> 8,
      ...e,
      N(e),
      255
    ]);
  }
  /**
   * Send data to the printer via the TX characteristic.
   * @param data The data to send as a Uint8Array.
   * @returns A Promise that resolves when the data is written.
   * @throws Error if the printer is not properly connected.
   */
  async write(t) {
    if (!this.txCharacteristic)
      throw new Error("Printer not properly connected");
    this.log(
      "Sending data:",
      Array.from(t).map((e) => e.toString(16).padStart(2, "0")).join(" ")
    );
    try {
      await this.txCharacteristic.writeValueWithoutResponse(t);
    } catch (e) {
      throw this.log("Error writing to printer:", e), e;
    }
  }
  /**
   * Handle incoming notifications from the printer via the RX characteristic.
   * @param event The characteristicvaluechanged event.
   */
  handleNotification(t) {
    const e = t.target;
    if (!e.value) return;
    const i = new Uint8Array(e.value.buffer);
    if (this.log(
      "Received notification:",
      Array.from(i).map((r) => r.toString(16).padStart(2, "0")).join(" ")
    ), i.length >= 7 && i[2] === S.GetDeviceState) {
      const r = i[6];
      this.printerState = {
        outOfPaper: !!(r & 1),
        coverOpen: !!(r & 2),
        overheat: !!(r & 4),
        lowPower: !!(r & 8),
        paused: !!(r & 16),
        busy: !!(r & 128)
      }, this.log("Printer state updated:", this.printerState);
    }
  }
  /**
   * Convert text to a bitmap for printing.
   * @param text The text to convert.
   * @param options Text formatting options.
   * @returns A Promise that resolves with the bitmap data.
   */
  async textToBitmap(t, e) {
    const i = document.createElement("canvas"), r = i.getContext("2d");
    i.width = 384, i.height = 500, r.fillStyle = "white", r.fillRect(0, 0, i.width, i.height), r.fillStyle = "black";
    const o = e.fontWeight ? `${e.fontWeight} ` : "";
    r.font = `${o}${e.fontSize}px ${e.fontFamily}`, r.textAlign = e.align === "start" ? "left" : e.align === "end" ? "right" : e.align;
    const s = t.split(`
`), a = e.fontSize + (e.lineSpacing || 8);
    let n = e.fontSize;
    for (const g of s) {
      const w = e.align === "start" ? 0 : e.align === "end" ? i.width : i.width / 2;
      r.fillText(g, w, n), n += a;
    }
    const c = document.createElement("canvas");
    c.width = i.width, c.height = n;
    const l = c.getContext("2d");
    if (l.drawImage(i, 0, 0), e.rotate !== 0 || e.flipH || e.flipV) {
      const g = document.createElement("canvas");
      g.width = c.width, g.height = c.height;
      const w = g.getContext("2d");
      w.save(), w.translate(
        g.width / 2,
        g.height / 2
      ), e.rotate && e.rotate !== 0 && w.rotate(e.rotate * Math.PI / 180), e.flipH && w.scale(-1, 1), e.flipV && w.scale(1, -1), w.drawImage(
        c,
        -c.width / 2,
        -c.height / 2
      ), w.restore(), c.width = g.width, c.height = g.height, l.drawImage(g, 0, 0);
    }
    const f = l.getImageData(
      0,
      0,
      c.width,
      c.height
    ), u = new Uint32Array(f.data.buffer), m = x(u);
    return {
      width: c.width,
      height: c.height,
      data: m
    };
  }
  async imageToBitmap(t, e) {
    const i = new Image();
    i.crossOrigin = "anonymous";
    const o = await new Promise(
      (d, p) => {
        i.onload = () => d(i), i.onerror = () => p(new Error(`Failed to load image: ${t}`)), i.src = t;
      }
    ), s = document.createElement("canvas"), a = s.getContext("2d"), n = 384, c = o.width / o.height, l = Math.floor(n / c);
    if (s.width = n, s.height = l, a.fillStyle = "white", a.fillRect(0, 0, s.width, s.height), a.drawImage(o, 0, 0, n, l), e.rotate !== 0 || e.flipH || e.flipV) {
      const d = document.createElement("canvas");
      d.width = s.width, d.height = s.height;
      const p = d.getContext("2d");
      p.save(), p.translate(
        d.width / 2,
        d.height / 2
      ), e.rotate && e.rotate !== 0 && p.rotate(e.rotate * Math.PI / 180), e.flipH && p.scale(-1, 1), e.flipV && p.scale(1, -1), p.drawImage(s, -s.width / 2, -s.height / 2), p.restore(), s.width = d.width, s.height = d.height, a.drawImage(d, 0, 0);
    }
    const f = a.getImageData(0, 0, s.width, s.height);
    let u = f;
    if (e.dither && e.dither !== "none") {
      if (e.dither === "threshold")
        u = new _().dither(f, e);
      else if (e.dither === "bayer")
        u = new A().dither(f, e);
      else if (e.dither === "floyd-steinberg")
        u = new C().dither(f, e);
      else if (e.dither === "pixel")
        u = new D().dither(f, e);
      else if (e.dither === "dot") {
        const d = new R();
        u = d.dither(f, e), u = d.dither(f, e);
      } else e.dither === "box" ? u = new T().dither(f, e) : e.dither === "random" && (u = new I().dither(f, e));
      a.putImageData(u, 0, 0);
    }
    const m = a.getImageData(0, 0, s.width, s.height), g = new Uint32Array(m.data.buffer);
    let w = 128;
    (e.dither === "threshold" || e.dither === "none") && (w = e.brightness !== void 0 ? e.brightness : 128);
    const b = x(g, w), y = s.toDataURL("image/png");
    return {
      width: s.width,
      height: s.height,
      data: b,
      dataurl: y
    };
  }
  /**
   * Log debug information to the console if debugging is enabled.
   * @param args Arguments to log.
   */
  log(...t) {
    this.options.debug && console.log("[CatPrinter]", ...t);
  }
}
export {
  V as CAT_ADV_SRV,
  O as CAT_PRINT_RX_CHAR,
  U as CAT_PRINT_SRV,
  z as CAT_PRINT_TX_CHAR,
  $ as CatPrinter,
  S as Command,
  E as CommandType,
  G as DEF_CANVAS_WIDTH,
  W as DEF_ENERGY,
  X as DEF_FINISH_FEED,
  k as DEF_SPEED,
  L as Dithering,
  N as crc8,
  x as rgbaToBits
};
