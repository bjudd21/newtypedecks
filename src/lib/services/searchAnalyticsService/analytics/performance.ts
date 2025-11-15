/**
 * Performance Metrics Analytics
 */

import type { SearchEvent } from '../types';
import { getTimeframeCutoff } from '../utils';
import { getSearchTrends } from './trends';

/**
 * Get search performance metrics
 */
export function getPerformanceMetrics(
  events: SearchEvent[],
  timeframe?: 'day' | 'week' | 'month'
) {
  const cutoffTime = timeframe ? getTimeframeCutoff(timeframe) : null;
  const relevantEvents = cutoffTime
    ? events.filter((event) => event.timestamp >= cutoffTime)
    : events;

  if (relevantEvents.length === 0) {
    return {
      totalSearches: 0,
      avgResponseTime: 0,
      medianResponseTime: 0,
      p95ResponseTime: 0,
      slowQueries: [],
      popularFilters: {},
      searchVolume: [],
    };
  }

  const responseTimes = relevantEvents
    .map((e) => e.responseTime)
    .sort((a, b) => a - b);
  const avgResponseTime =
    responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const medianIndex = Math.floor(responseTimes.length / 2);
  const medianResponseTime =
    responseTimes.length % 2 === 0
      ? (responseTimes[medianIndex - 1] + responseTimes[medianIndex]) / 2
      : responseTimes[medianIndex];
  const p95Index = Math.floor(responseTimes.length * 0.95);
  const p95ResponseTime = responseTimes[p95Index];

  // Identify slow queries (top 5% by response time)
  const slowQueryThreshold =
    responseTimes[Math.floor(responseTimes.length * 0.95)];
  const slowQueries = relevantEvents
    .filter((e) => e.responseTime >= slowQueryThreshold)
    .map((e) => ({
      filters: e.filters,
      responseTime: e.responseTime,
      resultCount: e.resultCount,
      timestamp: e.timestamp,
    }));

  // Calculate popular filters
  const filterCounts: Record<string, number> = {};
  relevantEvents.forEach((event) => {
    Object.entries(event.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const filterKey = `${key}:${JSON.stringify(value)}`;
        filterCounts[filterKey] = (filterCounts[filterKey] || 0) + 1;
      }
    });
  });

  return {
    totalSearches: relevantEvents.length,
    avgResponseTime,
    medianResponseTime,
    p95ResponseTime,
    slowQueries: slowQueries.slice(0, 10),
    popularFilters: Object.fromEntries(
      Object.entries(filterCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
    ),
    searchVolume: getSearchTrends(events, timeframe || 'day').data,
  };
}
