/**
 * @module Utils
 */
/**
 * Calculates the CRC8 checksum of a byte array.
 * @param data The byte array to calculate the CRC8 for.
 * @returns The CRC8 checksum value.
 */
export declare function crc8(data: Uint8Array): number;
/**
 * Converts RGBA pixel data to a bit array (1 for black, 0 for white).
 * @param rgba The Uint32Array containing RGBA pixel data.
 * @param threshold The brightness threshold (0-255) to consider a pixel black. Default is 128.
 * @returns A Uint8Array representing the bitmap data.
 */
export declare function rgbaToBits(rgba: Uint32Array, threshold?: number): Uint8Array;
