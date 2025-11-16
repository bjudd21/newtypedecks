/**
 * Database Optimization Service
 *
 * Handles query optimization, performance monitoring, and database health checks
 */

import type {
  QueryPerformanceMetrics,
  DatabaseHealthMetrics,
  QueryAnalysisResult,
  PerformanceSummary,
  MaintenanceResult,
} from './types';
import type { CardSearchFilters, CardSearchOptions } from '@/lib/types/card';
import { monitorQuery } from './monitoring/queryMonitor';
import { recordQueryMetrics } from './monitoring/metricsRecorder';
import { buildOptimizedCardQuery } from './queryBuilder';
import { analyzeQueryPerformance } from './analysis/performance';
import { getPerformanceSummary } from './analysis/summary';
import { getDatabaseHealth } from './health/metrics';
import { performMaintenance } from './maintenance/tasks';

export type { QueryPerformanceMetrics, DatabaseHealthMetrics };

export class DatabaseOptimizationService {
  private static instance: DatabaseOptimizationService;
  private queryMetrics: QueryPerformanceMetrics[] = [];
  private slowQueryThreshold = 1000; // 1 second

  private constructor() {}

  public static getInstance(): DatabaseOptimizationService {
    if (!DatabaseOptimizationService.instance) {
      DatabaseOptimizationService.instance = new DatabaseOptimizationService();
    }
    return DatabaseOptimizationService.instance;
  }

  /**
   * Monitor query performance
   */
  async monitorQuery<T>(
    queryId: string,
    queryFn: () => Promise<T>,
    context: {
      filters?: Record<string, unknown>;
      options?: Record<string, unknown>;
    } = {}
  ): Promise<T> {
    return monitorQuery(
      queryId,
      queryFn,
      context,
      this.slowQueryThreshold,
      (metrics) => {
        this.queryMetrics = recordQueryMetrics(metrics, this.queryMetrics);
      }
    );
  }

  /**
   * Optimize card search query based on filters
   */
  buildOptimizedCardQuery(
    filters: CardSearchFilters,
    options: CardSearchOptions
  ) {
    return buildOptimizedCardQuery(filters, options);
  }

  /**
   * Analyze query performance and suggest optimizations
   */
  analyzeQueryPerformance(queryId: string): QueryAnalysisResult {
    return analyzeQueryPerformance(
      queryId,
      this.queryMetrics,
      this.slowQueryThreshold
    );
  }

  /**
   * Get database health metrics
   */
  async getDatabaseHealth(): Promise<DatabaseHealthMetrics> {
    return getDatabaseHealth(this.queryMetrics, this.slowQueryThreshold);
  }

  /**
   * Optimize database with maintenance tasks
   */
  async performMaintenance(): Promise<MaintenanceResult> {
    const { result, updatedMetrics } = await performMaintenance(
      this.queryMetrics
    );
    this.queryMetrics = updatedMetrics;
    return result;
  }

  /**
   * Get query performance summary
   */
  getPerformanceSummary(): PerformanceSummary {
    return getPerformanceSummary(this.queryMetrics, this.slowQueryThreshold);
  }
}
