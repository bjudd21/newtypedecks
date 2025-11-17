/**
 * Cache Utilities
 * Helper functions for cache operations
 */

import type { CardSearchResult } from '@/lib/types/card';
import type { CacheEntry } from './types';

/**
 * Estimate the size of a cache entry
 */
export function estimateSize(result: CardSearchResult): number {
  // Rough estimation: 1KB per card + base overhead
  const cardSize = result.cards.length * 1024;
  const metadataSize = 200; // Small overhead for pagination info
  return cardSize + metadataSize;
}

/**
 * Check if cache entry is valid
 */
export function isEntryValid(entry: CacheEntry): boolean {
  const now = Date.now();
  return now - entry.timestamp < entry.ttl;
}
