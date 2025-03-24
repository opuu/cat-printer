import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';
/**
 * Implements Box Dithering, using intersecting lines for structured shading.
 */
export declare class BoxDithering implements DitheringAlgorithm {
    dither(imageData: ImageData, _options: ImageOptions): ImageData;
}
