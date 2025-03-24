/**
 * @module CustomDithering
 */

import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';

/**
 * Implements Dot Dithering, using a grid of round dots where darker areas have larger dots.
 */
export class DotDithering implements DitheringAlgorithm {
  dither(imageData: ImageData, _options: ImageOptions): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const gridSize = 4;
    const output = new Uint8ClampedArray(data.length);

    // Copy alpha channel
    for (let i = 3; i < data.length; i += 4) {
      output[i] = data[i];
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const brightness =
          (data[index] + data[index + 1] + data[index + 2]) / 3;
        const dotSize = Math.floor((255 - brightness) / 50); // Darker = larger dots

        // Calculate grid position
        const gridX = Math.floor(x / gridSize) * gridSize;
        const gridY = Math.floor(y / gridSize) * gridSize;

        // Apply dot pattern relative to grid
        const relX = x - gridX;
        const relY = y - gridY;
        const distance = Math.sqrt(
          (relX - gridSize / 2) ** 2 + (relY - gridSize / 2) ** 2
        );

        const pixelValue = distance < dotSize ? 0 : 255;
        output[index] = output[index + 1] = output[index + 2] = pixelValue;
      }
    }

    return new ImageData(output, width, height);
  }
}
