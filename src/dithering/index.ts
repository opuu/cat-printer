/**
 * @module Dithering
 */

import { ImageOptions } from '../types';

/**
 * Interface for dithering algorithms.
 */
export interface DitheringAlgorithm {
  /**
   * Applies the dithering algorithm to the image data.
   * @param imageData The ImageData object to dither.
   * @param options Image options that might affect the dithering process.
   * @returns The dithered ImageData object.
   */
  dither(imageData: ImageData, options: ImageOptions): ImageData;
}

export * from './threshold';
export * from './bayer';
export * from './floydSteinberg';
export * from './dot';
