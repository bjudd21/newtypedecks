/**
 * Image Cache Types
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
