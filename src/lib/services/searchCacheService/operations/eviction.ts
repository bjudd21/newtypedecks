/**
 * Cache eviction operations
 */

import type { CacheEntry, CacheConfig } from '../types';

export interface EvictionContext {
  cache: Map<string, CacheEntry>;
  stats: {
    totalSize: number;
  };
  config: CacheConfig;
}

/**
 * Ensure cache capacity by evicting entries if needed
 */
export async function ensureCapacity(
  newEntrySize: number,
  context: EvictionContext
): Promise<void> {
  // Check size limit
  while (
    context.stats.totalSize + newEntrySize > context.config.maxSize &&
    context.cache.size > 0
  ) {
    await evictLRUEntry(context);
  }

  // Check entry count limit
  while (context.cache.size >= context.config.maxEntries) {
    await evictLRUEntry(context);
  }
}

/**
 * Evict least recently used entry
 */
export async function evictLRUEntry(context: EvictionContext): Promise<void> {
  let oldestKey = '';
  let oldestTime = Date.now();

  for (const [key, entry] of context.cache.entries()) {
    if (entry.lastAccessed < oldestTime) {
      oldestTime = entry.lastAccessed;
      oldestKey = key;
    }
  }

  if (oldestKey) {
    const entry = context.cache.get(oldestKey)!;
    context.cache.delete(oldestKey);
    context.stats.totalSize -= entry.size;
  }
}
