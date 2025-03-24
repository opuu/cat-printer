var C = Object.defineProperty;
var R = (s, e, t) => e in s ? C(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var y = (s, e, t) => R(s, typeof e != "symbol" ? e + "" : e, t);
const F = 44848, N = 44592, B = 44545, V = 44546, H = 384, M = 32, O = 24e3, U = 100;
var v = /* @__PURE__ */ ((s) => (s[s.ApplyEnergy = 190] = "ApplyEnergy", s[s.GetDeviceState = 163] = "GetDeviceState", s[s.GetDeviceInfo = 168] = "GetDeviceInfo", s[s.UpdateDevice = 169] = "UpdateDevice", s[s.SetDpi = 164] = "SetDpi", s[s.Lattice = 166] = "Lattice", s[s.Retract = 160] = "Retract", s[s.Feed = 161] = "Feed", s[s.Speed = 189] = "Speed", s[s.Energy = 175] = "Energy", s[s.Bitmap = 162] = "Bitmap", s))(v || {}), _ = /* @__PURE__ */ ((s) => (s[s.Transfer = 0] = "Transfer", s[s.Response = 1] = "Response", s))(_ || {});
function T(s) {
  let e = 0;
  for (const t of s) {
    e ^= t;
    for (let i = 0; i < 8; i++)
      e & 128 ? e = e << 1 ^ 7 : e <<= 1;
    e &= 255;
  }
  return e;
}
function E(s, e = 128) {
  const t = new Uint8Array(Math.ceil(s.length / 8));
  for (let i = 0; i < s.length; i++) {
    const r = Math.floor(i / 8), o = i % 8, a = s[i], n = a & 255, h = a >> 8 & 255, c = a >> 16 & 255;
    (n + h + c) / 3 < e && (t[r] |= 1 << o);
  }
  return t;
}
class x {
  /**
   * Applies threshold dithering to the image data.
   * @param imageData The ImageData object.
   * @param options Image options, specifically the brightness threshold.
   * @returns The dithered ImageData.
   */
  dither(e, t) {
    const i = e.data, r = t.brightness !== void 0 ? t.brightness : 128;
    for (let o = 0; o < i.length; o += 4) {
      const n = (i[o] + i[o + 1] + i[o + 2]) / 3 < r ? 0 : 255;
      i[o] = i[o + 1] = i[o + 2] = n;
    }
    return e;
  }
}
class A {
  constructor() {
    y(this, "thresholdMap", [
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
  dither(e, t) {
    const i = e.data, r = e.width, o = e.height;
    for (let a = 0; a < o; a++)
      for (let n = 0; n < r; n++) {
        const h = (a * r + n) * 4, c = i[h], g = i[h + 1], p = i[h + 2], u = (c + g + p) / 3, m = (this.thresholdMap[a % 2][n % 2] + 1) * (255 / 5), d = u < m ? 0 : 255;
        i[h] = i[h + 1] = i[h + 2] = d;
      }
    return e;
  }
}
class D {
  /**
   * Applies Floyd-Steinberg dithering to the image data.
   * @param imageData The ImageData object.
   * @param _options Image options (not directly used in this algorithm).
   * @returns The dithered ImageData.
   */
  dither(e, t) {
    const i = e.data, r = e.width, o = e.height;
    for (let a = 0; a < o; a++)
      for (let n = 0; n < r; n++) {
        const h = (a * r + n) * 4, c = i[h], g = i[h + 1], p = i[h + 2], m = (c + g + p) / 3 < 128 ? 0 : 255, d = m, f = m, b = m;
        i[h] = d, i[h + 1] = f, i[h + 2] = b;
        const S = c - d, l = g - f, w = p - b;
        this.distributeError(
          i,
          r,
          n + 1,
          a,
          S * 7 / 16,
          l * 7 / 16,
          w * 7 / 16
        ), this.distributeError(
          i,
          r,
          n - 1,
          a + 1,
          S * 3 / 16,
          l * 3 / 16,
          w * 3 / 16
        ), this.distributeError(
          i,
          r,
          n,
          a + 1,
          S * 5 / 16,
          l * 5 / 16,
          w * 5 / 16
        ), this.distributeError(
          i,
          r,
          n + 1,
          a + 1,
          S * 1 / 16,
          l * 1 / 16,
          w * 1 / 16
        );
      }
    return e;
  }
  distributeError(e, t, i, r, o, a, n) {
    if (i >= 0 && i < t && r >= 0 && r < e.length / (t * 4)) {
      const h = (r * t + i) * 4;
      e[h] = Math.max(0, Math.min(255, e[h] + o)), e[h + 1] = Math.max(0, Math.min(255, e[h + 1] + a)), e[h + 2] = Math.max(0, Math.min(255, e[h + 2] + n));
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
  dither(e, t) {
    const i = e.data;
    for (let r = 0; r < i.length; r += 4) {
      const o = (i[r] + i[r + 1] + i[r + 2]) / 3, a = Math.random() * 255, n = o < a ? 0 : 255;
      i[r] = i[r + 1] = i[r + 2] = n;
    }
    return e;
  }
}
const G = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BayerDithering: A,
  FloydSteinbergDithering: D,
  RandomDithering: I,
  ThresholdDithering: x
}, Symbol.toStringTag, { value: "Module" }));
class k {
  /**
   * Creates an instance of the CatPrinter.
   * @param options Optional settings for the SDK.
   */
  constructor(e = {}) {
    y(this, "device", null);
    y(this, "server", null);
    y(this, "txCharacteristic", null);
    y(this, "rxCharacteristic", null);
    y(this, "printerState", {
      outOfPaper: !1,
      coverOpen: !1,
      overheat: !1,
      lowPower: !1,
      paused: !1,
      busy: !1
    });
    y(this, "options");
    y(this, "modelName", "");
    this.options = {
      debug: !1,
      speed: 32,
      energy: 24e3,
      finishFeed: 100,
      ...e
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
      const e = await this.server.getPrimaryService(44592);
      return this.txCharacteristic = await e.getCharacteristic(44545), this.rxCharacteristic = await e.getCharacteristic(44546), await this.rxCharacteristic.startNotifications(), this.rxCharacteristic.addEventListener(
        "characteristicvaluechanged",
        this.handleNotification.bind(this)
      ), await this.getDeviceState(), await this.prepare(this.options.speed, this.options.energy), this.printerState;
    } catch (e) {
      throw console.error("Connection error:", e), e;
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
      } catch (e) {
        this.log("Error stopping notifications:", e);
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
    var e;
    return ((e = this.server) == null ? void 0 : e.connected) === !0 && this.txCharacteristic !== null;
  }
  /**
   * Print text content.
   * @param text The text to print.
   * @param options Optional text formatting options.
   * @returns A Promise that resolves when printing is complete.
   * @throws Error if the printer is not connected.
   */
  async printText(e, t = {}) {
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
    }, ...t }, o = await this.textToBitmap(e, r);
    r.offset && r.offset !== 0 && (await this.setSpeed(8), r.offset > 0 ? await this.feed(r.offset) : await this.retract(-r.offset), await this.setSpeed(this.options.speed)), await this.printBitmap(o);
  }
  /**
   * Print an image from a URL.
   * @param imageUrl The URL of the image to print.
   * @param options Optional image formatting options.
   * @returns A Promise that resolves when printing is complete.
   * @throws Error if the printer is not connected or the image fails to load.
   */
  async printImage(e, t = {}) {
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
    }, ...t }, o = await this.imageToBitmap(e, r);
    r.offset && r.offset !== 0 && (await this.setSpeed(8), r.offset > 0 ? await this.feed(r.offset) : await this.retract(-r.offset), await this.setSpeed(this.options.speed)), await this.printBitmap(o);
  }
  /**
   * Print multiple items (text or images) in sequence.
   * @param items An array of items to print, each with a type ('text' or 'image'), content, and optional options.
   * @returns A Promise that resolves when all items are printed.
   * @throws Error if the printer is not connected.
   */
  async printMultiple(e) {
    if (!this.isConnected())
      throw new Error("Printer not connected");
    await this.prepare(this.options.speed, this.options.energy);
    for (const t of e)
      t.type === "text" ? await this.printText(t.content, t.options) : t.type === "image" && await this.printImage(t.content, t.options);
    await this.finish(this.options.finishFeed);
  }
  /**
   * Feed paper forward by a specified number of lines.
   * @param lines The number of lines to feed.
   * @returns A Promise that resolves when the feed command is sent.
   */
  async feed(e) {
    if (e <= 0) return;
    const t = this.makeCommand(
      v.Feed,
      new Uint8Array([e & 255, e >> 8 & 255])
    );
    await this.write(t);
  }
  /**
   * Retract paper (reverse feed) by a specified number of lines.
   * @param lines The number of lines to retract.
   * @returns A Promise that resolves when the retract command is sent.
   */
  async retract(e) {
    if (e <= 0) return;
    const t = this.makeCommand(
      v.Retract,
      new Uint8Array([e & 255, e >> 8 & 255])
    );
    await this.write(t);
  }
  /**
   * Set the print speed.
   * @param speed The print speed value.
   * @returns A Promise that resolves when the speed command is sent.
   */
  async setSpeed(e) {
    const t = this.makeCommand(v.Speed, new Uint8Array([e]));
    await this.write(t);
  }
  /**
   * Set the print energy/density.
   * @param energy The energy value.
   * @returns A Promise that resolves when the energy command is sent.
   */
  async setEnergy(e) {
    const t = new Uint8Array([
      e & 255,
      e >> 8 & 255,
      e >> 16 & 255,
      e >> 24 & 255
    ]), i = this.makeCommand(v.Energy, t);
    await this.write(i);
  }
  /**
   * Apply the current energy settings to the printer.
   * @returns A Promise that resolves when the apply energy command is sent.
   */
  async applyEnergy() {
    const e = this.makeCommand(v.ApplyEnergy, new Uint8Array([1]));
    await this.write(e);
  }
  /**
   * Get the current device state from the printer.
   * @returns A Promise that resolves with the current printer state.
   */
  async getDeviceState() {
    const e = this.makeCommand(
      v.GetDeviceState,
      new Uint8Array([1])
    );
    return await this.write(e), this.printerState;
  }
  /**
   * Prepare the printer for printing by setting speed and energy.
   * @param speed The print speed.
   * @param energy The print energy/density.
   * @returns A Promise that resolves when the prepare commands are sent.
   */
  async prepare(e, t) {
    await this.setSpeed(e), await this.setEnergy(t), await this.applyEnergy();
  }
  /**
   * Finish printing with an optional paper feed.
   * @param feed The number of lines to feed at the end of printing. Default is 0.
   * @returns A Promise that resolves when the finish commands are sent.
   */
  async finish(e = 0) {
    e > 0 && (await this.setSpeed(8), await this.feed(e));
  }
  /**
   * Draw a single line of bitmap data to the printer.
   * @param line The bitmap line data as a Uint8Array.
   * @returns A Promise that resolves when the draw command is sent.
   * @throws Error if the printer is not connected.
   */
  async draw(e) {
    if (!this.isConnected())
      throw new Error("Printer not connected");
    const t = this.makeCommand(v.Bitmap, e);
    await this.write(t);
  }
  /**
   * Print a full bitmap.
   * @param bitmap An object containing the width, height, and bitmap data.
   * @returns A Promise that resolves when the entire bitmap is printed.
   */
  async printBitmap(e) {
    const { width: t, height: i, data: r } = e, o = Math.ceil(t / 8);
    for (let a = 0; a < i; a++) {
      const n = a * o, h = n + o, c = r.slice(n, h);
      c.every((g) => g === 0) || await this.draw(c);
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
  makeCommand(e, t, i = _.Transfer) {
    return new Uint8Array([
      81,
      120,
      e,
      i,
      t.length & 255,
      t.length >> 8,
      ...t,
      T(t),
      255
    ]);
  }
  /**
   * Send data to the printer via the TX characteristic.
   * @param data The data to send as a Uint8Array.
   * @returns A Promise that resolves when the data is written.
   * @throws Error if the printer is not properly connected.
   */
  async write(e) {
    if (!this.txCharacteristic)
      throw new Error("Printer not properly connected");
    this.log(
      "Sending data:",
      Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join(" ")
    );
    try {
      await this.txCharacteristic.writeValueWithoutResponse(e);
    } catch (t) {
      throw this.log("Error writing to printer:", t), t;
    }
  }
  /**
   * Handle incoming notifications from the printer via the RX characteristic.
   * @param event The characteristicvaluechanged event.
   */
  handleNotification(e) {
    const t = e.target;
    if (!t.value) return;
    const i = new Uint8Array(t.value.buffer);
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
  async textToBitmap(e, t) {
    const i = document.createElement("canvas"), r = i.getContext("2d");
    i.width = 384, i.height = 500, r.fillStyle = "white", r.fillRect(0, 0, i.width, i.height), r.fillStyle = "black";
    const o = t.fontWeight ? `${t.fontWeight} ` : "";
    r.font = `${o}${t.fontSize}px ${t.fontFamily}`, r.textAlign = t.align === "start" ? "left" : t.align === "end" ? "right" : t.align;
    const a = e.split(`
`), n = t.fontSize + (t.lineSpacing || 8);
    let h = t.fontSize;
    for (const d of a) {
      const f = t.align === "start" ? 0 : t.align === "end" ? i.width : i.width / 2;
      r.fillText(d, f, h), h += n;
    }
    const c = document.createElement("canvas");
    c.width = i.width, c.height = h;
    const g = c.getContext("2d");
    if (g.drawImage(i, 0, 0), t.rotate !== 0 || t.flipH || t.flipV) {
      const d = document.createElement("canvas");
      d.width = c.width, d.height = c.height;
      const f = d.getContext("2d");
      f.save(), f.translate(
        d.width / 2,
        d.height / 2
      ), t.rotate && t.rotate !== 0 && f.rotate(t.rotate * Math.PI / 180), t.flipH && f.scale(-1, 1), t.flipV && f.scale(1, -1), f.drawImage(
        c,
        -c.width / 2,
        -c.height / 2
      ), f.restore(), c.width = d.width, c.height = d.height, g.drawImage(d, 0, 0);
    }
    const p = g.getImageData(
      0,
      0,
      c.width,
      c.height
    ), u = new Uint32Array(p.data.buffer), m = E(u);
    return {
      width: c.width,
      height: c.height,
      data: m
    };
  }
  async imageToBitmap(e, t) {
    const i = new Image();
    i.crossOrigin = "anonymous";
    const o = await new Promise(
      (l, w) => {
        i.onload = () => l(i), i.onerror = () => w(new Error(`Failed to load image: ${e}`)), i.src = e;
      }
    ), a = document.createElement("canvas"), n = a.getContext("2d"), h = 384, c = o.width / o.height, g = Math.floor(h / c);
    if (a.width = h, a.height = g, n.fillStyle = "white", n.fillRect(0, 0, a.width, a.height), n.drawImage(o, 0, 0, h, g), t.rotate !== 0 || t.flipH || t.flipV) {
      const l = document.createElement("canvas");
      l.width = a.width, l.height = a.height;
      const w = l.getContext("2d");
      w.save(), w.translate(
        l.width / 2,
        l.height / 2
      ), t.rotate && t.rotate !== 0 && w.rotate(t.rotate * Math.PI / 180), t.flipH && w.scale(-1, 1), t.flipV && w.scale(1, -1), w.drawImage(a, -a.width / 2, -a.height / 2), w.restore(), a.width = l.width, a.height = l.height, n.drawImage(l, 0, 0);
    }
    const p = n.getImageData(0, 0, a.width, a.height);
    let u = p;
    t.dither && t.dither !== "none" && (t.dither === "threshold" ? u = new x().dither(p, t) : t.dither === "bayer" ? u = new A().dither(p, t) : t.dither === "floyd-steinberg" ? u = new D().dither(p, t) : t.dither === "random" && (u = new I().dither(p, t)), n.putImageData(u, 0, 0));
    const m = n.getImageData(0, 0, a.width, a.height), d = new Uint32Array(m.data.buffer);
    let f = 128;
    (t.dither === "threshold" || t.dither === "none") && (f = t.brightness !== void 0 ? t.brightness : 128);
    const b = E(d, f), S = a.toDataURL("image/png");
    return {
      width: a.width,
      height: a.height,
      data: b,
      dataurl: S
    };
  }
  /**
   * Log debug information to the console if debugging is enabled.
   * @param args Arguments to log.
   */
  log(...e) {
    this.options.debug && console.log("[CatPrinter]", ...e);
  }
}
export {
  F as CAT_ADV_SRV,
  V as CAT_PRINT_RX_CHAR,
  N as CAT_PRINT_SRV,
  B as CAT_PRINT_TX_CHAR,
  k as CatPrinter,
  v as Command,
  _ as CommandType,
  H as DEF_CANVAS_WIDTH,
  O as DEF_ENERGY,
  U as DEF_FINISH_FEED,
  M as DEF_SPEED,
  G as Dithering,
  T as crc8,
  E as rgbaToBits
};
