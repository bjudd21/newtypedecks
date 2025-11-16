/**
 * Performance Summary
 */

import type { QueryPerformanceMetrics, PerformanceSummary } from '../types';

export function getPerformanceSummary(
  queryMetrics: QueryPerformanceMetrics[],
  slowQueryThreshold: number
): PerformanceSummary {
  const total = queryMetrics.length;
  const averageTime =
    total > 0
      ? queryMetrics.reduce((sum, q) => sum + q.duration, 0) / total
      : 0;

  const slowQueries = queryMetrics.filter(
    (q) => q.duration > slowQueryThreshold
  );
  const topSlowQueries = slowQueries
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);

  return {
    totalQueries: total,
    averageTime,
    slowQueries: slowQueries.length,
    topSlowQueries,
  };
}
