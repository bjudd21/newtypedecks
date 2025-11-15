/**
 * Cache Statistics Tracker
 */

import type { ImageCacheStats } from '../types';
import type { MemoryCache } from '../storage/memoryCache';

export class StatsTracker {
  private stats: ImageCacheStats = {
    totalSize: 0,
    itemCount: 0,
    hitRate: 0,
    missRate: 0,
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };

  incrementRequests(): void {
    this.stats.totalRequests++;
  }

  recordCacheHit(): void {
    this.stats.cacheHits++;
    this.updateHitRates();
  }

  recordCacheMiss(): void {
    this.stats.cacheMisses++;
    this.updateHitRates();
  }

  updateStats(memoryCache: MemoryCache): void {
    this.stats.itemCount = memoryCache.getCount();
    this.stats.totalSize = memoryCache.getSize();
  }

  getStats(): ImageCacheStats {
    return { ...this.stats };
  }

  reset(): void {
    this.stats = {
      totalSize: 0,
      itemCount: 0,
      hitRate: 0,
      missRate: 0,
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
    };
  }

  private updateHitRates(): void {
    const total = this.stats.cacheHits + this.stats.cacheMisses;
    if (total > 0) {
      this.stats.hitRate = this.stats.cacheHits / total;
      this.stats.missRate = this.stats.cacheMisses / total;
    }
  }
}
