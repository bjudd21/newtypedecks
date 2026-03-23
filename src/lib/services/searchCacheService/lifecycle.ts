/**
 * Cache lifecycle management
 */

import type { CacheConfig } from './types';
import {
  cleanupExpiredEntries,
  type CleanupContext,
} from './operations/cleanup';

export interface LifecycleManager {
  cleanupTimer?: NodeJS.Timeout;
}

/**
 * Start periodic cleanup
 */
export function startPeriodicCleanup(
  config: CacheConfig,
  context: CleanupContext,
  manager: LifecycleManager
): void {
  if (manager.cleanupTimer) {
    clearInterval(manager.cleanupTimer);
  }

  manager.cleanupTimer = setInterval(async () => {
    try {
      await cleanupExpiredEntries(context);
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }, config.cleanupInterval);
}

/**
 * Stop periodic cleanup
 */
export function stopPeriodicCleanup(manager: LifecycleManager): void {
  if (manager.cleanupTimer) {
    clearInterval(manager.cleanupTimer);
    manager.cleanupTimer = undefined;
  }
}

/**
 * Preload frequently accessed searches
 */
export async function preloadPopularSearches(): Promise<void> {
  // This would typically be implemented with actual popular search data
  // Preloads are generic and game-agnostic; game-specific queries are not hardcoded here
  const popularSearches = [
    { filters: { typeId: 'unit' }, options: { limit: 20 } },
    { filters: { typeId: 'command' }, options: { limit: 20 } },
  ];

  // Note: In a real implementation, you would call the actual search service
  // This is just a placeholder to show the concept
  console.warn('Preloading popular searches:', popularSearches.length);
}
