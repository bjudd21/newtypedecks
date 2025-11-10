/**
 * Database Optimization Service
 *
 * Handles query optimization, performance monitoring, and database health checks
 */

import type { CardSearchFilters, CardSearchOptions } from '@/lib/types/card';

export interface QueryPerformanceMetrics {
  queryId: string;
  sql: string;
  duration: number;
  timestamp: Date;
  resultCount: number;
  filters: Record<string, unknown>;
  options: Record<string, unknown>;
}

export interface DatabaseHealthMetrics {
  connectionCount: number;
  slowQueries: QueryPerformanceMetrics[];
  indexUsage: Array<{
    tableName: string;
    indexName: string;
    scans: number;
    lookups: number;
    efficiency: number;
  }>;
  tableStats: Array<{
    tableName: string;
    rowCount: number;
    size: string;
    lastAnalyzed: Date;
  }>;
}

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

      this.recordQueryMetrics(metrics);

      // Log slow queries
      if (duration > this.slowQueryThreshold) {
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

  /**
   * Optimize card search query based on filters
   */
  buildOptimizedCardQuery(
    filters: CardSearchFilters,
    options: CardSearchOptions
  ) {
    const where: Record<string, unknown> = {};
    const orderBy: unknown[] = [];

    // Build efficient where clause
    if (filters.name) {
      // Use case-insensitive search with index
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters.pilot) {
      where.pilot = {
        contains: filters.pilot,
        mode: 'insensitive',
      };
    }

    if (filters.model) {
      where.model = {
        contains: filters.model,
        mode: 'insensitive',
      };
    }

    // Categorical filters (use indexes)
    if (filters.typeId) where.typeId = filters.typeId;
    if (filters.rarityId) where.rarityId = filters.rarityId;
    if (filters.setId) where.setId = filters.setId;
    if (filters.faction) where.faction = filters.faction;
    if (filters.series) where.series = filters.series;
    if (filters.nation) where.nation = filters.nation;
    if (filters.language) where.language = filters.language;

    // Boolean filters
    if (filters.isFoil !== undefined) where.isFoil = filters.isFoil;
    if (filters.isPromo !== undefined) where.isPromo = filters.isPromo;
    if (filters.isAlternate !== undefined)
      where.isAlternate = filters.isAlternate;

    // Range filters (use indexes)
    if (filters.levelMin !== undefined || filters.levelMax !== undefined) {
      where.level = {} as { gte?: number; lte?: number };
      if (filters.levelMin !== undefined)
        (where.level as { gte?: number; lte?: number }).gte = filters.levelMin;
      if (filters.levelMax !== undefined)
        (where.level as { gte?: number; lte?: number }).lte = filters.levelMax;
    }

    if (filters.costMin !== undefined || filters.costMax !== undefined) {
      where.cost = {} as { gte?: number; lte?: number };
      if (filters.costMin !== undefined)
        (where.cost as { gte?: number; lte?: number }).gte = filters.costMin;
      if (filters.costMax !== undefined)
        (where.cost as { gte?: number; lte?: number }).lte = filters.costMax;
    }

    if (
      filters.clashPointsMin !== undefined ||
      filters.clashPointsMax !== undefined
    ) {
      where.clashPoints = {} as { gte?: number; lte?: number };
      if (filters.clashPointsMin !== undefined)
        (where.clashPoints as { gte?: number; lte?: number }).gte =
          filters.clashPointsMin;
      if (filters.clashPointsMax !== undefined)
        (where.clashPoints as { gte?: number; lte?: number }).lte =
          filters.clashPointsMax;
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      where.price = {} as { gte?: number; lte?: number };
      if (filters.priceMin !== undefined)
        (where.price as { gte?: number; lte?: number }).gte = filters.priceMin;
      if (filters.priceMax !== undefined)
        (where.price as { gte?: number; lte?: number }).lte = filters.priceMax;
    }

    if (
      filters.hitPointsMin !== undefined ||
      filters.hitPointsMax !== undefined
    ) {
      where.hitPoints = {} as { gte?: number; lte?: number };
      if (filters.hitPointsMin !== undefined)
        (where.hitPoints as { gte?: number; lte?: number }).gte =
          filters.hitPointsMin;
      if (filters.hitPointsMax !== undefined)
        (where.hitPoints as { gte?: number; lte?: number }).lte =
          filters.hitPointsMax;
    }

    if (
      filters.attackPointsMin !== undefined ||
      filters.attackPointsMax !== undefined
    ) {
      where.attackPoints = {} as { gte?: number; lte?: number };
      if (filters.attackPointsMin !== undefined)
        (where.attackPoints as { gte?: number; lte?: number }).gte =
          filters.attackPointsMin;
      if (filters.attackPointsMax !== undefined)
        (where.attackPoints as { gte?: number; lte?: number }).lte =
          filters.attackPointsMax;
    }

    // Array filters
    if (filters.keywords && filters.keywords.length > 0) {
      where.keywords = {
        hasEvery: filters.keywords,
      };
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        hasEvery: filters.tags,
      };
    }

    // Build optimized order by
    const sortBy = options.sortBy || 'name';
    const sortOrder = options.sortOrder || 'asc';

    // Use compound indexes for better performance
    if (sortBy === 'name') {
      orderBy.push({ name: sortOrder });
      if (sortOrder === 'asc') {
        orderBy.push({ createdAt: 'desc' }); // Secondary sort for consistency
      }
    } else if (sortBy === 'level') {
      orderBy.push({ level: sortOrder });
      orderBy.push({ name: 'asc' }); // Secondary sort
    } else if (sortBy === 'cost') {
      orderBy.push({ cost: sortOrder });
      orderBy.push({ name: 'asc' });
    } else if (sortBy === 'clashPoints') {
      orderBy.push({ clashPoints: sortOrder });
      orderBy.push({ name: 'asc' });
    } else if (sortBy === 'createdAt') {
      orderBy.push({ createdAt: sortOrder });
      orderBy.push({ name: 'asc' });
    } else {
      // Default sort
      orderBy.push({ [sortBy]: sortOrder });
      orderBy.push({ name: 'asc' });
    }

    return { where, orderBy };
  }

  /**
   * Analyze query performance and suggest optimizations
   */
  analyzeQueryPerformance(queryId: string): {
    averageTime: number;
    slowQueryCount: number;
    suggestions: string[];
  } {
    const queries = this.queryMetrics.filter((m) => m.queryId === queryId);

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
      (q) => q.duration > this.slowQueryThreshold
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
    const commonFilters = this.analyzeCommonFilters(queries);
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

  /**
   * Get database health metrics
   */
  async getDatabaseHealth(): Promise<DatabaseHealthMetrics> {
    try {
      // Get slow queries from recent metrics
      const recentDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours
      const slowQueries = this.queryMetrics.filter(
        (m) => m.timestamp > recentDate && m.duration > this.slowQueryThreshold
      );

      // For a full implementation, you would query actual database statistics
      // This is a simplified version for demonstration
      return {
        connectionCount: 10, // Would query actual connection pool
        slowQueries: slowQueries.slice(0, 10), // Top 10 slow queries
        indexUsage: [], // Would analyze actual index usage stats
        tableStats: [], // Would query table statistics
      };
    } catch (error) {
      console.error('Failed to get database health metrics:', error);
      throw error;
    }
  }

  /**
   * Optimize database with maintenance tasks
   */
  async performMaintenance(): Promise<{
    success: boolean;
    tasksPerformed: string[];
    errors: string[];
  }> {
    const tasksPerformed: string[] = [];
    const errors: string[] = [];

    try {
      // In a real implementation, you might run ANALYZE, VACUUM, etc.
      // For PostgreSQL via Prisma, we can't directly run these commands
      // but we can suggest them or implement them via raw queries

      // Clear old query metrics
      const oldMetrics = this.queryMetrics.filter(
        (m) => Date.now() - m.timestamp.getTime() > 7 * 24 * 60 * 60 * 1000
      );

      this.queryMetrics = this.queryMetrics.filter(
        (m) => Date.now() - m.timestamp.getTime() <= 7 * 24 * 60 * 60 * 1000
      );

      if (oldMetrics.length > 0) {
        tasksPerformed.push(`Cleared ${oldMetrics.length} old query metrics`);
      }

      // Log maintenance suggestions
      console.warn('Database maintenance suggestions:');
      console.warn('- Run ANALYZE on frequently queried tables');
      console.warn('- Consider VACUUM FULL during low-traffic periods');
      console.warn('- Monitor index usage and remove unused indexes');

      tasksPerformed.push('Generated maintenance recommendations');

      return {
        success: true,
        tasksPerformed,
        errors,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMsg);
      return {
        success: false,
        tasksPerformed,
        errors,
      };
    }
  }

  /**
   * Record query metrics
   */
  private recordQueryMetrics(metrics: QueryPerformanceMetrics) {
    this.queryMetrics.push(metrics);

    // Keep only recent metrics (last 7 days)
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    this.queryMetrics = this.queryMetrics.filter(
      (m) => m.timestamp.getTime() > cutoff
    );
  }

  /**
   * Analyze common filter combinations
   */
  private analyzeCommonFilters(queries: QueryPerformanceMetrics[]): string[] {
    const filterCombinations: Map<string, number> = new Map();

    queries.forEach((query) => {
      const filters = Object.keys(query.filters || {})
        .filter(
          (key) =>
            query.filters[key] !== undefined && query.filters[key] !== null
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

  /**
   * Get query performance summary
   */
  getPerformanceSummary(): {
    totalQueries: number;
    averageTime: number;
    slowQueries: number;
    topSlowQueries: QueryPerformanceMetrics[];
  } {
    const total = this.queryMetrics.length;
    const averageTime =
      total > 0
        ? this.queryMetrics.reduce((sum, q) => sum + q.duration, 0) / total
        : 0;

    const slowQueries = this.queryMetrics.filter(
      (q) => q.duration > this.slowQueryThreshold
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
}
