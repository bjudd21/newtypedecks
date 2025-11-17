/**
 * Cache cleanup operations
 */

import type { CacheEntry } from '../types';
import { isEntryValid } from '../cacheUtils';

export interface CleanupContext {
  cache: Map<string, CacheEntry>;
  stats: {
    totalSize: number;
    totalHits: number;
    totalMisses: number;
    responseTimes: number[];
  };
}

/**
 * Clear expired entries
 */
export async function cleanupExpiredEntries(
  context: CleanupContext
): Promise<number> {
  let removedCount = 0;

  for (const [key, entry] of context.cache.entries()) {
    if (!isEntryValid(entry)) {
      context.cache.delete(key);
      context.stats.totalSize -= entry.size;
      removedCount++;
    }
  }

  return removedCount;
}

/**
 * Clear all cached entries
 */
export async function clearAllEntries(context: CleanupContext): Promise<void> {
  context.cache.clear();
  context.stats.totalSize = 0;
  context.stats.totalHits = 0;
  context.stats.totalMisses = 0;
  context.stats.responseTimes = [];
}
