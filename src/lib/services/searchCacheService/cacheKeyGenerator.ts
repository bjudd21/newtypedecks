/**
 * Cache Key Generator
 * Handles cache key generation and normalization
 */

import type { CardSearchFilters, CardSearchOptions } from '@/lib/types/card';

/**
 * Generate cache key from filters and options
 */
export function generateCacheKey(
  filters: CardSearchFilters,
  options: CardSearchOptions
): string {
  // Create a normalized key that ignores order and undefined values
  const normalizedFilters = normalizeFilters(filters);
  const normalizedOptions = normalizeOptions(options);

  return JSON.stringify({
    f: normalizedFilters,
    o: normalizedOptions,
  });
}

/**
 * Normalize filters for consistent cache keys
 */
export function normalizeFilters(
  filters: CardSearchFilters
): Partial<CardSearchFilters> {
  const normalized: Partial<CardSearchFilters> = {};

  // Only include defined values and sort arrays
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        (normalized as Record<string, unknown>)[key] = [...value].sort();
      } else if (!Array.isArray(value)) {
        (normalized as Record<string, unknown>)[key] = value;
      }
    }
  });

  return normalized;
}

/**
 * Normalize options for consistent cache keys
 */
export function normalizeOptions(
  options: CardSearchOptions
): Partial<CardSearchOptions> {
  return {
    page: options.page || 1,
    limit: options.limit || 20,
    sortBy: options.sortBy || 'name',
    sortOrder: options.sortOrder || 'asc',
    includeRelations: options.includeRelations ?? true,
  };
}
