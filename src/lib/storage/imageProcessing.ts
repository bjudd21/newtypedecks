// Image processing utilities for card images
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ProcessedImage {
  original: string;
  thumbnail: string;
  large: string;
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

/**
 * Process uploaded image and create multiple sizes
 */
export async function processCardImage(
  inputPath: string,
  outputDir: string,
  filename: string
): Promise<ProcessedImage> {
  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Unable to read image dimensions');
    }

    // Create output directories if they don't exist
    const originalDir = path.join(outputDir, 'original');
    const thumbnailDir = path.join(outputDir, 'thumbnails');
    const largeDir = path.join(outputDir, 'large');

    await fs.mkdir(originalDir, { recursive: true });
    await fs.mkdir(thumbnailDir, { recursive: true });
    await fs.mkdir(largeDir, { recursive: true });

    // Generate filenames
    const baseName = path.parse(filename).name;
    const ext = path.parse(filename).ext;

    const originalPath = path.join(originalDir, `${baseName}${ext}`);
    const thumbnailPath = path.join(thumbnailDir, `${baseName}-thumb${ext}`);
    const largePath = path.join(largeDir, `${baseName}-large${ext}`);

    // Process original image (copy as-is)
    await sharp(inputPath)
      .toFile(originalPath);

    // Create thumbnail (300x300, maintain aspect ratio)
    await sharp(inputPath)
      .resize(300, 300, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toFile(thumbnailPath);

    // Create large version (800x800, maintain aspect ratio)
    await sharp(inputPath)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 90 })
      .toFile(largePath);

    // Get file sizes
    const originalStats = await fs.stat(originalPath);

    return {
      original: originalPath,
      thumbnail: thumbnailPath,
      large: largePath,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format || 'unknown',
        size: originalStats.size,
      },
    };
  } catch (error) {
    throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

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

/**
 * Get image metadata
 */
export async function getImageMetadata(imagePath: string) {
  try {
    const metadata = await sharp(imagePath).metadata();
    const stats = await fs.stat(imagePath);

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    };
  } catch (error) {
    throw new Error(`Failed to read image metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate image file
 */
export async function validateImageFile(imagePath: string): Promise<boolean> {
  try {
    const metadata = await sharp(imagePath).metadata();
    return !!(metadata.width && metadata.height && metadata.format);
  } catch {
    return false;
  }
}
