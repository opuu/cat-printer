/**
 * @module CatPrinter
 */

import {
  CAT_ADV_SRV,
  CAT_PRINT_SRV,
  CAT_PRINT_TX_CHAR,
  CAT_PRINT_RX_CHAR,
  DEF_CANVAS_WIDTH,
  DEF_SPEED,
  DEF_ENERGY,
  DEF_FINISH_FEED,
} from './constants';
import { Command, CommandType } from './enums';
import {
  PrinterOptions,
  TextOptions,
  ImageOptions,
  PrinterState,
} from './types';
import { crc8, rgbaToBits } from './utils';
import {
  ThresholdDithering,
  BayerDithering,
  FloydSteinbergDithering,
  RandomDithering,
} from './dithering';

/**
 * Cat Printer
 * A library to connect and print with Bluetooth "Cat Printers".
 */
export class CatPrinter {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private txCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private rxCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private printerState: PrinterState = {
    outOfPaper: false,
    coverOpen: false,
    overheat: false,
    lowPower: false,
    paused: false,
    busy: false,
  };
  private options: PrinterOptions;
  private modelName: string = '';

  /**
   * Creates an instance of the CatPrinter.
   * @param options Optional settings for the SDK.
   */
  constructor(options: PrinterOptions = {}) {
    this.options = {
      debug: false,
      speed: DEF_SPEED,
      energy: DEF_ENERGY,
      finishFeed: DEF_FINISH_FEED,
      ...options,
    };
  }

