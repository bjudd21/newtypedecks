/**
 * Popular Searches Analytics
 */

import type { SearchPattern, PopularSearch } from '../types';
import type { CardSearchFilters } from '@/lib/types/card';
import { getTimeframeCutoff, patternToReadableQuery } from '../utils';

/**
 * Calculate trend score for a search pattern
 */
export function calculateTrendScore(pattern: SearchPattern): number {
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;

  // Simple trend calculation - could be more sophisticated
  const recentActivity = pattern.lastSeen.getTime() > dayAgo ? 1 : 0;
  const totalActivity = pattern.count;

  return recentActivity * 0.7 + Math.min(totalActivity / 100, 1) * 0.3;
}

/**
 * Get popular searches
 */
export function getPopularSearches(
  patterns: Map<string, SearchPattern>,
  limit = 10,
  timeframe?: 'day' | 'week' | 'month'
): PopularSearch[] {
  const cutoffTime = timeframe ? getTimeframeCutoff(timeframe) : null;

  const popularPatterns = Array.from(patterns.entries())
    .filter(([, pattern]) => !cutoffTime || pattern.lastSeen >= cutoffTime)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit);

  return popularPatterns.map(([_key, pattern]) => ({
    query: patternToReadableQuery(pattern.filters),
    filters: pattern.filters as CardSearchFilters,
    options: { sortBy: 'name', sortOrder: 'asc' as const },
    popularity: pattern.count,
    trendScore: calculateTrendScore(pattern),
    lastQueried: pattern.lastSeen,
  }));
}
