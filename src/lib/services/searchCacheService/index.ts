/**
 * Search Cache Service Module
 * Exports all search cache functionality
 */

// Export types
export type {
  CacheEntry,
  CacheKey,
  CacheStats,
  CacheConfig,
} from './types';

// Export utility functions
export { generateCacheKey, normalizeFilters, normalizeOptions } from './cacheKeyGenerator';
export { estimateSize, isEntryValid } from './cacheUtils';
export { calculateStats } from './cacheStats';

// Export main service
export { SearchCacheService, searchCache } from './SearchCacheService';
export { searchCache as default } from './SearchCacheService';
