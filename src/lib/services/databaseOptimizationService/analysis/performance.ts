/**
 * Performance Analysis
 */

import type { QueryPerformanceMetrics, QueryAnalysisResult } from '../types';
import { analyzeCommonFilters } from './filters';

export function analyzeQueryPerformance(
  queryId: string,
  queryMetrics: QueryPerformanceMetrics[],
  slowQueryThreshold: number
): QueryAnalysisResult {
  const queries = queryMetrics.filter((m) => m.queryId === queryId);

  if (queries.length === 0) {
    return {
      averageTime: 0,
      slowQueryCount: 0,
      suggestions: ['No query data available'],
    };
  }

  const averageTime =
    queries.reduce((sum, q) => sum + q.duration, 0) / queries.length;
  const slowQueryCount = queries.filter(
    (q) => q.duration > slowQueryThreshold
  ).length;
  const suggestions: string[] = [];

  // Analyze patterns and suggest optimizations
  if (averageTime > 500) {
    suggestions.push(
      'Consider adding database indexes for frequently filtered fields'
    );
  }

  if (slowQueryCount > queries.length * 0.1) {
    suggestions.push(
      'High percentage of slow queries detected - review query structure'
    );
  }

  // Analyze filter patterns
  const commonFilters = analyzeCommonFilters(queries);
  if (commonFilters.length > 0) {
    suggestions.push(
      `Consider composite indexes for: ${commonFilters.join(', ')}`
    );
  }

  return {
    averageTime,
    slowQueryCount,
    suggestions,
  };
}
