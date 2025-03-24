/**
 * @module Dithering
 */

import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';

/**
 * Implements random dithering.
 */
export class RandomDithering implements DitheringAlgorithm {
  /**
   * Applies random dithering to the image data.
   * @param imageData The ImageData object.
   * @param _options Image options (not directly used in this algorithm).
   * @returns The dithered ImageData.
   */
  dither(imageData: ImageData, _options: ImageOptions): ImageData {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const randomThreshold = Math.random() * 255;
      const value = brightness < randomThreshold ? 0 : 255;
      data[i] = data[i + 1] = data[i + 2] = value;
    }
    return imageData;
  }
}
