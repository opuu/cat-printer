/**
 * @module Dithering
 */

import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';

/**
 * Implements Bayer dithering.
 */
export class BayerDithering implements DitheringAlgorithm {
  private thresholdMap = [
    [0, 2],
    [3, 1],
  ];

  /**
   * Applies Bayer dithering to the image data.
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
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const brightness = (r + g + b) / 3;
        const threshold = (this.thresholdMap[y % 2][x % 2] + 1) * (255 / 5);
        const value = brightness < threshold ? 0 : 255;
        data[index] = data[index + 1] = data[index + 2] = value;
      }
    }
    return imageData;
  }
}
