/**
 * CardImage utilities
 */

import type { ImageSize } from './types';

/**
 * Select the best image URL based on size
 */
export function getImageUrl(
  size: ImageSize,
  imageUrl?: string,
  imageUrlSmall?: string,
  imageUrlLarge?: string
): string | undefined {
  switch (size) {
    case 'thumbnail':
    case 'small':
      return imageUrlSmall || imageUrl;
    case 'large':
    case 'fullsize':
      return imageUrlLarge || imageUrl;
    default:
      return imageUrl || imageUrlSmall;
  }
}

/**
 * Get zoom image URL (always use the highest resolution available)
 */
export function getZoomImageUrl(
  imageUrl?: string,
  imageUrlSmall?: string,
  imageUrlLarge?: string
): string | undefined {
  return imageUrlLarge || imageUrl || imageUrlSmall;
}
