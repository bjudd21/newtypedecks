/**
 * Image Processing Types
 */

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
