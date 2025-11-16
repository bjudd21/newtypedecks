/**
 * Metrics Recording
 */

import type { QueryPerformanceMetrics } from '../types';

export function recordQueryMetrics(
  metrics: QueryPerformanceMetrics,
  queryMetrics: QueryPerformanceMetrics[]
): QueryPerformanceMetrics[] {
  queryMetrics.push(metrics);

  // Keep only recent metrics (last 7 days)
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return queryMetrics.filter((m) => m.timestamp.getTime() > cutoff);
}
