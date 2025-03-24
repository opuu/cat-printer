/**
 * @module Dithering
 */

import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';

/**
 * Implements threshold dithering.
 */
export class ThresholdDithering implements DitheringAlgorithm {
  /**
   * Applies threshold dithering to the image data.
   * @param imageData The ImageData object.
   * @param options Image options, specifically the brightness threshold.
   * @returns The dithered ImageData.
   */
  dither(imageData: ImageData, options: ImageOptions): ImageData {
    const data = imageData.data;
    const threshold =
      options.brightness !== undefined ? options.brightness : 128;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const value = brightness < threshold ? 0 : 255;
      data[i] = data[i + 1] = data[i + 2] = value;
    }
    return imageData;
  }
}
