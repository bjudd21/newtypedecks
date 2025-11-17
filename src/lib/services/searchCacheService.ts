/**
 * Search Cache Service - Re-export for backward compatibility
 * All implementation moved to searchCacheService/ directory
 */

export type {
  CacheEntry,
  CacheKey,
  CacheStats,
  CacheConfig,
} from './searchCacheService/types';

export { SearchCacheService, searchCache } from './searchCacheService/SearchCacheService';
export { searchCache as default } from './searchCacheService/SearchCacheService';
