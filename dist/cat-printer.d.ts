import { PrinterOptions, TextOptions, ImageOptions, PrinterState } from './types';
/**
 * Cat Printer
 * A library to connect and print with Bluetooth "Cat Printers".
 */
export declare class CatPrinter {
    private device;
    private server;
    private txCharacteristic;
    private rxCharacteristic;
    private printerState;
    private options;
    private modelName;
    /**
     * Creates an instance of the CatPrinter.
     * @param options Optional settings for the SDK.
     */
    constructor(options?: PrinterOptions);
    /**
     * Connect to a Cat Printer device.
     * @returns A Promise that resolves with the initial printer state when connected.
     * @throws Error if Bluetooth is not available or connection fails.
     */
    connect(): Promise<PrinterState>;
    /**
     * Disconnect from the printer.
     * @returns A Promise that resolves when disconnected.
     */
    disconnect(): Promise<void>;
    /**
     * Get the current printer state.
     * @returns The current printer state object.
     */
    getState(): PrinterState;
    /**
     * Check if the printer is currently connected.
     * @returns True if connected, false otherwise.
     */
    isConnected(): boolean;
    /**
     * Print text content.
     * @param text The text to print.
     * @param options Optional text formatting options.
     * @returns A Promise that resolves when printing is complete.
     * @throws Error if the printer is not connected.
     */
    printText(text: string, options?: TextOptions): Promise<void>;
    /**
     * Print an image from a URL.
     * @param imageUrl The URL of the image to print.
     * @param options Optional image formatting options.
     * @returns A Promise that resolves when printing is complete.
     * @throws Error if the printer is not connected or the image fails to load.
     */
    printImage(imageUrl: string, options?: ImageOptions): Promise<void>;
    /**
     * Print multiple items (text or images) in sequence.
     * @param items An array of items to print, each with a type ('text' or 'image'), content, and optional options.
     * @returns A Promise that resolves when all items are printed.
     * @throws Error if the printer is not connected.
     */
    printMultiple(items: Array<{
        type: 'text' | 'image';
        content: string;
        options?: TextOptions | ImageOptions;
    }>): Promise<void>;
    /**
     * Feed paper forward by a specified number of lines.
     * @param lines The number of lines to feed.
     * @returns A Promise that resolves when the feed command is sent.
     */
    feed(lines: number): Promise<void>;
    /**
     * Retract paper (reverse feed) by a specified number of lines.
     * @param lines The number of lines to retract.
     * @returns A Promise that resolves when the retract command is sent.
     */
    retract(lines: number): Promise<void>;
    /**
     * Set the print speed.
     * @param speed The print speed value.
     * @returns A Promise that resolves when the speed command is sent.
     */
    setSpeed(speed: number): Promise<void>;
    /**
     * Set the print energy/density.
     * @param energy The energy value.
     * @returns A Promise that resolves when the energy command is sent.
     */
    setEnergy(energy: number): Promise<void>;
    /**
     * Apply the current energy settings to the printer.
     * @returns A Promise that resolves when the apply energy command is sent.
     */
    applyEnergy(): Promise<void>;
    /**
     * Get the current device state from the printer.
     * @returns A Promise that resolves with the current printer state.
     */
    getDeviceState(): Promise<PrinterState>;
    /**
     * Prepare the printer for printing by setting speed and energy.
     * @param speed The print speed.
     * @param energy The print energy/density.
     * @returns A Promise that resolves when the prepare commands are sent.
     */
    prepare(speed: number, energy: number): Promise<void>;
    /**
     * Finish printing with an optional paper feed.
     * @param feed The number of lines to feed at the end of printing. Default is 0.
     * @returns A Promise that resolves when the finish commands are sent.
     */
    finish(feed?: number): Promise<void>;
    /**
     * Draw a single line of bitmap data to the printer.
     * @param line The bitmap line data as a Uint8Array.
     * @returns A Promise that resolves when the draw command is sent.
     * @throws Error if the printer is not connected.
     */
    draw(line: Uint8Array): Promise<void>;
    /**
     * Print a full bitmap.
     * @param bitmap An object containing the width, height, and bitmap data.
     * @returns A Promise that resolves when the entire bitmap is printed.
     */
    printBitmap(bitmap: {
        width: number;
        height: number;
        data: Uint8Array;
    }): Promise<void>;
    /**
     * Create a command packet to send to the printer.
     * @param command The command to send.
     * @param payload The data payload for the command.
     * @param type The type of command (Transfer or Response). Default is Transfer.
     * @returns The complete command packet as a Uint8Array.
     */
    private makeCommand;
    /**
     * Send data to the printer via the TX characteristic.
     * @param data The data to send as a Uint8Array.
     * @returns A Promise that resolves when the data is written.
     * @throws Error if the printer is not properly connected.
     */
    private write;
    /**
     * Handle incoming notifications from the printer via the RX characteristic.
     * @param event The characteristicvaluechanged event.
     */
    private handleNotification;
    /**
     * Convert text to a bitmap for printing.
     * @param text The text to convert.
     * @param options Text formatting options.
     * @returns A Promise that resolves with the bitmap data.
     */
    private textToBitmap;
    private imageToBitmap;
    /**
     * Log debug information to the console if debugging is enabled.
     * @param args Arguments to log.
     */
    private log;
}
