/**
 * Filter Analysis
 */

import type { QueryPerformanceMetrics } from '../types';

export function analyzeCommonFilters(
  queries: QueryPerformanceMetrics[]
): string[] {
  const filterCombinations: Map<string, number> = new Map();

  queries.forEach((query) => {
    const filters = Object.keys(query.filters || {})
      .filter(
        (key) => query.filters[key] !== undefined && query.filters[key] !== null
      )
      .sort();

    if (filters.length > 1) {
      const combination = filters.join('+');
      filterCombinations.set(
        combination,
        (filterCombinations.get(combination) || 0) + 1
      );
    }
  });

  // Return combinations used more than 5 times
  return Array.from(filterCombinations.entries())
    .filter(([, count]) => count > 5)
    .map(([combination]) => combination);
}
