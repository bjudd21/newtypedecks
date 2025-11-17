/**
 * Cache storage operation
 */

import type {
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '@/lib/types/card';
import type { CacheEntry, CacheConfig } from '../types';
import { generateCacheKey } from '../cacheKeyGenerator';
import { estimateSize } from '../cacheUtils';
import { ensureCapacity } from './eviction';

export interface CacheSetContext {
  cache: Map<string, CacheEntry>;
  stats: {
    totalSize: number;
  };
  config: CacheConfig;
}

/**
 * Cache search result
 */
export async function setCachedResult(
  filters: CardSearchFilters,
  options: CardSearchOptions,
  result: CardSearchResult,
  customTTL: number | undefined,
  context: CacheSetContext
): Promise<void> {
  const key = generateCacheKey(filters, options);
  const size = estimateSize(result);
  const ttl = customTTL || context.config.defaultTTL;

  // Check if we need to evict entries
  await ensureCapacity(size, context);

  const entry: CacheEntry = {
    result: { ...result }, // Clone to prevent mutations
    timestamp: Date.now(),
    accessCount: 1,
    lastAccessed: Date.now(),
    ttl,
    size,
  };

  // Remove existing entry if it exists
  const existingEntry = context.cache.get(key);
  if (existingEntry) {
    context.stats.totalSize -= existingEntry.size;
  }

  context.cache.set(key, entry);
  context.stats.totalSize += size;
}
