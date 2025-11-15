/**
 * Search Suggestion Generation
 */

import type {
  SearchPattern,
  UserSearchBehavior,
  SearchSuggestion,
} from '../types';
import type { CardSearchFilters } from '@/lib/types/card';
import { hasOverlap, patternToReadableQuery } from '../utils';
import { getPopularSearches } from '../analytics';

/**
 * Generate search suggestions based on user behavior and patterns
 */
export function generateSearchSuggestions(
  patterns: Map<string, SearchPattern>,
  userBehaviors: Map<string, UserSearchBehavior>,
  userId?: string,
  currentFilters: Partial<CardSearchFilters> = {}
): SearchSuggestion[] {
  const suggestions: SearchSuggestion[] = [];

  // Add popular searches
  const popularSearches = getPopularSearches(patterns, 5);
  popularSearches.forEach((search) => {
    suggestions.push({
      type: 'popular',
      label: `Popular: ${search.query}`,
      filters: search.filters,
      confidence: Math.min(search.popularity / 100, 1),
    });
  });

  // Add personalized suggestions if user ID provided
  if (userId) {
    const userBehavior = userBehaviors.get(userId);
    if (userBehavior) {
      const topFilters = Object.entries(userBehavior.preferredFilters)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      topFilters.forEach(([filterKey, count]) => {
        const [key, valueStr] = filterKey.split(':');
        try {
          const value = JSON.parse(valueStr);
          suggestions.push({
            type: 'personalized',
            label: `Your favorite: ${key} = ${value}`,
            filters: { [key]: value } as CardSearchFilters,
            confidence: Math.min(count / userBehavior.totalSearches, 1),
          });
        } catch {
          // Ignore invalid JSON
        }
      });
    }
  }

  // Add related suggestions based on current filters
  if (Object.keys(currentFilters).length > 0) {
    const relatedPatterns = Array.from(patterns.values())
      .filter((pattern) => hasOverlap(pattern.filters, currentFilters))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    relatedPatterns.forEach((pattern) => {
      suggestions.push({
        type: 'related',
        label: `Related: ${patternToReadableQuery(pattern.filters)}`,
        filters: pattern.filters as CardSearchFilters,
        confidence: Math.min(pattern.count / 50, 1),
      });
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
}
