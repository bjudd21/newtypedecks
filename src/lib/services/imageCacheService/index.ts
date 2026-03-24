/**
 * Image Cache Service
 *
 * Handles client-side image caching, preloading, and performance optimization
 */

import type { CacheConfig, CachedImage, ImageCacheStats } from './types';
import { MemoryCache } from './storage/memoryCache';
import { IndexedDBCache } from './storage/indexedDB';
import { StatsTracker } from './stats/tracker';
import { setupCleanupTasks, cleanup as cleanupMemory } from './cleanup/tasks';
import { initializeCache } from './initialization/setup';

export type { CacheConfig, CachedImage, ImageCacheStats };

export class ImageCacheService {
  private static instance: ImageCacheService;
  private config: CacheConfig;
  private memoryCache: MemoryCache;
  private indexedDBCache: IndexedDBCache;
  private statsTracker: StatsTracker;

  private constructor() {
    this.config = {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      maxSize: 100 * 1024 * 1024, // 100MB
      enableServiceWorker:
        typeof window !== 'undefined' && 'serviceWorker' in navigator,
      enableMemoryCache: true,
      enableIndexedDB: typeof window !== 'undefined' && 'indexedDB' in window,
      preloadCritical: true,
    };

    this.memoryCache = new MemoryCache();
    this.indexedDBCache = new IndexedDBCache();
    this.statsTracker = new StatsTracker();

    if (typeof window !== 'undefined') {
      initializeCache(this.config, this.indexedDBCache, () =>
        this.setupCleanup()
      );
    }
  }

  public static getInstance(): ImageCacheService {
    if (!ImageCacheService.instance) {
      ImageCacheService.instance = new ImageCacheService();
    }
    return ImageCacheService.instance;
  }

  /**
   * Return the image URL as-is.
   *
   * NOTE: The previous implementation fetched images as blobs and stored them
   * in memory/IndexedDB, then returned blob: URLs. This bypassed next/image's
   * server-side optimisation, CDN caching, and WebP/AVIF format negotiation —
   * actively making image performance worse. The blob cache has been removed.
   *
   * TODO: Remove this entire service. Callers should rely on next/image's
   * built-in caching (via /_next/image) and use the `priority` prop for
   * above-the-fold images instead of manual preloading.
   */
  async getImage(
    url: string,
    _priority?: 'high' | 'normal' | 'low'
  ): Promise<string> {
    this.statsTracker.incrementRequests();
    this.statsTracker.recordCacheMiss();
    return url;
  }

  /**
   * Hint the browser to prefetch images during idle time.
   * Uses native Image() preloading so next/image's /_next/image pipeline
   * handles format selection and caching — no blob conversion.
   */
  async preloadImages(
    urls: string[],
    _priority: 'high' | 'normal' | 'low' = 'high'
  ): Promise<void> {
    if (!this.config.preloadCritical || typeof window === 'undefined') return;

    urls.slice(0, 10).forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }

  /**
   * Prefetch images for later use during browser idle time.
   */
  async prefetchImages(urls: string[]): Promise<void> {
    if (typeof window === 'undefined') return;

    const schedule =
      'requestIdleCallback' in window ? requestIdleCallback : setTimeout;

    urls.forEach((url) => {
      schedule(() => {
        const img = new Image();
        img.src = url;
      });
    });
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): ImageCacheStats {
    this.statsTracker.updateStats(this.memoryCache);
    return this.statsTracker.getStats();
  }

  /**
   * Clear all caches
   */
  async clearCache(): Promise<void> {
    try {
      // Clear memory cache
      this.memoryCache.clear();

      // Clear IndexedDB
      if (this.config.enableIndexedDB) {
        await this.indexedDBCache.clear();
      }

      // Reset stats
      this.statsTracker.reset();

      console.warn('Image cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Update cache configuration
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Private methods

  private async storeImage(image: CachedImage): Promise<void> {
    // Store in memory cache
    this.memoryCache.set(image.url, image, this.config);

    // Store in IndexedDB
    if (this.config.enableIndexedDB) {
      await this.indexedDBCache.set(image);
    }
  }

  private setupCleanup(): void {
    setupCleanupTasks(this.config, this.memoryCache, this.indexedDBCache, () =>
      cleanupMemory(this.memoryCache)
    );
  }
}
