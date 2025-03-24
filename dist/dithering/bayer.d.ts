import { DitheringAlgorithm } from './index';
import { ImageOptions } from '../types';
/**
 * Implements Bayer dithering.
 */
export declare class BayerDithering implements DitheringAlgorithm {
    private thresholdMap;
    /**
     * Applies Bayer dithering to the image data.
     * @param imageData The ImageData object.
     * @param _options Image options (not directly used in this algorithm).
     * @returns The dithered ImageData.
     */
    dither(imageData: ImageData, _options: ImageOptions): ImageData;
}
