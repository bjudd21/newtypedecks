/**
 * Search Trends Analytics
 */

import type { SearchEvent, SearchTrend } from '../types';
import { getTimeframeCutoff, getBucketSize } from '../utils';

/**
 * Get search trends for a timeframe
 */
export function getSearchTrends(
  events: SearchEvent[],
  timeframe: 'hour' | 'day' | 'week' | 'month'
): SearchTrend {
  const cutoffTime = getTimeframeCutoff(timeframe);
  const relevantEvents = events.filter(
    (event) => event.timestamp >= cutoffTime
  );

  // Group events by time buckets
  const bucketSize = getBucketSize(timeframe);
  const buckets = new Map<
    number,
    {
      searchCount: number;
      uniqueUsers: Set<string>;
      totalResponseTime: number;
      filterCounts: Map<string, number>;
    }
  >();

  relevantEvents.forEach((event) => {
    const bucketKey =
      Math.floor(event.timestamp.getTime() / bucketSize) * bucketSize;

    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, {
        searchCount: 0,
        uniqueUsers: new Set(),
        totalResponseTime: 0,
        filterCounts: new Map(),
      });
    }

    const bucket = buckets.get(bucketKey)!;
    bucket.searchCount++;
    if (event.userId) bucket.uniqueUsers.add(event.userId);
    bucket.totalResponseTime += event.responseTime;

    // Count filters
    Object.entries(event.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const filterKey = `${key}:${JSON.stringify(value)}`;
        bucket.filterCounts.set(
          filterKey,
          (bucket.filterCounts.get(filterKey) || 0) + 1
        );
      }
    });
  });

  const data = Array.from(buckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([timestamp, bucket]) => ({
      timestamp: new Date(timestamp),
      searchCount: bucket.searchCount,
      uniqueUsers: bucket.uniqueUsers.size,
      avgResponseTime:
        bucket.searchCount > 0
          ? bucket.totalResponseTime / bucket.searchCount
          : 0,
      popularFilters: Object.fromEntries(
        Array.from(bucket.filterCounts.entries()).slice(0, 10)
      ),
    }));

  return { timeframe, data };
}
