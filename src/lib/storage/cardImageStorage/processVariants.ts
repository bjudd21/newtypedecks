/**
 * In-memory variant processing for card image uploads.
 *
 * Unlike the legacy disk pipeline (imageProcessing/), this produces buffers so
 * drivers can persist them anywhere (local disk, Vercel Blob, etc.).
 */

import sharp from 'sharp';
import type { ProcessedVariantBuffer } from './types';

const VARIANT_SIZES = {
  original: 2048,
  large: 800,
  thumbnail: 300,
} as const;

const QUALITY = {
  original: 90,
  large: 85,
  thumbnail: 80,
} as const;

export interface ProcessedVariants {
  variants: ProcessedVariantBuffer[];
  metadata: {
    originalWidth: number;
    originalHeight: number;
    originalFormat: string;
    originalSize: number;
  };
}

/** PNG stays PNG (card scans with transparency); everything else → JPEG. */
function outputFormat(inputFormat: string): 'jpeg' | 'png' {
  return inputFormat === 'png' ? 'png' : 'jpeg';
}

async function processVariant(
  input: Buffer,
  variant: keyof typeof VARIANT_SIZES,
  format: 'jpeg' | 'png'
): Promise<ProcessedVariantBuffer> {
  const size = VARIANT_SIZES[variant];
  let pipeline = sharp(input).resize(size, size, {
    fit: 'inside',
    withoutEnlargement: true,
  });

  pipeline =
    format === 'png'
      ? pipeline.png({ compressionLevel: 9, palette: variant !== 'original' })
      : pipeline.jpeg({
          quality: QUALITY[variant],
          progressive: true,
          mozjpeg: true,
        });

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

  return {
    variant,
    buffer: data,
    format,
    contentType: format === 'png' ? 'image/png' : 'image/jpeg',
    width: info.width,
    height: info.height,
  };
}

/**
 * Produce the three stored variants (original/large/thumbnail) from an upload.
 */
export async function processCardImageVariants(
  file: File
): Promise<ProcessedVariants> {
  const input = Buffer.from(await file.arrayBuffer());
  const meta = await sharp(input).metadata();

  if (!meta.width || !meta.height) {
    throw new Error('Unable to read image dimensions');
  }

  const format = outputFormat(meta.format ?? 'jpeg');

  const variants = await Promise.all([
    processVariant(input, 'original', format),
    processVariant(input, 'large', format),
    processVariant(input, 'thumbnail', format),
  ]);

  return {
    variants,
    metadata: {
      originalWidth: meta.width,
      originalHeight: meta.height,
      originalFormat: meta.format ?? 'unknown',
      originalSize: input.byteLength,
    },
  };
}
