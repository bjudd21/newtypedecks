/**
 * Image Resize Operations
 */

import sharp from 'sharp';
import type { ImageProcessingOptions } from '../types';

/**
 * Resize image to specific dimensions
 */
export async function resizeImage(
  inputPath: string,
  outputPath: string,
  options: ImageProcessingOptions
): Promise<void> {
  const { width, height, quality = 85, format = 'jpeg' } = options;

  let sharpInstance = sharp(inputPath);

  if (width || height) {
    sharpInstance = sharpInstance.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  switch (format) {
    case 'jpeg':
      await sharpInstance.jpeg({ quality }).toFile(outputPath);
      break;
    case 'png':
      await sharpInstance.png({ quality }).toFile(outputPath);
      break;
    case 'webp':
      await sharpInstance.webp({ quality }).toFile(outputPath);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
