/**
 * Responsive Image Generator
 */

import path from 'path';
import type { ProcessedImageVariant } from '../types';
import { processImageVariant } from '../variants/processor';

/**
 * Generate optimized responsive images with multiple formats
 */
export async function generateResponsiveImages(
  inputPath: string,
  outputDir: string,
  filename: string,
  sizes: { width: number; height?: number; suffix: string }[] = [
    { width: 320, suffix: 'small' },
    { width: 640, suffix: 'medium' },
    { width: 1024, suffix: 'large' },
    { width: 1920, suffix: 'xl' },
  ]
): Promise<{ [key: string]: ProcessedImageVariant[] }> {
  const baseName = path.parse(filename).name;
  const results: { [key: string]: ProcessedImageVariant[] } = {};

  for (const size of sizes) {
    const variants: ProcessedImageVariant[] = [];

    // Generate JPEG variant
    const jpegVariant = await processImageVariant(
      inputPath,
      outputDir,
      baseName,
      'large',
      {
        width: size.width,
        height: size.height,
        format: 'jpeg',
        enableProgressive: true,
        enableOptimization: true,
      }
    );
    variants.push(jpegVariant);

    // Generate WebP variant
    const webpVariant = await processImageVariant(
      inputPath,
      outputDir,
      baseName,
      'large',
      {
        width: size.width,
        height: size.height,
        format: 'webp',
        enableOptimization: true,
      }
    );
    variants.push(webpVariant);

    results[size.suffix] = variants;
  }

  return results;
}
