/**
 * Search Metadata Functions
 *
 * Utilities for building search metadata and response enrichment
 */

import type { CardSearchFilters, CardSearchOptions } from '@/lib/types/card';

/**
 * Builds metadata object for search results
 * Includes information about applied filters, options, and timestamp
 */
export function buildSearchMetadata(
  filters: CardSearchFilters,
  options: CardSearchOptions
) {
  return {
    hasFilters: Object.values(filters).some(
      (value) =>
        value !== undefined &&
        value !== null &&
        (Array.isArray(value) ? value.length > 0 : true)
    ),
    appliedFilters: Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    searchOptions: options,
    timestamp: new Date().toISOString(),
  };
}
