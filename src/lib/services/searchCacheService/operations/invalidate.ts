/**
 * Cache invalidation operations
 */

import type { CardSearchFilters } from '@/lib/types/card';
import type { CacheEntry } from '../types';

export interface InvalidationContext {
  cache: Map<string, CacheEntry>;
  stats: {
    totalSize: number;
  };
}

/**
 * Invalidate cache entries matching filters
 */
export async function invalidateByFilters(
  filters: Partial<CardSearchFilters>,
  context: InvalidationContext
): Promise<number> {
  let removedCount = 0;

  for (const [key, entry] of context.cache.entries()) {
    const keyObj = JSON.parse(key);
    const entryFilters = keyObj.f as CardSearchFilters;

    // Check if any filter matches
    let shouldInvalidate = false;
    for (const [filterKey, filterValue] of Object.entries(filters)) {
      if (
        entryFilters[filterKey as keyof CardSearchFilters] === filterValue
      ) {
        shouldInvalidate = true;
        break;
      }
    }

    if (shouldInvalidate) {
      context.cache.delete(key);
      context.stats.totalSize -= entry.size;
      removedCount++;
    }
  }

  return removedCount;
}
