/**
 * @module CustomDithering
 */

import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';

/**
 * Implements Box Dithering, using intersecting lines for structured shading.
 */
export class BoxDithering implements DitheringAlgorithm {
  dither(imageData: ImageData, _options: ImageOptions): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const brightness =
          (data[index] + data[index + 1] + data[index + 2]) / 3;

        // Box pattern using diagonal grid
        const isHatch = (x % 5 === 0 || y % 5 === 0) && brightness < 128;
        const value = isHatch ? 0 : 255;

        data[index] = data[index + 1] = data[index + 2] = value;
      }
    }
    return imageData;
  }
}
