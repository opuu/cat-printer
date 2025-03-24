import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';
/**
 * Implements Pixel dithering with optional pixel binning.
 */
export declare class PixelDithering implements DitheringAlgorithm {
    private binSize;
    private shadesCount;
    /**
     * Creates a new PixelDithering instance.
     * @param binSize The size of pixel bins (default: 3).
     * @param shadesCount Number of brightness levels (default: 20).
     */
    constructor(binSize?: number, shadesCount?: number);
    dither(imageData: ImageData, _options: ImageOptions): ImageData;
}