  /**
   * Connect to a Cat Printer device.
   * @returns A Promise that resolves with the initial printer state when connected.
   * @throws Error if Bluetooth is not available or connection fails.
   */
  async connect(): Promise<PrinterState> {
    if (!navigator.bluetooth) {
      throw new Error('Bluetooth API is not available in this browser');
    }

    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [CAT_ADV_SRV] }],
        optionalServices: [CAT_PRINT_SRV],
      });

      this.modelName = this.device.name || '';
      this.log(`Connected to printer model: ${this.modelName}`);

      if (!this.device.gatt) {
        throw new Error('Bluetooth GATT not available');
      }

      this.server = await this.device.gatt.connect();
      const service = await this.server.getPrimaryService(CAT_PRINT_SRV);

      this.txCharacteristic =
        await service.getCharacteristic(CAT_PRINT_TX_CHAR);
      this.rxCharacteristic =
        await service.getCharacteristic(CAT_PRINT_RX_CHAR);

      await this.rxCharacteristic.startNotifications();
      this.rxCharacteristic.addEventListener(
        'characteristicvaluechanged',
        this.handleNotification.bind(this)
      );

      // Initialize printer
      await this.getDeviceState();
      await this.prepare(this.options.speed!, this.options.energy!);

      return this.printerState;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  /**
   * Disconnect from the printer.
   * @returns A Promise that resolves when disconnected.
   */
  async disconnect(): Promise<void> {
    if (this.rxCharacteristic) {
      try {
        await this.rxCharacteristic.stopNotifications();
      } catch (e) {
        this.log('Error stopping notifications:', e);
      }
    }

    if (this.server && this.server.connected) {
      this.server.disconnect();
    }

    this.device = null;
    this.server = null;
    this.txCharacteristic = null;
    this.rxCharacteristic = null;
    this.log('Disconnected from printer');
  }

  /**
   * Get the current printer state.
   * @returns The current printer state object.
   */
  getState(): PrinterState {
    return { ...this.printerState };
  }

  /**
   * Check if the printer is currently connected.
   * @returns True if connected, false otherwise.
   */
  isConnected(): boolean {
    return this.server?.connected === true && this.txCharacteristic !== null;
  }

  /**
   * Print text content.
   * @param text The text to print.
   * @param options Optional text formatting options.
   * @returns A Promise that resolves when printing is complete.
   * @throws Error if the printer is not connected.
   */
  async printText(text: string, options: TextOptions = {}): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Printer not connected');
    }

    const defaultOptions: TextOptions = {
      fontFamily: 'sans-serif',
      fontSize: 16,
      align: 'start',
      lineSpacing: 8,
      rotate: 0,
      flipH: false,
      flipV: false,
      brightness: 128,
      offset: 0,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // Convert text to bitmap
    const bitmapData = await this.textToBitmap(text, mergedOptions);

    // Handle offset if specified
    if (mergedOptions.offset && mergedOptions.offset !== 0) {
      await this.setSpeed(8); // Slower speed for feeding
      if (mergedOptions.offset > 0) {
        await this.feed(mergedOptions.offset);
      } else {
        await this.retract(-mergedOptions.offset);
      }
      await this.setSpeed(this.options.speed!);
    }

    // Print the bitmap
    await this.printBitmap(bitmapData);
  }

  /**
   * Print an image from a URL.
   * @param imageUrl The URL of the image to print.
   * @param options Optional image formatting options.
   * @returns A Promise that resolves when printing is complete.
   * @throws Error if the printer is not connected or the image fails to load.
   */
  async printImage(
    imageUrl: string,
    options: ImageOptions = {}
  ): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Printer not connected');
    }

    const defaultOptions: ImageOptions = {
      dither: 'bayer', // Default to Bayer dithering as suggested
      rotate: 0,
      flipH: false,
      flipV: false,
      brightness: 128,
      offset: 0,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // Convert image to bitmap
    const bitmapData = await this.imageToBitmap(imageUrl, mergedOptions);

    // Handle offset if specified
    if (mergedOptions.offset && mergedOptions.offset !== 0) {
      await this.setSpeed(8); // Slower speed for feeding
      if (mergedOptions.offset > 0) {
        await this.feed(mergedOptions.offset);
      } else {
        await this.retract(-mergedOptions.offset);
      }
      await this.setSpeed(this.options.speed!);
    }

    // Print the bitmap
    await this.printBitmap(bitmapData);
  }

  /**
   * Print multiple items (text or images) in sequence.
   * @param items An array of items to print, each with a type ('text' or 'image'), content, and optional options.
   * @returns A Promise that resolves when all items are printed.
   * @throws Error if the printer is not connected.
   */
  async printMultiple(
    items: Array<{
      type: 'text' | 'image';
      content: string;
      options?: TextOptions | ImageOptions;
    }>
  ): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Printer not connected');
    }

    await this.prepare(this.options.speed!, this.options.energy!);

    for (const item of items) {
      if (item.type === 'text') {
        await this.printText(item.content, item.options as TextOptions);
      } else if (item.type === 'image') {
        await this.printImage(item.content, item.options as ImageOptions);
      }
    }

    await this.finish(this.options.finishFeed!);
  }

  /**
   * Feed paper forward by a specified number of lines.
   * @param lines The number of lines to feed.
   * @returns A Promise that resolves when the feed command is sent.
   */
  async feed(lines: number): Promise<void> {
    if (lines <= 0) return;

    const command = this.makeCommand(
      Command.Feed,
      new Uint8Array([lines & 0xff, (lines >> 8) & 0xff])
    );

    await this.write(command);
  }

  /**
   * Retract paper (reverse feed) by a specified number of lines.
   * @param lines The number of lines to retract.
   * @returns A Promise that resolves when the retract command is sent.
   */
  async retract(lines: number): Promise<void> {
    if (lines <= 0) return;

    const command = this.makeCommand(
      Command.Retract,
      new Uint8Array([lines & 0xff, (lines >> 8) & 0xff])
    );

    await this.write(command);
  }

  /**
   * Set the print speed.
   * @param speed The print speed value.
   * @returns A Promise that resolves when the speed command is sent.
   */
  async setSpeed(speed: number): Promise<void> {
    const command = this.makeCommand(Command.Speed, new Uint8Array([speed]));
    await this.write(command);
  }

  /**
   * Set the print energy/density.
   * @param energy The energy value.
   * @returns A Promise that resolves when the energy command is sent.
   */
  async setEnergy(energy: number): Promise<void> {
    const payload = new Uint8Array([
      energy & 0xff,
      (energy >> 8) & 0xff,
      (energy >> 16) & 0xff,
      (energy >> 24) & 0xff,
    ]);

    const command = this.makeCommand(Command.Energy, payload);
    await this.write(command);
  }

  /**
   * Apply the current energy settings to the printer.
   * @returns A Promise that resolves when the apply energy command is sent.
   */
  async applyEnergy(): Promise<void> {
    const command = this.makeCommand(Command.ApplyEnergy, new Uint8Array([1]));
    await this.write(command);
  }

  /**
   * Get the current device state from the printer.
   * @returns A Promise that resolves with the current printer state.
   */
  async getDeviceState(): Promise<PrinterState> {
    const command = this.makeCommand(
      Command.GetDeviceState,
      new Uint8Array([1])
    );
    await this.write(command);
    return this.printerState;
  }

  /**
   * Prepare the printer for printing by setting speed and energy.
   * @param speed The print speed.
   * @param energy The print energy/density.
   * @returns A Promise that resolves when the prepare commands are sent.
   */
  async prepare(speed: number, energy: number): Promise<void> {
    await this.setSpeed(speed);
    await this.setEnergy(energy);
    await this.applyEnergy();
  }

  /**
   * Finish printing with an optional paper feed.
   * @param feed The number of lines to feed at the end of printing. Default is 0.
   * @returns A Promise that resolves when the finish commands are sent.
   */
  async finish(feed: number = 0): Promise<void> {
    if (feed > 0) {
      await this.setSpeed(8); // Slower speed for final feed
      await this.feed(feed);
    }
  }

  /**
   * Draw a single line of bitmap data to the printer.
   * @param line The bitmap line data as a Uint8Array.
   * @returns A Promise that resolves when the draw command is sent.
   * @throws Error if the printer is not connected.
   */
  async draw(line: Uint8Array): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Printer not connected');
    }

    const command = this.makeCommand(Command.Bitmap, line);
    await this.write(command);
  }

  /**
   * Print a full bitmap.
   * @param bitmap An object containing the width, height, and bitmap data.
   * @returns A Promise that resolves when the entire bitmap is printed.
   */
  async printBitmap(bitmap: {
    width: number;
    height: number;
    data: Uint8Array;
  }): Promise<void> {
    const { width, height, data } = bitmap;
    const pitch = Math.ceil(width / 8); // Bytes per line

    for (let y = 0; y < height; y++) {
      const lineStart = y * pitch;
      const lineEnd = lineStart + pitch;
      const line = data.slice(lineStart, lineEnd);

      // Skip empty lines (all zeros)
      if (line.every(byte => byte === 0)) continue;

      await this.draw(line);
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
  private makeCommand(
    command: Command,
    payload: Uint8Array,
    type: CommandType = CommandType.Transfer
  ): Uint8Array {
    return new Uint8Array([
      0x51,
      0x78,
      command,
      type,
      payload.length & 0xff,
      payload.length >> 8,
      ...payload,
      crc8(payload),
      0xff,
    ]);
  }

  /**
   * Send data to the printer via the TX characteristic.
   * @param data The data to send as a Uint8Array.
   * @returns A Promise that resolves when the data is written.
   * @throws Error if the printer is not properly connected.
   */
  private async write(data: Uint8Array): Promise<void> {
    if (!this.txCharacteristic) {
      throw new Error('Printer not properly connected');
    }

    this.log(
      'Sending data:',
      Array.from(data)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(' ')
    );

    try {
      await this.txCharacteristic.writeValueWithoutResponse(data);
    } catch (error) {
      this.log('Error writing to printer:', error);
      throw error;
    }
  }

  /**
   * Handle incoming notifications from the printer via the RX characteristic.
   * @param event The characteristicvaluechanged event.
   */
  private handleNotification(event: Event): void {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    if (!target.value) return;

    const data = new Uint8Array(target.value.buffer);
    this.log(
      'Received notification:',
      Array.from(data)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(' ')
    );

    // Handle printer state update
    if (data.length >= 7 && data[2] === Command.GetDeviceState) {
      const state = data[6];
      this.printerState = {
        outOfPaper: !!(state & 0x01),
        coverOpen: !!(state & 0x02),
        overheat: !!(state & 0x04),
        lowPower: !!(state & 0x08),
        paused: !!(state & 0x10),
        busy: !!(state & 0x80),
      };

      this.log('Printer state updated:', this.printerState);
    }
  }

  /**
   * Convert text to a bitmap for printing.
   * @param text The text to convert.
   * @param options Text formatting options.
   * @returns A Promise that resolves with the bitmap data.
   */
  private async textToBitmap(
    text: string,
    options: TextOptions
  ): Promise<{ width: number; height: number; data: Uint8Array }> {
    // Create canvas for rendering text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Set canvas dimensions
    canvas.width = DEF_CANVAS_WIDTH;
    canvas.height = 500; // Start with a tall canvas and we'll trim it

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.fillStyle = 'black';
    const fontWeight = options.fontWeight ? `${options.fontWeight} ` : '';
    ctx.font = `${fontWeight}${options.fontSize}px ${options.fontFamily}`;
    ctx.textAlign =
      options.align === 'start'
        ? 'left'
        : options.align === 'end'
          ? 'right'
          : (options.align as CanvasTextAlign);

    // Measure and draw the text with line breaks
    const lines = text.split('\n');
    const lineHeight = options.fontSize! + (options.lineSpacing || 8);
    let y = options.fontSize!;

    for (const line of lines) {
      const x =
        options.align === 'start'
          ? 0
          : options.align === 'end'
            ? canvas.width
            : canvas.width / 2;

      ctx.fillText(line, x, y);
      y += lineHeight;
    }

    // Trim canvas to actual content height
    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = canvas.width;
    trimmedCanvas.height = y;

    const trimmedCtx = trimmedCanvas.getContext('2d')!;
    trimmedCtx.drawImage(canvas, 0, 0);

    // Apply transformations if needed
    if (options.rotate !== 0 || options.flipH || options.flipV) {
      const transformCanvas = document.createElement('canvas');
      transformCanvas.width = trimmedCanvas.width;
      transformCanvas.height = trimmedCanvas.height;
      const transformCtx = transformCanvas.getContext('2d')!;

      transformCtx.save();
      transformCtx.translate(
        transformCanvas.width / 2,
        transformCanvas.height / 2
      );

      if (options.rotate && options.rotate !== 0) {
        transformCtx.rotate((options.rotate * Math.PI) / 180);
      }

      if (options.flipH) transformCtx.scale(-1, 1);
      if (options.flipV) transformCtx.scale(1, -1);

      transformCtx.drawImage(
        trimmedCanvas,
        -trimmedCanvas.width / 2,
        -trimmedCanvas.height / 2
      );

      transformCtx.restore();
      trimmedCanvas.width = transformCanvas.width;
      trimmedCanvas.height = transformCanvas.height;
      trimmedCtx.drawImage(transformCanvas, 0, 0);
    }

    // Get image data and convert to bitmap
    const imageData = trimmedCtx.getImageData(
      0,
      0,
      trimmedCanvas.width,
      trimmedCanvas.height
    );
    const rgba = new Uint32Array(imageData.data.buffer);
    const bitmap = rgbaToBits(rgba);

    return {
      width: trimmedCanvas.width,
      height: trimmedCanvas.height,
      data: bitmap,
    };
  }

  private async imageToBitmap(
    imageUrl: string,
    options: ImageOptions
  ): Promise<{
    width: number;
    height: number;
    data: Uint8Array;
    dataurl: string;
  }> {
    // Load the image
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const imageLoadPromise = new Promise<HTMLImageElement>(
      (resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () =>
          reject(new Error(`Failed to load image: ${imageUrl}`));
        img.src = imageUrl;
      }
    );

    const loadedImg = await imageLoadPromise;

    // Create canvas and draw image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Force width to printer width and calculate height based on aspect ratio
    const targetWidth = DEF_CANVAS_WIDTH;
    const aspectRatio = loadedImg.width / loadedImg.height;
    const targetHeight = Math.floor(targetWidth / aspectRatio);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw image, scaling to the new dimensions
    ctx.drawImage(loadedImg, 0, 0, targetWidth, targetHeight);

    // Apply transformations if needed
    if (options.rotate !== 0 || options.flipH || options.flipV) {
      // ... (transformation code remains the same)
      const transformCanvas = document.createElement('canvas');
      transformCanvas.width = canvas.width;
      transformCanvas.height = canvas.height;
      const transformCtx = transformCanvas.getContext('2d')!;

      transformCtx.save();
      transformCtx.translate(
        transformCanvas.width / 2,
        transformCanvas.height / 2
      );

      if (options.rotate && options.rotate !== 0) {
        transformCtx.rotate((options.rotate * Math.PI) / 180);
      }

      if (options.flipH) transformCtx.scale(-1, 1);
      if (options.flipV) transformCtx.scale(1, -1);

      transformCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

      transformCtx.restore();
      canvas.width = transformCanvas.width;
      canvas.height = transformCanvas.height;
      ctx.drawImage(transformCanvas, 0, 0);
    }

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let processedImageData = imageData;

    // Apply dithering
    if (options.dither && options.dither !== 'none') {
      if (options.dither === 'threshold') {
        const ditherer = new ThresholdDithering();
        processedImageData = ditherer.dither(imageData, options);
      } else if (options.dither === 'bayer') {
        const ditherer = new BayerDithering();
        processedImageData = ditherer.dither(imageData, options);
      } else if (options.dither === 'floyd-steinberg') {
        const ditherer = new FloydSteinbergDithering();
        processedImageData = ditherer.dither(imageData, options);
      } else if (options.dither === 'random') {
        const ditherer = new RandomDithering();
        processedImageData = ditherer.dither(imageData, options);
      }
      ctx.putImageData(processedImageData, 0, 0); // Put the modified data back to the canvas
    }

    // Get image data again after dithering and convert to bitmap
    const finalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const rgba = new Uint32Array(finalImageData.data.buffer);
    let thresholdValue = 128;
    if (options.dither === 'threshold') {
      thresholdValue =
        options.brightness !== undefined ? options.brightness : 128;
    } else if (options.dither === 'none') {
      thresholdValue =
        options.brightness !== undefined ? options.brightness : 128; // You might want to adjust the default here
    }
    const bitmap = rgbaToBits(rgba, thresholdValue);
    const dataurl = canvas.toDataURL('image/png');

    return {
      width: canvas.width,
      height: canvas.height,
      data: bitmap,
      dataurl: dataurl,
    };
  }

  /**
   * Log debug information to the console if debugging is enabled.
   * @param args Arguments to log.
   */
  private log(...args: any): void {
    if (this.options.debug) {
      console.log('[CatPrinter]', ...args);
    }
  }
}
