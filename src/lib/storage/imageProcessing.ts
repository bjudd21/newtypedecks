// Image processing utilities for card images
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  enableProgressive?: boolean;
  enableOptimization?: boolean;
  generateWebP?: boolean;
  generateAVIF?: boolean;
  preserveOriginal?: boolean;
}

export interface ProcessedImageVariant {
  path: string;
  format: string;
  size: number;
  width: number;
  height: number;
}

export interface ProcessedImage {
  original: ProcessedImageVariant;
  thumbnail: ProcessedImageVariant;
  large: ProcessedImageVariant;
  webp?: {
    original?: ProcessedImageVariant;
    thumbnail?: ProcessedImageVariant;
    large?: ProcessedImageVariant;
  };
  avif?: {
    original?: ProcessedImageVariant;
    thumbnail?: ProcessedImageVariant;
    large?: ProcessedImageVariant;
  };
  metadata: {
    originalWidth: number;
    originalHeight: number;
    originalFormat: string;
    originalSize: number;
    totalVariants: number;
    compressionRatio: number;
  };
}

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
    const _originalExt = path.parse(filename).ext;

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
    throw new Error(
      `Failed to read image metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
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

/**
 * Create output directories for different formats
 */
async function createOutputDirectories(
  outputDir: string,
  generateWebP: boolean,
  generateAVIF: boolean
): Promise<void> {
  const directories = [
    path.join(outputDir, 'original'),
    path.join(outputDir, 'thumbnails'),
    path.join(outputDir, 'large'),
  ];

  if (generateWebP) {
    directories.push(
      path.join(outputDir, 'webp', 'original'),
      path.join(outputDir, 'webp', 'thumbnails'),
      path.join(outputDir, 'webp', 'large')
    );
  }

  if (generateAVIF) {
    directories.push(
      path.join(outputDir, 'avif', 'original'),
      path.join(outputDir, 'avif', 'thumbnails'),
      path.join(outputDir, 'avif', 'large')
    );
  }

  for (const dir of directories) {
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Determine optimal output format based on input format
 */
function determineOptimalFormat(inputFormat: string): 'jpeg' | 'png' | 'webp' {
  switch (inputFormat.toLowerCase()) {
    case 'png':
      return 'png'; // Preserve PNG for images with transparency
    case 'gif':
      return 'png'; // Convert GIF to PNG to preserve transparency
    case 'webp':
      return 'webp'; // Keep WebP if already in WebP
    default:
      return 'jpeg'; // Default to JPEG for photos
  }
}

/**
 * Process a single image variant with specified options
 */
async function processImageVariant(
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

/**
 * Get optimal quality setting based on format and variant
 */
function getOptimalQuality(
  format: 'jpeg' | 'png' | 'webp' | 'avif',
  variant: string
): number {
  const qualityMap = {
    jpeg: {
      original: 92,
      large: 88,
      thumbnail: 82,
    },
    png: {
      original: 95,
      large: 90,
      thumbnail: 85,
    },
    webp: {
      original: 85,
      large: 80,
      thumbnail: 75,
    },
    avif: {
      original: 80,
      large: 75,
      thumbnail: 70,
    },
  };

  return (
    qualityMap[format]?.[variant as keyof (typeof qualityMap)[typeof format]] ||
    85
  );
}

/**
 * Calculate total size of all processed variants
 */
function calculateTotalSize(processed: ProcessedImage): number {
  let total =
    processed.original.size + processed.thumbnail.size + processed.large.size;

  if (processed.webp) {
    total +=
      (processed.webp.original?.size || 0) +
      (processed.webp.thumbnail?.size || 0) +
      (processed.webp.large?.size || 0);
  }

  if (processed.avif) {
    total +=
      (processed.avif.original?.size || 0) +
      (processed.avif.thumbnail?.size || 0) +
      (processed.avif.large?.size || 0);
  }

  return total;
}

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
