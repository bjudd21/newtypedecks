/**
 * Cache Initialization
 */

import type { CacheConfig } from '../types';
import type { IndexedDBCache } from '../storage/indexedDB';

export async function registerServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration =
        await navigator.serviceWorker.register('/sw-image-cache.js');
      console.warn('Image cache service worker registered:', registration);
    } catch (error) {
      console.warn('Failed to register service worker:', error);
    }
  }
}

export async function initializeCache(
  config: CacheConfig,
  indexedDBCache: IndexedDBCache,
  setupCleanup: () => void
): Promise<void> {
  try {
    // Initialize IndexedDB
    if (config.enableIndexedDB) {
      await indexedDBCache.initialize();
    }

    // Register service worker for network caching
    if (config.enableServiceWorker) {
      await registerServiceWorker();
    }

    // Set up cleanup intervals
    setupCleanup();

    console.warn('Image cache service initialized');
  } catch (error) {
    console.warn('Failed to initialize image cache:', error);
  }
}
