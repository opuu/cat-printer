/**
 * @module Dithering
 */

import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';

/**
 * Implements Pixel dithering with optional pixel binning.
 */
export class PixelDithering implements DitheringAlgorithm {
  private binSize: number;
  private shadesCount: number;

  /**
   * Creates a new PixelDithering instance.
   * @param binSize The size of pixel bins (default: 3).
   * @param shadesCount Number of brightness levels (default: 20).
   */
  constructor(binSize = 3, shadesCount = 20) {
    this.binSize = Math.max(1, Math.floor(binSize));
    this.shadesCount = Math.max(2, Math.floor(shadesCount));
  }

  dither(imageData: ImageData, _options: ImageOptions): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    for (let y = 0; y < height; y += this.binSize) {
      for (let x = 0; x < width; x += this.binSize) {
        let totalBrightness = 0;
        let pixelCount = 0;

        const maxY = Math.min(y + this.binSize, height);
        const maxX = Math.min(x + this.binSize, width);

        for (let by = y; by < maxY; by++) {
          for (let bx = x; bx < maxX; bx++) {
            const index = (by * width + bx) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            totalBrightness += (r + g + b) / 3;
            pixelCount++;
          }
        }

        const avgBrightness = totalBrightness / pixelCount;

        // Map brightness to appropriate shade level
        const shadeStep = 255 / (this.shadesCount - 1);
        const shadeIndex = Math.min(
          Math.floor(avgBrightness / shadeStep),
          this.shadesCount - 1
        );
        const value = shadeIndex * shadeStep;

        // Apply the shade value to all pixels in the bin
        for (let by = y; by < maxY; by++) {
          for (let bx = x; bx < maxX; bx++) {
            const index = (by * width + bx) * 4;
            data[index] = data[index + 1] = data[index + 2] = value;
          }
        }
      }
    }
    return imageData;
  }
}
