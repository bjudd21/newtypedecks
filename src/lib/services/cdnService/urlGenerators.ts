/**
 * Provider URL Generators
 * Handles URL generation for different CDN providers
 */

import type { CDNConfig, ImageUrlOptions } from './types';

/**
 * Map fit options to Cloudinary crop modes
 */
export function mapFitToCloudinary(fit?: string): string {
  switch (fit) {
    case 'cover':
      return 'fill';
    case 'contain':
      return 'fit';
    case 'fill':
      return 'scale';
    case 'inside':
      return 'fit';
    case 'outside':
      return 'fill';
    default:
      return 'fill';
  }
}

/**
 * Generate Cloudinary URL
 */
export function generateCloudinaryUrl(
  imagePath: string,
  options: ImageUrlOptions,
  config: CDNConfig
): string {
  const { width, height, quality, format, fit, progressive } = options;

  const transformations: string[] = [];

  if (width || height) {
    const crop = mapFitToCloudinary(fit);
    transformations.push(`c_${crop}`);
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
  }

  if (quality) {
    const qualityValue =
      typeof quality === 'string' && quality === 'auto'
        ? 'auto:good'
        : quality;
    transformations.push(`q_${qualityValue}`);
  }

  if (format && format !== 'auto') {
    transformations.push(`f_${format}`);
  } else {
    transformations.push('f_auto');
  }

  if (progressive) {
    transformations.push('fl_progressive');
  }

  const transformationString =
    transformations.length > 0 ? `/${transformations.join(',')}` : '';

  return `${config.baseUrl}/image/upload${transformationString}/${imagePath}`;
}

/**
 * Generate ImageKit URL
 */
export function generateImageKitUrl(
  imagePath: string,
  options: ImageUrlOptions,
  config: CDNConfig
): string {
  const { width, height, quality, format } = options;

  const params = new URLSearchParams();

  if (width) params.set('tr', `w-${width}`);
  if (height) params.set('tr', `${params.get('tr') || ''},h-${height}`);
  if (quality) params.set('tr', `${params.get('tr') || ''},q-${quality}`);
  if (format && format !== 'auto')
    params.set('tr', `${params.get('tr') || ''},f-${format}`);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return `${config.baseUrl}/${imagePath}${queryString}`;
}

/**
 * Generate Cloudflare Images URL
 */
export function generateCloudflareUrl(
  imagePath: string,
  options: ImageUrlOptions,
  config: CDNConfig
): string {
  const { width, height, quality, format, fit } = options;

  const params = new URLSearchParams();

  if (width) params.set('width', width.toString());
  if (height) params.set('height', height.toString());
  if (quality) params.set('quality', quality.toString());
  if (format && format !== 'auto') params.set('format', format);
  if (fit) params.set('fit', fit);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return `${config.baseUrl}/${imagePath}${queryString}`;
}

/**
 * Generate Vercel Image Optimization URL
 */
export function generateVercelUrl(
  imagePath: string,
  options: ImageUrlOptions,
  config: CDNConfig
): string {
  const { width, quality } = options;

  const params = new URLSearchParams();
  params.set('url', imagePath);

  if (width) params.set('w', width.toString());
  if (quality) params.set('q', quality.toString());

  return `${config.baseUrl}/_next/image?${params.toString()}`;
}

/**
 * Generate local URL (for development)
 */
export function generateLocalUrl(imagePath: string, config: CDNConfig): string {
  return `${config.baseUrl}/${imagePath}`;
}
