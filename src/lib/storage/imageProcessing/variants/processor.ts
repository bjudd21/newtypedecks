/**
 * Image Variant Processor
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import type { ImageProcessingOptions, ProcessedImageVariant } from '../types';
import { getOptimalQuality } from '../utils';

/**
 * Process a single image variant with specified options
 */
export async function processImageVariant(
  inputPath: string,
  outputDir: string,
  baseName: string,
  variant: 'original' | 'thumbnail' | 'large',
  options: Partial<ImageProcessingOptions> & { format?: string }
): Promise<ProcessedImageVariant> {
  const {
    width,
    height,
    format = 'jpeg',
    quality,
    enableProgressive = true,
    enableOptimization = true,
    preserveOriginal: _preserveOriginal = false,
  } = options;

  // Determine output path
  const formatDir = format === 'jpeg' || format === 'png' ? '' : format;
  const variantDir =
    variant === 'original'
      ? 'original'
      : variant === 'thumbnail'
        ? 'thumbnails'
        : 'large';

  const outputPath = formatDir
    ? path.join(
        outputDir,
        formatDir,
        variantDir,
        `${baseName}-${variant}.${format}`
      )
    : path.join(outputDir, variantDir, `${baseName}-${variant}.${format}`);

  let sharpInstance = sharp(inputPath);

  // Apply resizing for non-original variants
  if (variant !== 'original' && (width || height)) {
    sharpInstance = sharpInstance.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Apply format-specific optimizations
  const validFormats = ['jpeg', 'png', 'webp', 'avif'] as const;
  const outputQuality = getOptimalQuality(
    validFormats.includes(format as (typeof validFormats)[number])
      ? (format as (typeof validFormats)[number])
      : 'jpeg',
    variant
  );

  switch (format) {
    case 'jpeg':
      await sharpInstance
        .jpeg({
          quality: quality || outputQuality,
          progressive: enableProgressive,
          mozjpeg: enableOptimization,
        })
        .toFile(outputPath);
      break;

    case 'png':
      await sharpInstance
        .png({
          quality: quality || outputQuality,
          compressionLevel: enableOptimization ? 9 : 6,
          palette: enableOptimization,
        })
        .toFile(outputPath);
      break;

    case 'webp':
      await sharpInstance
        .webp({
          quality: quality || outputQuality,
          effort: enableOptimization ? 6 : 4,
          lossless: false,
        })
        .toFile(outputPath);
      break;

    case 'avif':
      await sharpInstance
        .avif({
          quality: quality || outputQuality,
          effort: enableOptimization ? 9 : 4,
        })
        .toFile(outputPath);
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  // Get output file info
  const stats = await fs.stat(outputPath);
  const metadata = await sharp(outputPath).metadata();

  return {
    path: outputPath,
    format,
    size: stats.size,
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}
