/**
 * Card Image Processor
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import type { ImageProcessingOptions, ProcessedImage } from '../types';
import { processImageVariant } from '../variants/processor';
import {
  createOutputDirectories,
  determineOptimalFormat,
  calculateTotalSize,
} from '../utils';

/**
 * Process uploaded image and create multiple optimized sizes and formats
 */
export async function processCardImage(
  inputPath: string,
  outputDir: string,
  filename: string,
  options: Partial<ImageProcessingOptions> = {}
): Promise<ProcessedImage> {
  try {
    const {
      enableProgressive = true,
      enableOptimization = true,
      generateWebP = true,
      generateAVIF = false, // AVIF support is newer, disable by default
      preserveOriginal = true,
    } = options;

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Unable to read image dimensions');
    }

    const originalSize = (await fs.stat(inputPath)).size;

    // Create output directories
    await createOutputDirectories(outputDir, generateWebP, generateAVIF);

    // Generate filenames
    const baseName = path.parse(filename).name;

    // Determine optimal output format based on input
    const outputFormat = determineOptimalFormat(metadata.format || 'jpeg');

    const result: ProcessedImage = {
      original: await processImageVariant(
        inputPath,
        outputDir,
        baseName,
        'original',
        {
          preserveOriginal,
          format: outputFormat,
          enableProgressive,
          enableOptimization,
        }
      ),
      thumbnail: await processImageVariant(
        inputPath,
        outputDir,
        baseName,
        'thumbnail',
        {
          width: 300,
          height: 300,
          format: outputFormat,
          enableProgressive,
          enableOptimization,
        }
      ),
      large: await processImageVariant(
        inputPath,
        outputDir,
        baseName,
        'large',
        {
          width: 800,
          height: 800,
          format: outputFormat,
          enableProgressive,
          enableOptimization,
        }
      ),
      metadata: {
        originalWidth: metadata.width,
        originalHeight: metadata.height,
        originalFormat: metadata.format || 'unknown',
        originalSize,
        totalVariants: 3,
        compressionRatio: 0, // Will be calculated later
      },
    };

    // Generate WebP variants if enabled
    if (generateWebP) {
      result.webp = {
        original: await processImageVariant(
          inputPath,
          outputDir,
          baseName,
          'original',
          { preserveOriginal, format: 'webp', enableOptimization }
        ),
        thumbnail: await processImageVariant(
          inputPath,
          outputDir,
          baseName,
          'thumbnail',
          { width: 300, height: 300, format: 'webp', enableOptimization }
        ),
        large: await processImageVariant(
          inputPath,
          outputDir,
          baseName,
          'large',
          { width: 800, height: 800, format: 'webp', enableOptimization }
        ),
      };
      result.metadata.totalVariants += 3;
    }

    // Generate AVIF variants if enabled
    if (generateAVIF) {
      result.avif = {
        original: await processImageVariant(
          inputPath,
          outputDir,
          baseName,
          'original',
          { preserveOriginal, format: 'avif', enableOptimization }
        ),
        thumbnail: await processImageVariant(
          inputPath,
          outputDir,
          baseName,
          'thumbnail',
          { width: 300, height: 300, format: 'avif', enableOptimization }
        ),
        large: await processImageVariant(
          inputPath,
          outputDir,
          baseName,
          'large',
          { width: 800, height: 800, format: 'avif', enableOptimization }
        ),
      };
      result.metadata.totalVariants += 3;
    }

    // Calculate overall compression ratio
    const totalProcessedSize = calculateTotalSize(result);
    result.metadata.compressionRatio =
      (originalSize - totalProcessedSize) / originalSize;

    return result;
  } catch (error) {
    throw new Error(
      `Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
