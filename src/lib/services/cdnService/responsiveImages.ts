/**
 * Responsive Images Module
 * Handles generation of responsive image sets
 */

import type { ProcessedImage } from '@/lib/storage/imageProcessing';
import type { ResponsiveImageSet } from './types';
import { relativizePath } from './utils';

/**
 * Generate responsive image set with multiple formats and sizes
 */
export function generateResponsiveImageSet(
  imagePath: string,
  sizes: { width: number; suffix?: string }[] = [
    { width: 320, suffix: 'sm' },
    { width: 640, suffix: 'md' },
    { width: 1024, suffix: 'lg' },
    { width: 1920, suffix: 'xl' },
  ],
  generateImageUrl: (
    path: string,
    options: {
      width?: number;
      format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
    }
  ) => string
): ResponsiveImageSet {
  // Generate srcSet for different sizes
  const srcSet = sizes
    .map((size) => {
      const url = generateImageUrl(imagePath, { width: size.width });
      return `${url} ${size.width}w`;
    })
    .join(', ');

  // Generate different format URLs
  const formats = {
    webp: generateImageUrl(imagePath, { format: 'webp' }),
    avif: generateImageUrl(imagePath, { format: 'avif' }),
    jpeg: generateImageUrl(imagePath, { format: 'jpeg' }),
  };

  // Default sizes attribute (can be customized)
  const sizesAttr = `
    (max-width: 320px) 320px,
    (max-width: 640px) 640px,
    (max-width: 1024px) 1024px,
    1920px
  `
    .trim()
    .replace(/\s+/g, ' ');

  return {
    src: generateImageUrl(imagePath, {}),
    srcSet,
    sizes: sizesAttr,
    formats,
  };
}

/**
 * Generate URLs for processed image variants
 */
export function generateProcessedImageUrls(
  processedImage: ProcessedImage,
  generateResponsiveSet: (path: string) => ResponsiveImageSet
): {
  original: ResponsiveImageSet;
  thumbnail: ResponsiveImageSet;
  large: ResponsiveImageSet;
} {
  return {
    original: generateResponsiveSet(
      relativizePath(processedImage.original.path)
    ),
    thumbnail: generateResponsiveSet(
      relativizePath(processedImage.thumbnail.path)
    ),
    large: generateResponsiveSet(relativizePath(processedImage.large.path)),
  };
}

/**
 * Generate optimized image for different device types
 */
export function generateDeviceOptimizedUrls(
  imagePath: string,
  generateResponsiveSet: (
    path: string,
    sizes: { width: number; suffix?: string }[]
  ) => ResponsiveImageSet
): {
  desktop: ResponsiveImageSet;
  tablet: ResponsiveImageSet;
  mobile: ResponsiveImageSet;
} {
  return {
    desktop: generateResponsiveSet(imagePath, [
      { width: 1920, suffix: 'xl' },
      { width: 1440, suffix: 'lg' },
      { width: 1024, suffix: 'md' },
    ]),
    tablet: generateResponsiveSet(imagePath, [
      { width: 1024, suffix: 'lg' },
      { width: 768, suffix: 'md' },
      { width: 640, suffix: 'sm' },
    ]),
    mobile: generateResponsiveSet(imagePath, [
      { width: 640, suffix: 'md' },
      { width: 480, suffix: 'sm' },
      { width: 320, suffix: 'xs' },
    ]),
  };
}

/**
 * Preload critical images
 */
export function generatePreloadLinks(
  imagePaths: string[],
  generateImageUrl: (path: string, options: object) => string,
  options: object = {}
): string[] {
  return imagePaths.map((imagePath) => {
    const url = generateImageUrl(imagePath, options);
    return `<link rel="preload" as="image" href="${url}">`;
  });
}
