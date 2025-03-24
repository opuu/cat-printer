import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';
/**
 * Implements threshold dithering.
 */
export declare class ThresholdDithering implements DitheringAlgorithm {
    /**
     * Applies threshold dithering to the image data.
     * @param imageData The ImageData object.
     * @param options Image options, specifically the brightness threshold.
     * @returns The dithered ImageData.
     */
    dither(imageData: ImageData, options: ImageOptions): ImageData;
}
