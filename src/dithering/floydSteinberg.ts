/**
 * @module Dithering
 */

import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';

/**
 * Implements Floyd-Steinberg dithering.
 */
export class FloydSteinbergDithering implements DitheringAlgorithm {
  /**
   * Applies Floyd-Steinberg dithering to the image data.
   * @param imageData The ImageData object.
   * @param _options Image options (not directly used in this algorithm).
   * @returns The dithered ImageData.
   */
  dither(imageData: ImageData, _options: ImageOptions): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const oldR = data[index];
        const oldG = data[index + 1];
        const oldB = data[index + 2];
        const brightness = (oldR + oldG + oldB) / 3;
        const newBrightness = brightness < 128 ? 0 : 255;
        const newR = newBrightness;
        const newG = newBrightness;
        const newB = newBrightness;

        data[index] = newR;
        data[index + 1] = newG;
        data[index + 2] = newB;

        const errR = oldR - newR;
        const errG = oldG - newG;
        const errB = oldB - newB;

        this.distributeError(
          data,
          width,
          x + 1,
          y,
          (errR * 7) / 16,
          (errG * 7) / 16,
          (errB * 7) / 16
        );
        this.distributeError(
          data,
          width,
          x - 1,
          y + 1,
          (errR * 3) / 16,
          (errG * 3) / 16,
          (errB * 3) / 16
        );
        this.distributeError(
          data,
          width,
          x,
          y + 1,
          (errR * 5) / 16,
          (errG * 5) / 16,
          (errB * 5) / 16
        );
        this.distributeError(
          data,
          width,
          x + 1,
          y + 1,
          (errR * 1) / 16,
          (errG * 1) / 16,
          (errB * 1) / 16
        );
      }
    }
    return imageData;
  }

  private distributeError(
    data: Uint8ClampedArray,
    width: number,
    x: number,
    y: number,
    errR: number,
    errG: number,
    errB: number
  ) {
    if (x >= 0 && x < width && y >= 0 && y < data.length / (width * 4)) {
      const index = (y * width + x) * 4;
      data[index] = Math.max(0, Math.min(255, data[index] + errR));
      data[index + 1] = Math.max(0, Math.min(255, data[index + 1] + errG));
      data[index + 2] = Math.max(0, Math.min(255, data[index + 2] + errB));
    }
  }
}
