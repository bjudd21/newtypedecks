/**
 * Memory Cache Operations
 */

import type { CachedImage, CacheConfig } from '../types';

export class MemoryCache {
  private cache: Map<string, CachedImage> = new Map();

  get(url: string, config: CacheConfig): CachedImage | null {
    if (!config.enableMemoryCache) return null;

    const cached = this.cache.get(url);
    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > config.maxAge) {
      this.cache.delete(url);
      return null;
    }

    // Update access time
    cached.accessed = Date.now();
    return cached;
  }

  set(url: string, image: CachedImage, config: CacheConfig): void {
    if (!config.enableMemoryCache) return;

    // Check size limits
    if (this.getSize() + image.size > config.maxSize) {
      this.evictLRUItems(image.size);
    }

    this.cache.set(url, image);
  }

  clear(): void {
    this.cache.clear();
  }

  getSize(): number {
    return Array.from(this.cache.values()).reduce(
      (total, item) => total + item.size,
      0
    );
  }

  getCount(): number {
    return this.cache.size;
  }

  entries(): IterableIterator<[string, CachedImage]> {
    return this.cache.entries();
  }

  values(): IterableIterator<CachedImage> {
    return this.cache.values();
  }

  private evictLRUItems(spaceNeeded: number): void {
    // Sort by access time (least recently used first)
    const entries = Array.from(this.cache.entries()).sort(
      (a, b) => a[1].accessed - b[1].accessed
    );

    let freedSpace = 0;
    for (const [url, item] of entries) {
      this.cache.delete(url);
      freedSpace += item.size;

      if (freedSpace >= spaceNeeded) {
        break;
      }
    }
  }
}
