/**
 * @module Types
 */

/**
 * Options for initializing the printer SDK.
 */
export interface PrinterOptions {
  /**
   * Enable debug logging.
   */
  debug?: boolean;
  /**
   * Default print speed.
   */
  speed?: number;
  /**
   * Default print energy.
   */
  energy?: number;
  /**
   * Default number of lines to feed after printing.
   */
  finishFeed?: number;
}

/**
 * Options for printing text.
 */
export interface TextOptions {
  /**
   * Font family for the text.
   */
  fontFamily?: string;
  /**
   * Font size for the text (in pixels).
   */
  fontSize?: number;
  /**
   * Font weight for the text (e.g., 'normal', 'bold').
   */
  fontWeight?: string;
  /**
   * Alignment of the text.
   */
  align?: 'start' | 'center' | 'end' | 'justified';
  /**
   * Line spacing between lines of text (in pixels).
   */
  lineSpacing?: number;
  /**
   * Rotation angle of the text (in degrees).
   */
  rotate?: number;
  /**
   * Flip the text horizontally.
   */
  flipH?: boolean;
  /**
   * Flip the text vertically.
   */
  flipV?: boolean;
  /**
   * Brightness level (not directly used in textToBitmap currently).
   */
  brightness?: number;
  /**
   * Offset to feed or retract paper before printing (in lines).
   */
  offset?: number;
}

/**
 * Options for printing images.
 */
export interface ImageOptions {
  /**
   * Dithering algorithm to use for the image.
   * Options: 'none', 'threshold', 'bayer', 'floyd-steinberg', 'random'.
   */
  dither?: 'none' | 'threshold' | 'bayer' | 'floyd-steinberg' | 'random';
  /**
   * Rotation angle of the image (in degrees).
   */
  rotate?: number;
  /**
   * Flip the image horizontally.
   */
  flipH?: boolean;
  /**
   * Flip the image vertically.
   */
  flipV?: boolean;
  /**
   * Brightness level for threshold dithering (0-255).
   */
  brightness?: number;
  /**
   * Offset to feed or retract paper before printing (in lines).
   */
  offset?: number;
}

/**
 * Represents the state of the printer.
 */
export interface PrinterState {
  /**
   * Indicates if the printer is out of paper.
   */
  outOfPaper: boolean;
  /**
   * Indicates if the printer cover is open.
   */
  coverOpen: boolean;
  /**
   * Indicates if the printer is overheated.
   */
  overheat: boolean;
  /**
   * Indicates if the printer has low power.
   */
  lowPower: boolean;
  /**
   * Indicates if the printer is paused.
   */
  paused: boolean;
  /**
   * Indicates if the printer is busy.
   */
  busy: boolean;
}
