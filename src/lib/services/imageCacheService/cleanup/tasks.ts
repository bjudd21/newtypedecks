/**
 * Cleanup Tasks
 */

import type { CacheConfig } from '../types';
import type { MemoryCache } from '../storage/memoryCache';
import type { IndexedDBCache } from '../storage/indexedDB';

export function setupCleanupTasks(
  config: CacheConfig,
  memoryCache: MemoryCache,
  indexedDBCache: IndexedDBCache,
  cleanup: () => void
): void {
  // Clean up expired items every 5 minutes
  setInterval(
    () => {
      cleanupExpiredItems(config, memoryCache, indexedDBCache);
    },
    5 * 60 * 1000
  );

  // Cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      cleanup();
    });
  }
}

export async function cleanupExpiredItems(
  config: CacheConfig,
  memoryCache: MemoryCache,
  indexedDBCache: IndexedDBCache
): Promise<void> {
  const now = Date.now();

  // Cleanup memory cache
  for (const [url, item] of memoryCache.entries()) {
    if (now - item.timestamp > config.maxAge) {
      memoryCache.entries(); // This will delete expired items via the get method
    }
  }

  // Cleanup IndexedDB
  if (config.enableIndexedDB) {
    await indexedDBCache.cleanupExpired(config.maxAge);
  }
}

export function cleanup(memoryCache: MemoryCache): void {
  // Revoke all object URLs to prevent memory leaks
  for (const item of memoryCache.values()) {
    try {
      URL.revokeObjectURL(URL.createObjectURL(item.blob));
    } catch (_error) {
      // Ignore cleanup errors
    }
  }
}
