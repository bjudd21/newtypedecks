/**
 * Search Cache Service - Main orchestrator
 * Singleton service for caching search results with TTL and LRU eviction
 */

import type {
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '@/lib/types/card';
import type { CacheEntry, CacheStats, CacheConfig } from './types';
import { getCachedResult } from './operations/get';
import { setCachedResult } from './operations/set';
import { cleanupExpiredEntries, clearAllEntries } from './operations/cleanup';
import { invalidateByFilters } from './operations/invalidate';
import { calculateStats } from './cacheStats';
import {
  startPeriodicCleanup,
  stopPeriodicCleanup,
  preloadPopularSearches,
  type LifecycleManager,
} from './lifecycle';

export class SearchCacheService {
  private static instance: SearchCacheService;
  private cache = new Map<string, CacheEntry>();
  private stats = {
    totalHits: 0,
    totalMisses: 0,
    totalSize: 0,
    responseTimes: [] as number[],
  };

  private config: CacheConfig = {
    maxSize: 50 * 1024 * 1024, // 50MB
    maxEntries: 1000,
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    enableCompression: true,
    cleanupInterval: 30 * 1000, // 30 seconds
  };

  private lifecycle: LifecycleManager = {};

  private constructor(config?: Partial<CacheConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Start periodic cleanup
    startPeriodicCleanup(this.config, this.getCleanupContext(), this.lifecycle);
  }

  public static getInstance(config?: Partial<CacheConfig>): SearchCacheService {
    if (!SearchCacheService.instance) {
      SearchCacheService.instance = new SearchCacheService(config);
    }
    return SearchCacheService.instance;
  }

  private getContext() {
    return {
      cache: this.cache,
      stats: this.stats,
      config: this.config,
    };
  }

  private getCleanupContext() {
    return {
      cache: this.cache,
      stats: this.stats,
    };
  }

  /**
   * Get cached search result
   */
  async get(
    filters: CardSearchFilters,
    options: CardSearchOptions
  ): Promise<CardSearchResult | null> {
    return getCachedResult(filters, options, this.getContext());
  }

  /**
   * Cache search result
   */
  async set(
    filters: CardSearchFilters,
    options: CardSearchOptions,
    result: CardSearchResult,
    customTTL?: number
  ): Promise<void> {
    return setCachedResult(filters, options, result, customTTL, this.getContext());
  }

  /**
   * Clear expired entries
   */
  async cleanup(): Promise<number> {
    return cleanupExpiredEntries(this.getCleanupContext());
  }

  /**
   * Clear all cached entries
   */
  async clear(): Promise<void> {
    return clearAllEntries(this.getCleanupContext());
  }

  /**
   * Invalidate cache entries matching filters
   */
  async invalidateByFilters(
    filters: Partial<CardSearchFilters>
  ): Promise<number> {
    return invalidateByFilters(filters, this.getContext());
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return calculateStats(this.cache, this.stats);
  }

  /**
   * Stop periodic cleanup
   */
  stopCleanup(): void {
    stopPeriodicCleanup(this.lifecycle);
  }

  /**
   * Preload frequently accessed searches
   */
  async preloadPopularSearches(): Promise<void> {
    return preloadPopularSearches();
  }
}

// Export singleton instance
export const searchCache = SearchCacheService.getInstance();
