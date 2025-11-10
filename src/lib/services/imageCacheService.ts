/**
 * Image Cache Service
 *
 * Handles client-side image caching, preloading, and performance optimization
 */

export interface CacheConfig {
  maxAge: number; // Cache duration in milliseconds
  maxSize: number; // Max cache size in bytes
  enableServiceWorker: boolean;
  enableMemoryCache: boolean;
  enableIndexedDB: boolean;
  preloadCritical: boolean;
}

export interface CachedImage {
  url: string;
  blob: Blob;
  timestamp: number;
  size: number;
  format: string;
  accessed: number;
}

export interface ImageCacheStats {
  totalSize: number;
  itemCount: number;
  hitRate: number;
  missRate: number;
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
}

export class ImageCacheService {
  private static instance: ImageCacheService;
  private config: CacheConfig;
  private memoryCache: Map<string, CachedImage> = new Map();
  private stats: ImageCacheStats = {
    totalSize: 0,
    itemCount: 0,
    hitRate: 0,
    missRate: 0,
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };
  private dbName = 'gundam-card-images';
  private dbVersion = 1;

  private constructor() {
    this.config = {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      maxSize: 100 * 1024 * 1024, // 100MB
      enableServiceWorker: typeof window !== 'undefined' && 'serviceWorker' in navigator,
      enableMemoryCache: true,
      enableIndexedDB: typeof window !== 'undefined' && 'indexedDB' in window,
      preloadCritical: true,
    };

    if (typeof window !== 'undefined') {
      this.initializeCache();
    }
  }

  public static getInstance(): ImageCacheService {
    if (!ImageCacheService.instance) {
      ImageCacheService.instance = new ImageCacheService();
    }
    return ImageCacheService.instance;
  }

  /**
   * Initialize cache systems
   */
  private async initializeCache(): Promise<void> {
    try {
      // Initialize IndexedDB
      if (this.config.enableIndexedDB) {
        await this.initializeIndexedDB();
      }

      // Register service worker for network caching
      if (this.config.enableServiceWorker) {
        await this.registerServiceWorker();
      }

      // Set up cleanup intervals
      this.setupCleanupTasks();

      console.warn('Image cache service initialized');
    } catch (error) {
      console.warn('Failed to initialize image cache:', error);
    }
  }

