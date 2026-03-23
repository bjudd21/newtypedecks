/**
 * Card image utilities
 */

import type { CardImageInfo } from '../../../types/card';

/**
 * Create card image info from URLs
 */
export function createImageInfo(
  originalUrl: string,
  smallUrl?: string,
  largeUrl?: string
): CardImageInfo {
  return {
    originalUrl,
    smallUrl,
    largeUrl,
    thumbnailUrl: smallUrl, // Use small as thumbnail
    altText: 'Card Game card image',
    format: originalUrl.split('.').pop()?.toLowerCase() || 'unknown',
  };
}
