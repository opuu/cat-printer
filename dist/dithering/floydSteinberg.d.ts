import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';
/**
 * Implements Floyd-Steinberg dithering.
 */
export declare class FloydSteinbergDithering implements DitheringAlgorithm {
    /**
     * Applies Floyd-Steinberg dithering to the image data.
     * @param imageData The ImageData object.
     * @param _options Image options (not directly used in this algorithm).
     * @returns The dithered ImageData.
     */
    dither(imageData: ImageData, _options: ImageOptions): ImageData;
    private distributeError;
}
