/**
 * Cache retrieval operation
 */

import type {
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '@/lib/types/card';
import type { CacheEntry } from '../types';
import { generateCacheKey } from '../cacheKeyGenerator';
import { isEntryValid } from '../cacheUtils';

export interface CacheGetContext {
  cache: Map<string, CacheEntry>;
  stats: {
    totalHits: number;
    totalMisses: number;
    totalSize: number;
    responseTimes: number[];
  };
}

/**
 * Get cached search result
 */
export async function getCachedResult(
  filters: CardSearchFilters,
  options: CardSearchOptions,
  context: CacheGetContext
): Promise<CardSearchResult | null> {
  const startTime = Date.now();
  const key = generateCacheKey(filters, options);
  const entry = context.cache.get(key);

  if (!entry || !isEntryValid(entry)) {
    context.stats.totalMisses++;
    if (entry) {
      // Remove expired entry
      context.cache.delete(key);
      context.stats.totalSize -= entry.size;
    }
    return null;
  }

  // Update access statistics
  entry.accessCount++;
  entry.lastAccessed = Date.now();
  context.stats.totalHits++;

  const responseTime = Date.now() - startTime;
  context.stats.responseTimes.push(responseTime);

  // Keep response times array at reasonable size
  if (context.stats.responseTimes.length > 1000) {
    context.stats.responseTimes = context.stats.responseTimes.slice(-500);
  }

  return entry.result;
}
