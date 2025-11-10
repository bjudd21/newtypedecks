/**
 * Search Result Caching Service
 *
 * Provides intelligent caching for card search results with TTL and LRU eviction
 */

import type { CardSearchFilters, CardSearchOptions, CardSearchResult } from '@/lib/types/card';

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

export class SearchCacheService {
  private static instance: SearchCacheService;
  private cache = new Map<string, CacheEntry>();
  private stats = {
    totalHits: 0,
    totalMisses: 0,
    totalSize: 0,
    responseTimes: [] as number[]
  };

  private config: CacheConfig = {
    maxSize: 50 * 1024 * 1024, // 50MB
    maxEntries: 1000,
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    enableCompression: true,
    cleanupInterval: 30 * 1000 // 30 seconds
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
   * Generate cache key from filters and options
   */
  private generateCacheKey(filters: CardSearchFilters, options: CardSearchOptions): string {
    // Create a normalized key that ignores order and undefined values
    const normalizedFilters = this.normalizeFilters(filters);
    const normalizedOptions = this.normalizeOptions(options);

    return JSON.stringify({
      f: normalizedFilters,
      o: normalizedOptions
    });
  }

  /**
   * Normalize filters for consistent cache keys
   */
  private normalizeFilters(filters: CardSearchFilters): Partial<CardSearchFilters> {
    const normalized: Partial<CardSearchFilters> = {};

    // Only include defined values and sort arrays
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          normalized[key as keyof CardSearchFilters] = [...value].sort() as any;
        } else if (!Array.isArray(value)) {
          normalized[key as keyof CardSearchFilters] = value;
        }
      }
    });

    return normalized;
  }

  /**
   * Normalize options for consistent cache keys
   */
  private normalizeOptions(options: CardSearchOptions): Partial<CardSearchOptions> {
    return {
      page: options.page || 1,
      limit: options.limit || 20,
      sortBy: options.sortBy || 'name',
      sortOrder: options.sortOrder || 'asc',
      includeRelations: options.includeRelations ?? true
    };
  }

  /**
   * Estimate the size of a cache entry
   */
  private estimateSize(result: CardSearchResult): number {
    // Rough estimation: 1KB per card + base overhead
    const cardSize = result.cards.length * 1024;
    const metadataSize = 200; // Small overhead for pagination info
    return cardSize + metadataSize;
  }

  /**
   * Check if cache entry is valid
   */
  private isEntryValid(entry: CacheEntry): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < entry.ttl;
  }

  /**
   * Get cached search result
   */
  async get(filters: CardSearchFilters, options: CardSearchOptions): Promise<CardSearchResult | null> {
    const startTime = Date.now();
    const key = this.generateCacheKey(filters, options);
    const entry = this.cache.get(key);

    if (!entry || !this.isEntryValid(entry)) {
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

    // Keep only recent response times for rolling average
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
    const key = this.generateCacheKey(filters, options);
    const size = this.estimateSize(result);
    const ttl = customTTL || this.config.defaultTTL;

    // Check if we need to evict entries
    await this.ensureCapacity(size);

    const entry: CacheEntry = {
      result: { ...result }, // Clone to prevent mutations
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
      ttl,
      size
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
    while (this.stats.totalSize + newEntrySize > this.config.maxSize && this.cache.size > 0) {
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
    const _now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (!this.isEntryValid(entry)) {
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
  async invalidateByFilters(filters: Partial<CardSearchFilters>): Promise<number> {
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      const keyObj = JSON.parse(key);
      const entryFilters = keyObj.f as CardSearchFilters;

      // Check if any filter matches
      let shouldInvalidate = false;
      for (const [filterKey, filterValue] of Object.entries(filters)) {
        if (entryFilters[filterKey as keyof CardSearchFilters] === filterValue) {
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
    const totalRequests = this.stats.totalHits + this.stats.totalMisses;
    const hitRate = totalRequests > 0 ? this.stats.totalHits / totalRequests : 0;

    let oldestEntry = Date.now();
    let newestEntry = 0;

    for (const entry of this.cache.values()) {
      if (entry.timestamp < oldestEntry) oldestEntry = entry.timestamp;
      if (entry.timestamp > newestEntry) newestEntry = entry.timestamp;
    }

    const avgResponseTime = this.stats.responseTimes.length > 0
      ? this.stats.responseTimes.reduce((a, b) => a + b, 0) / this.stats.responseTimes.length
      : 0;

    return {
      totalEntries: this.cache.size,
      totalSize: this.stats.totalSize,
      hitRate,
      totalHits: this.stats.totalHits,
      totalMisses: this.stats.totalMisses,
      avgResponseTime,
      oldestEntry,
      newestEntry
    };
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
      { filters: { typeId: 'unit' }, options: { limit: 20 } }
    ];

    // Note: In a real implementation, you would call the actual search service
    // This is just a placeholder to show the concept
    console.log('Preloading popular searches:', popularSearches.length);
  }
}

// Export singleton instance
export const searchCache = SearchCacheService.getInstance();