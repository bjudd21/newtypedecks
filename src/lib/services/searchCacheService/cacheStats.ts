/**
 * Cache Statistics
 * Helper functions for calculating cache statistics
 */

import type { CacheEntry, CacheStats } from './types';

interface StatsData {
  totalHits: number;
  totalMisses: number;
  totalSize: number;
  responseTimes: number[];
}

/**
 * Calculate cache statistics
 */
export function calculateStats(
  cache: Map<string, CacheEntry>,
  stats: StatsData
): CacheStats {
  const totalRequests = stats.totalHits + stats.totalMisses;
  const hitRate = totalRequests > 0 ? stats.totalHits / totalRequests : 0;

  let oldestEntry = Date.now();
  let newestEntry = 0;

  for (const entry of cache.values()) {
    if (entry.timestamp < oldestEntry) oldestEntry = entry.timestamp;
    if (entry.timestamp > newestEntry) newestEntry = entry.timestamp;
  }

  const avgResponseTime =
    stats.responseTimes.length > 0
      ? stats.responseTimes.reduce((a, b) => a + b, 0) /
        stats.responseTimes.length
      : 0;

  return {
    totalEntries: cache.size,
    totalSize: stats.totalSize,
    hitRate,
    totalHits: stats.totalHits,
    totalMisses: stats.totalMisses,
    avgResponseTime,
    oldestEntry,
    newestEntry,
  };
}
