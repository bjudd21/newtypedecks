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
import { generateCacheKey } from './cacheKeyGenerator';
import { estimateSize, isEntryValid } from './cacheUtils';
import { calculateStats } from './cacheStats';

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

  private cleanupTimer?: NodeJS.Timeout;

  private constructor(config?: Partial<CacheConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Start periodic cleanup
    this.startPeriodicCleanup();
  }

  public static getInstance(config?: Partial<CacheConfig>): SearchCacheService {
    if (!SearchCacheService.instance) {
      SearchCacheService.instance = new SearchCacheService(config);
    }
    return SearchCacheService.instance;
  }

  /**
   * Get cached search result
   */
  async get(
    filters: CardSearchFilters,
    options: CardSearchOptions
  ): Promise<CardSearchResult | null> {
    const startTime = Date.now();
    const key = generateCacheKey(filters, options);
    const entry = this.cache.get(key);

    if (!entry || !isEntryValid(entry)) {
      this.stats.totalMisses++;
      if (entry) {
        // Remove expired entry
        this.cache.delete(key);
        this.stats.totalSize -= entry.size;
      }
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.totalHits++;

    const responseTime = Date.now() - startTime;
    this.stats.responseTimes.push(responseTime);

    // Keep response times array at reasonable size
    if (this.stats.responseTimes.length > 1000) {
      this.stats.responseTimes = this.stats.responseTimes.slice(-500);
    }

    return entry.result;
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
    const key = generateCacheKey(filters, options);
    const size = estimateSize(result);
    const ttl = customTTL || this.config.defaultTTL;

    // Check if we need to evict entries
    await this.ensureCapacity(size);

    const entry: CacheEntry = {
      result: { ...result }, // Clone to prevent mutations
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
      ttl,
      size,
    };

    // Remove existing entry if it exists
    const existingEntry = this.cache.get(key);
    if (existingEntry) {
      this.stats.totalSize -= existingEntry.size;
    }

    this.cache.set(key, entry);
    this.stats.totalSize += size;
  }

  /**
   * Ensure cache capacity by evicting entries if needed
   */
  private async ensureCapacity(newEntrySize: number): Promise<void> {
    // Check size limit
    while (
      this.stats.totalSize + newEntrySize > this.config.maxSize &&
      this.cache.size > 0
    ) {
      await this.evictLRUEntry();
    }

    // Check entry count limit
    while (this.cache.size >= this.config.maxEntries) {
      await this.evictLRUEntry();
    }
  }

  /**
   * Evict least recently used entry
   */
  private async evictLRUEntry(): Promise<void> {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const entry = this.cache.get(oldestKey)!;
      this.cache.delete(oldestKey);
      this.stats.totalSize -= entry.size;
    }
  }

  /**
   * Clear expired entries
   */
  async cleanup(): Promise<number> {
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (!isEntryValid(entry)) {
        this.cache.delete(key);
        this.stats.totalSize -= entry.size;
        removedCount++;
      }
    }

    return removedCount;
  }

  /**
   * Clear all cached entries
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.stats.totalSize = 0;
    this.stats.totalHits = 0;
    this.stats.totalMisses = 0;
    this.stats.responseTimes = [];
  }

  /**
   * Invalidate cache entries matching filters
   */
  async invalidateByFilters(
    filters: Partial<CardSearchFilters>
  ): Promise<number> {
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
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
        this.cache.delete(key);
        this.stats.totalSize -= entry.size;
        removedCount++;
      }
    }

    return removedCount;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return calculateStats(this.cache, this.stats);
  }

  /**
   * Start periodic cleanup
   */
  private startPeriodicCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(async () => {
      try {
        await this.cleanup();
      } catch (error) {
        console.error('Cache cleanup error:', error);
      }
    }, this.config.cleanupInterval);
  }

  /**
   * Stop periodic cleanup
   */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * Preload frequently accessed searches
   */
  async preloadPopularSearches(): Promise<void> {
    // This would typically be implemented with actual popular search data
    const popularSearches = [
      { filters: { faction: 'Earth Federation' }, options: { limit: 20 } },
      { filters: { faction: 'Zeon' }, options: { limit: 20 } },
      { filters: { series: 'UC' }, options: { limit: 20 } },
      { filters: { typeId: 'unit' }, options: { limit: 20 } },
    ];

    // Note: In a real implementation, you would call the actual search service
    // This is just a placeholder to show the concept
    console.warn('Preloading popular searches:', popularSearches.length);
  }
}

// Export singleton instance
export const searchCache = SearchCacheService.getInstance();
