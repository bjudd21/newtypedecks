/**
 * Filter Helper Utilities
 */

import type { CardSearchFilters } from '@/lib/types/card';

/**
 * Check if two filter sets have any overlapping values
 */
export function hasOverlap(
  filters1: Partial<CardSearchFilters>,
  filters2: Partial<CardSearchFilters>
): boolean {
  for (const key of Object.keys(filters2)) {
    if (
      filters1[key as keyof CardSearchFilters] ===
      filters2[key as keyof CardSearchFilters]
    ) {
      return true;
    }
  }
  return false;
}
