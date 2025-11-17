/**
 * Type definitions for search cache service
 */

import type {
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '@/lib/types/card';

export interface CacheEntry {
  result: CardSearchResult;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  ttl: number;
  size: number; // Estimated memory size in bytes
}

export interface CacheKey {
  filters: CardSearchFilters;
  options: CardSearchOptions;
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  avgResponseTime: number;
  oldestEntry: number;
  newestEntry: number;
}

export interface CacheConfig {
  maxSize: number; // Maximum cache size in bytes (default: 50MB)
  maxEntries: number; // Maximum number of entries (default: 1000)
  defaultTTL: number; // Default TTL in milliseconds (default: 5 minutes)
  enableCompression: boolean; // Enable result compression (default: true)
  cleanupInterval: number; // Cleanup interval in milliseconds (default: 30 seconds)
}
