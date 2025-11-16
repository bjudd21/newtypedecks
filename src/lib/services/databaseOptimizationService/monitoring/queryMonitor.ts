/**
 * Query Monitoring
 */

import type { QueryPerformanceMetrics } from '../types';

export async function monitorQuery<T>(
  queryId: string,
  queryFn: () => Promise<T>,
  context: {
    filters?: Record<string, unknown>;
    options?: Record<string, unknown>;
  },
  slowQueryThreshold: number,
  recordMetrics: (metrics: QueryPerformanceMetrics) => void
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await queryFn();
    const duration = Date.now() - startTime;

    // Record metrics
    const metrics: QueryPerformanceMetrics = {
      queryId,
      sql: '', // Would be populated in a real implementation with query logging
      duration,
      timestamp: new Date(),
      resultCount: Array.isArray(result) ? result.length : 1,
      filters: context.filters || {},
      options: context.options || {},
    };

    recordMetrics(metrics);

    // Log slow queries
    if (duration > slowQueryThreshold) {
      console.warn(`Slow query detected: ${queryId} took ${duration}ms`, {
        context,
        duration,
      });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Query failed: ${queryId} after ${duration}ms`, error);
    throw error;
  }
}
