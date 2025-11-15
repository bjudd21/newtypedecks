/**
 * Image Cache Service
 *
 * Handles client-side image caching, preloading, and performance optimization
 */

import type {
  CacheConfig,
  CachedImage,
  ImageCacheStats,
} from './types';
import { MemoryCache } from './storage/memoryCache';
import { IndexedDBCache } from './storage/indexedDB';
import { fetchFromNetwork } from './network/fetcher';
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
      initializeCache(
        this.config,
        this.indexedDBCache,
        () => this.setupCleanup()
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
   * Get cached image or fetch from network
   */
  async getImage(
    url: string,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<string> {
    this.statsTracker.incrementRequests();

    try {
      // Check memory cache first
      const memoryImage = this.memoryCache.get(url, this.config);
      if (memoryImage) {
        this.statsTracker.recordCacheHit();
        return URL.createObjectURL(memoryImage.blob);
      }

      // Check IndexedDB cache
      const dbImage = await this.indexedDBCache.get(url, this.config);
      if (dbImage) {
        // Store in memory for faster access
        this.memoryCache.set(url, dbImage, this.config);
        this.statsTracker.recordCacheHit();
        return URL.createObjectURL(dbImage.blob);
      }

      // Fetch from network
      const blob = await fetchFromNetwork(url, priority);
      const cachedImage: CachedImage = {
        url,
        blob,
        timestamp: Date.now(),
        size: blob.size,
        format: blob.type,
        accessed: Date.now(),
      };

      // Cache the image
      await this.storeImage(cachedImage);
      this.statsTracker.recordCacheMiss();

      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Failed to get image:', error);
      this.statsTracker.recordCacheMiss();
      return url; // Fallback to original URL
    }
  }

  /**
   * Preload critical images
   */
  async preloadImages(
    urls: string[],
    priority: 'high' | 'normal' | 'low' = 'high'
  ): Promise<void> {
    if (!this.config.preloadCritical) return;

    const preloadPromises = urls.slice(0, 10).map(
      (
        url // Limit to 10 images
      ) =>
        this.getImage(url, priority).catch((error) => {
          console.warn(`Failed to preload image ${url}:`, error);
        })
    );

    await Promise.allSettled(preloadPromises);
  }

  /**
   * Prefetch images for later use
   */
  async prefetchImages(urls: string[]): Promise<void> {
    // Use requestIdleCallback to prefetch during idle time
    if ('requestIdleCallback' in window) {
      urls.forEach((url) => {
        requestIdleCallback(() => {
          this.getImage(url, 'low').catch(() => {
            // Silently fail prefetch attempts
          });
        });
      });
    }
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
    setupCleanupTasks(
      this.config,
      this.memoryCache,
      this.indexedDBCache,
      () => cleanupMemory(this.memoryCache)
    );
  }
}
