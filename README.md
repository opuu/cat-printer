# Cat Printer SDK

The Cat Printer SDK is a JavaScript/TypeScript library for communicating with thermal receipt printers that use Bluetooth LE connectivity, commonly known as "Cat Printers".

## Features

- Connect to Bluetooth Cat Printers
- Print text with customizable formatting
- Print images with various dithering methods
- Control printer settings like speed and energy
- Feed and retract paper
- Monitor printer state (paper level, errors, etc.)

## Installation

```bash
npm install cat-printer
# or
yarn add cat-printer
# or
pnpm add cat-printer
```

## Basic Usage

```typescript
import { CatPrinter } from 'cat-printer';

// Create a new instance
const printer = new CatPrinter({ debug: true });

// Connect to the printer
async function connect() {
    try {
        await printer.connect();
        console.log('Connected to printer!');
        
        // Print text
        await printer.printText('Hello World!', { 
            fontSize: 24, 
            fontWeight: 'bold',
            align: 'center' 
        });
        
        // Print an image 
        await printer.printImage('https://example.com/image.jpg', {
            dither: 'floyd-steinberg'
        });
        
        // Feed some paper and disconnect
        await printer.feed(100);
        await printer.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call connect when user clicks a button
document.getElementById('connectButton').addEventListener('click', connect);
```

## API Reference

### `CatPrinter`

The main class for interacting with Cat Printers.

#### Constructor

```typescript
new CatPrinter(options?: PrinterOptions)
```

##### PrinterOptions

| Option     | Type    | Default | Description                             |
|------------|---------|--------|-----------------------------------------|
| debug      | boolean | false   | Enable debug logging                    |
| speed      | number  | 32      | Default print speed                     |
| energy     | number  | 24000   | Default print energy/density            |
| finishFeed | number  | 100     | Default lines to feed after printing    |

#### Methods

##### Connection Management

- **`connect(): Promise<PrinterState>`** - Connect to the printer via Bluetooth
- **`disconnect(): Promise<void>`** - Disconnect from the printer
- **`isConnected(): boolean`** - Check if printer is connected
- **`getState(): PrinterState`** - Get the current printer state

##### Printing

- **`printText(text: string, options?: TextOptions): Promise<void>`** - Print text
- **`printImage(imageUrl: string, options?: ImageOptions): Promise<void>`** - Print an image from URL
- **`printMultiple(items: Array<{type: 'text'|'image', content: string, options?: TextOptions|ImageOptions}>): Promise<void>`** - Print multiple items in sequence

##### Paper Control

- **`feed(lines: number): Promise<void>`** - Feed paper forward
- **`retract(lines: number): Promise<void>`** - Retract paper backward

##### Printer Settings

- **`setSpeed(speed: number): Promise<void>`** - Set print speed
- **`setEnergy(energy: number): Promise<void>`** - Set print energy/density
- **`prepare(speed: number, energy: number): Promise<void>`** - Set speed and energy
- **`finish(feed: number): Promise<void>`** - Complete printing with final feed

### Options Types

#### TextOptions

| Option      | Type                                  | Description                             |
|-------------|---------------------------------------|-----------------------------------------|
| fontFamily  | string                                | Font family for the text                |
| fontSize    | number                                | Font size in pixels                     |
| fontWeight  | string                                | Font weight (e.g., 'normal', 'bold')    |
| align       | 'start' \| 'center' \| 'end' \| 'justified' | Text alignment                    |
| lineSpacing | number                                | Space between lines in pixels           |
| rotate      | number                                | Rotation angle in degrees               |
| flipH       | boolean                               | Flip horizontally                       |
| flipV       | boolean                               | Flip vertically                         |
| brightness  | number                                | Brightness threshold (0-255)            |
| offset      | number                                | Paper feed/retract before printing      |

#### ImageOptions

| Option     | Type                                               | Description                             |
|------------|----------------------------------------------------|-----------------------------------------|
| dither     | 'none' \| 'threshold' \| 'bayer' \| 'floyd-steinberg' \| 'random' | Dithering algorithm     |
| rotate     | number                                             | Rotation angle in degrees               |
| flipH      | boolean                                            | Flip horizontally                       |
| flipV      | boolean                                            | Flip vertically                         |
| brightness | number                                             | Brightness threshold (0-255)            |
| offset     | number                                             | Paper feed/retract before printing      |

#### PrinterState

| Property    | Type    | Description                          |
|-------------|---------|--------------------------------------|
| outOfPaper  | boolean | True when printer is out of paper    |
| coverOpen   | boolean | True when printer cover is open      |
| overheat    | boolean | True when printer is overheated      |
| lowPower    | boolean | True when battery is low             |
| paused      | boolean | True when printer is paused          |
| busy        | boolean | True when printer is busy            |

## Dithering Options

The SDK provides several dithering methods for converting images to black and white:

- **threshold**: Simple brightness threshold
- **bayer**: Ordered dithering using Bayer matrix
- **floyd-steinberg**: Error diffusion dithering
- **random**: Random dithering
- **none**: No dithering (uses brightness threshold)

## Browser Compatibility

This library uses the Web Bluetooth API, which is supported in:

- Chrome (Desktop & Android)
- Edge (Desktop)
- Opera (Desktop & Android)

Safari and Firefox do not support Web Bluetooth natively.

## License

AGPL-3.0