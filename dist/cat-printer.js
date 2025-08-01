var C = Object.defineProperty;
var R = (s, t, e) => t in s ? C(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var m = (s, t, e) => R(s, typeof t != "symbol" ? t + "" : t, e);
const F = 44848, N = 44592, M = 44545, V = 44546, B = 384, H = 32, U = 24e3, O = 100;
var v = /* @__PURE__ */ ((s) => (s[s.ApplyEnergy = 190] = "ApplyEnergy", s[s.GetDeviceState = 163] = "GetDeviceState", s[s.GetDeviceInfo = 168] = "GetDeviceInfo", s[s.UpdateDevice = 169] = "UpdateDevice", s[s.SetDpi = 164] = "SetDpi", s[s.Lattice = 166] = "Lattice", s[s.Retract = 160] = "Retract", s[s.Feed = 161] = "Feed", s[s.Speed = 189] = "Speed", s[s.Energy = 175] = "Energy", s[s.Bitmap = 162] = "Bitmap", s))(v || {}), x = /* @__PURE__ */ ((s) => (s[s.Transfer = 0] = "Transfer", s[s.Response = 1] = "Response", s))(x || {});
function T(s) {
  let t = 0;
  for (const e of s) {
    t ^= e;
    for (let i = 0; i < 8; i++)
      t & 128 ? t = t << 1 ^ 7 : t <<= 1;
    t &= 255;
  }
  return t;
}
function E(s, t = 128) {
  const e = new Uint8Array(Math.ceil(s.length / 8));
  for (let i = 0; i < s.length; i++) {
    const r = Math.floor(i / 8), o = i % 8, n = s[i], h = n & 255, a = n >> 8 & 255, c = n >> 16 & 255;
    (h + a + c) / 3 < t && (e[r] |= 1 << o);
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
      const h = (i[o] + i[o + 1] + i[o + 2]) / 3 < r ? 0 : 255;
      i[o] = i[o + 1] = i[o + 2] = h;
    }
    return t;
  }
}
class A {
  constructor() {
    m(this, "thresholdMap", [
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
    for (let n = 0; n < o; n++)
      for (let h = 0; h < r; h++) {
        const a = (n * r + h) * 4, c = i[a], l = i[a + 1], w = i[a + 2], u = (c + l + w) / 3, y = (this.thresholdMap[n % 2][h % 2] + 1) * (255 / 5), f = u < y ? 0 : 255;
        i[a] = i[a + 1] = i[a + 2] = f;
      }
    return t;
  }
}
class D {
  /**
   * Applies Floyd-Steinberg dithering to the image data.
   * @param imageData The ImageData object.
   * @param _options Image options (not directly used in this algorithm).
   * @returns The dithered ImageData.
   */
  dither(t, e) {
    const i = t.data, r = t.width, o = t.height;
    for (let n = 0; n < o; n++)
      for (let h = 0; h < r; h++) {
        const a = (n * r + h) * 4, c = i[a], l = i[a + 1], w = i[a + 2], y = (c + l + w) / 3 < 128 ? 0 : 255, f = y, g = y, b = y;
        i[a] = f, i[a + 1] = g, i[a + 2] = b;
        const S = c - f, d = l - g, p = w - b;
        this.distributeError(
          i,
          r,
          h + 1,
          n,
          S * 7 / 16,
          d * 7 / 16,
          p * 7 / 16
        ), this.distributeError(
          i,
          r,
          h - 1,
          n + 1,
          S * 3 / 16,
          d * 3 / 16,
          p * 3 / 16
        ), this.distributeError(
          i,
          r,
          h,
          n + 1,
          S * 5 / 16,
          d * 5 / 16,
          p * 5 / 16
        ), this.distributeError(
          i,
          r,
          h + 1,
          n + 1,
          S * 1 / 16,
          d * 1 / 16,
          p * 1 / 16
        );
      }
    return t;
  }
  distributeError(t, e, i, r, o, n, h) {
    if (i >= 0 && i < e && r >= 0 && r < t.length / (e * 4)) {
      const a = (r * e + i) * 4;
      t[a] = Math.max(0, Math.min(255, t[a] + o)), t[a + 1] = Math.max(0, Math.min(255, t[a + 1] + n)), t[a + 2] = Math.max(0, Math.min(255, t[a + 2] + h));
    }
  }
}
class I {
  dither(t, e) {
    const i = t.data, r = t.width, o = t.height, n = 4, h = new Uint8ClampedArray(i.length);
    for (let a = 3; a < i.length; a += 4)
      h[a] = i[a];
    for (let a = 0; a < o; a++)
      for (let c = 0; c < r; c++) {
        const l = (a * r + c) * 4, w = (i[l] + i[l + 1] + i[l + 2]) / 3, u = Math.floor((255 - w) / 50), y = Math.floor(c / n) * n, f = Math.floor(a / n) * n, g = c - y, b = a - f, d = Math.sqrt(
          (g - n / 2) ** 2 + (b - n / 2) ** 2
        ) < u ? 0 : 255;
        h[l] = h[l + 1] = h[l + 2] = d;
      }
    return new ImageData(h, r, o);
  }
}
const G = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BayerDithering: A,
  DotDithering: I,
  FloydSteinbergDithering: D,
  ThresholdDithering: _
}, Symbol.toStringTag, { value: "Module" }));
class k {
  /**
   * Creates an instance of the CatPrinter.
   * @param options Optional settings for the SDK.
   */
  constructor(t = {}) {
    m(this, "device", null);
    m(this, "server", null);
    m(this, "txCharacteristic", null);
    m(this, "rxCharacteristic", null);
    m(this, "printerState", {
      outOfPaper: !1,
      coverOpen: !1,
      overheat: !1,
      lowPower: !1,
      paused: !1,
      busy: !1
    });
    m(this, "options");
    m(this, "modelName", "");
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
      v.Feed,
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
      v.Retract,
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
    const e = this.makeCommand(v.Speed, new Uint8Array([t]));
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
    ]), i = this.makeCommand(v.Energy, e);
    await this.write(i);
  }
  /**
   * Apply the current energy settings to the printer.
   * @returns A Promise that resolves when the apply energy command is sent.
   */
  async applyEnergy() {
    const t = this.makeCommand(v.ApplyEnergy, new Uint8Array([1]));
    await this.write(t);
  }
  /**
   * Get the current device state from the printer.
   * @returns A Promise that resolves with the current printer state.
   */
  async getDeviceState() {
    const t = this.makeCommand(
      v.GetDeviceState,
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
    const e = this.makeCommand(v.Bitmap, t);
    await this.write(e);
  }
  /**
   * Print a full bitmap.
   * @param bitmap An object containing the width, height, and bitmap data.
   * @returns A Promise that resolves when the entire bitmap is printed.
   */
  async printBitmap(t) {
    const { width: e, height: i, data: r } = t, o = Math.ceil(e / 8);
    for (let n = 0; n < i; n++) {
      const h = n * o, a = h + o, c = r.slice(h, a);
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
  makeCommand(t, e, i = x.Transfer) {
    return new Uint8Array([
      81,
      120,
      t,
      i,
      e.length & 255,
      e.length >> 8,
      ...e,
      T(e),
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
    ), i.length >= 7 && i[2] === v.GetDeviceState) {
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
    const n = t.split(`
`), h = e.fontSize + (e.lineSpacing || 8);
    let a = e.fontSize;
    for (const f of n) {
      const g = e.align === "start" ? 0 : e.align === "end" ? i.width : i.width / 2;
      r.fillText(f, g, a), a += h;
    }
    const c = document.createElement("canvas");
    c.width = i.width, c.height = a;
    const l = c.getContext("2d");
    if (l.drawImage(i, 0, 0), e.rotate !== 0 || e.flipH || e.flipV) {
      const f = document.createElement("canvas");
      f.width = c.width, f.height = c.height;
      const g = f.getContext("2d");
      g.save(), g.translate(
        f.width / 2,
        f.height / 2
      ), e.rotate && e.rotate !== 0 && g.rotate(e.rotate * Math.PI / 180), e.flipH && g.scale(-1, 1), e.flipV && g.scale(1, -1), g.drawImage(
        c,
        -c.width / 2,
        -c.height / 2
      ), g.restore(), c.width = f.width, c.height = f.height, l.drawImage(f, 0, 0);
    }
    const w = l.getImageData(
      0,
      0,
      c.width,
      c.height
    ), u = new Uint32Array(w.data.buffer), y = E(u);
    return {
      width: c.width,
      height: c.height,
      data: y
    };
  }
  async imageToBitmap(t, e) {
    const i = new Image();
    i.crossOrigin = "anonymous";
    const o = await new Promise(
      (d, p) => {
        i.onload = () => d(i), i.onerror = () => p(new Error(`Failed to load image: ${t}`)), i.src = t;
      }
    ), n = document.createElement("canvas"), h = n.getContext("2d"), a = 384, c = o.width / o.height, l = Math.floor(a / c);
    if (n.width = a, n.height = l, h.fillStyle = "white", h.fillRect(0, 0, n.width, n.height), h.drawImage(o, 0, 0, a, l), e.rotate !== 0 || e.flipH || e.flipV) {
      const d = document.createElement("canvas");
      d.width = n.width, d.height = n.height;
      const p = d.getContext("2d");
      p.save(), p.translate(
        d.width / 2,
        d.height / 2
      ), e.rotate && e.rotate !== 0 && p.rotate(e.rotate * Math.PI / 180), e.flipH && p.scale(-1, 1), e.flipV && p.scale(1, -1), p.drawImage(n, -n.width / 2, -n.height / 2), p.restore(), n.width = d.width, n.height = d.height, h.drawImage(d, 0, 0);
    }
    const w = h.getImageData(0, 0, n.width, n.height);
    let u = w;
    e.dither && e.dither !== "none" && (e.dither === "threshold" ? u = new _().dither(w, e) : e.dither === "bayer" ? u = new A().dither(w, e) : e.dither === "floyd-steinberg" ? u = new D().dither(w, e) : e.dither === "dot" && (u = new I().dither(w, e)), h.putImageData(u, 0, 0));
    const y = h.getImageData(0, 0, n.width, n.height), f = new Uint32Array(y.data.buffer);
    let g = 128;
    (e.dither === "threshold" || e.dither === "none") && (g = e.brightness !== void 0 ? e.brightness : 128);
    const b = E(f, g), S = n.toDataURL("image/png");
    return {
      width: n.width,
      height: n.height,
      data: b,
      dataurl: S
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
  F as CAT_ADV_SRV,
  V as CAT_PRINT_RX_CHAR,
  N as CAT_PRINT_SRV,
  M as CAT_PRINT_TX_CHAR,
  k as CatPrinter,
  v as Command,
  x as CommandType,
  B as DEF_CANVAS_WIDTH,
  U as DEF_ENERGY,
  O as DEF_FINISH_FEED,
  H as DEF_SPEED,
  G as Dithering,
  T as crc8,
  E as rgbaToBits
};