  /**
   * Get cached image or fetch from network
   */
  async getImage(url: string, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<string> {
    this.stats.totalRequests++;

    try {
      // Check memory cache first
      const memoryImage = await this.getFromMemoryCache(url);
      if (memoryImage) {
        this.recordCacheHit();
        return URL.createObjectURL(memoryImage.blob);
      }

      // Check IndexedDB cache
      const dbImage = await this.getFromIndexedDB(url);
      if (dbImage) {
        // Store in memory for faster access
        this.storeInMemoryCache(url, dbImage);
        this.recordCacheHit();
        return URL.createObjectURL(dbImage.blob);
      }

      // Fetch from network
      const blob = await this.fetchFromNetwork(url, priority);
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
      this.recordCacheMiss();

      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Failed to get image:', error);
      this.recordCacheMiss();
      return url; // Fallback to original URL
    }
  }

  /**
   * Preload critical images
   */
  async preloadImages(urls: string[], priority: 'high' | 'normal' | 'low' = 'high'): Promise<void> {
    if (!this.config.preloadCritical) return;

    const preloadPromises = urls.slice(0, 10).map(url => // Limit to 10 images
      this.getImage(url, priority).catch(error => {
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
      urls.forEach(url => {
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
    this.updateStats();
    return { ...this.stats };
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
        await this.clearIndexedDB();
      }

      // Reset stats
      this.stats = {
        totalSize: 0,
        itemCount: 0,
        hitRate: 0,
        missRate: 0,
        totalRequests: 0,
        cacheHits: 0,
        cacheMisses: 0,
      };

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

  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('images')) {
          const store = db.createObjectStore('images', { keyPath: 'url' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('size', 'size', { unique: false });
        }
      };
    });
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw-image-cache.js');
        console.warn('Image cache service worker registered:', registration);
      } catch (error) {
        console.warn('Failed to register service worker:', error);
      }
    }
  }

  private setupCleanupTasks(): void {
    // Clean up expired items every 5 minutes
    setInterval(() => {
      this.cleanupExpiredItems();
    }, 5 * 60 * 1000);

    // Cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.cleanup();
      });
    }
  }

  private async getFromMemoryCache(url: string): Promise<CachedImage | null> {
    if (!this.config.enableMemoryCache) return null;

    const cached = this.memoryCache.get(url);
    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > this.config.maxAge) {
      this.memoryCache.delete(url);
      return null;
    }

    // Update access time
    cached.accessed = Date.now();
    return cached;
  }

  private storeInMemoryCache(url: string, image: CachedImage): void {
    if (!this.config.enableMemoryCache) return;

    // Check size limits
    if (this.getMemoryCacheSize() + image.size > this.config.maxSize) {
      this.evictLRUMemoryItems(image.size);
    }

    this.memoryCache.set(url, image);
  }

  private async getFromIndexedDB(url: string): Promise<CachedImage | null> {
    if (!this.config.enableIndexedDB) return null;

    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');

      return new Promise((resolve, reject) => {
        const request = store.get(url);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = request.result;
          if (!result) {
            resolve(null);
            return;
          }

          // Check if expired
          if (Date.now() - result.timestamp > this.config.maxAge) {
            // Delete expired item
            const deleteTransaction = db.transaction(['images'], 'readwrite');
            const deleteStore = deleteTransaction.objectStore('images');
            deleteStore.delete(url);
            resolve(null);
            return;
          }

          resolve(result);
        };
      });
    } catch (error) {
      console.warn('Failed to get from IndexedDB:', error);
      return null;
    }
  }

  private async storeImage(image: CachedImage): Promise<void> {
    // Store in memory cache
    this.storeInMemoryCache(image.url, image);

    // Store in IndexedDB
    if (this.config.enableIndexedDB) {
      try {
        const db = await this.openIndexedDB();
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        store.put(image);
      } catch (error) {
        console.warn('Failed to store in IndexedDB:', error);
      }
    }
  }

  private async fetchFromNetwork(url: string, priority: 'high' | 'normal' | 'low'): Promise<Blob> {
    const fetchOptions: RequestInit = {
      cache: 'default',
    };

    // Set priority if supported
    if ('priority' in Request.prototype) {
      (fetchOptions as any).priority = priority; // TODO: Add proper RequestInit type with priority
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }

  private getMemoryCacheSize(): number {
    return Array.from(this.memoryCache.values()).reduce((total, item) => total + item.size, 0);
  }

  private evictLRUMemoryItems(spaceNeeded: number): void {
    // Sort by access time (least recently used first)
    const entries = Array.from(this.memoryCache.entries())
      .sort((a, b) => a[1].accessed - b[1].accessed);

    let freedSpace = 0;
    for (const [url, item] of entries) {
      this.memoryCache.delete(url);
      freedSpace += item.size;

      if (freedSpace >= spaceNeeded) {
        break;
      }
    }
  }

  private async cleanupExpiredItems(): Promise<void> {
    const now = Date.now();

    // Cleanup memory cache
    for (const [url, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > this.config.maxAge) {
        this.memoryCache.delete(url);
      }
    }

    // Cleanup IndexedDB
    if (this.config.enableIndexedDB) {
      try {
        const db = await this.openIndexedDB();
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        const index = store.index('timestamp');

        const cutoff = now - this.config.maxAge;
        const range = IDBKeyRange.upperBound(cutoff);

        index.openCursor(range).onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        };
      } catch (error) {
        console.warn('Failed to cleanup IndexedDB:', error);
      }
    }
  }

  private async clearIndexedDB(): Promise<void> {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      store.clear();
    } catch (error) {
      console.warn('Failed to clear IndexedDB:', error);
    }
  }

  private async openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private recordCacheHit(): void {
    this.stats.cacheHits++;
    this.updateHitRates();
  }

  private recordCacheMiss(): void {
    this.stats.cacheMisses++;
    this.updateHitRates();
  }

  private updateHitRates(): void {
    const total = this.stats.cacheHits + this.stats.cacheMisses;
    if (total > 0) {
      this.stats.hitRate = this.stats.cacheHits / total;
      this.stats.missRate = this.stats.cacheMisses / total;
    }
  }

  private updateStats(): void {
    this.stats.itemCount = this.memoryCache.size;
    this.stats.totalSize = this.getMemoryCacheSize();
  }

  private cleanup(): void {
    // Revoke all object URLs to prevent memory leaks
    for (const item of this.memoryCache.values()) {
      try {
        URL.revokeObjectURL(URL.createObjectURL(item.blob));
      } catch (_error) {
        // Ignore cleanup errors
      }
    }
  }
}