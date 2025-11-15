/**
 * Calculation Utilities
 */

import type { ProcessedImage } from '../types';

/**
 * Calculate total size of all processed variants
 */
export function calculateTotalSize(processed: ProcessedImage): number {
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
