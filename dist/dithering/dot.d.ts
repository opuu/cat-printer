import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';
/**
 * Implements Dot Dithering, using a grid of round dots where darker areas have larger dots.
 */
export declare class DotDithering implements DitheringAlgorithm {
    dither(imageData: ImageData, _options: ImageOptions): ImageData;
}
