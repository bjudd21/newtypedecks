/**
 * Search Analytics API
 *
 * Provides endpoints for search performance metrics, trends, and user behavior data
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchAnalytics } from '@/lib/services/searchAnalyticsService';
import { searchCache } from '@/lib/services/searchCacheService';
import { DatabaseOptimizationService } from '@/lib/services/databaseOptimizationService';

// GET /api/search/analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const timeframe = searchParams.get('timeframe') as 'day' | 'week' | 'month' || 'day';
    const userId = searchParams.get('userId');

    switch (type) {
      case 'overview':
        return await getOverviewData(timeframe);

      case 'performance':
        return await getPerformanceData(timeframe);

      case 'trends':
        return await getTrendsData(timeframe);

      case 'popular':
        return await getPopularSearches();

      case 'user':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID required for user analytics' },
            { status: 400 }
          );
        }
        return await getUserAnalytics(userId || undefined);

      case 'suggestions':
        return await getSearchSuggestions(userId || undefined);

      case 'cache':
        return await getCacheStats();

      case 'database':
        return await getDatabaseStats();

      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Search analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getOverviewData(timeframe: 'day' | 'week' | 'month') {
  const performanceMetrics = searchAnalytics.getPerformanceMetrics(timeframe);
  const cacheStats = searchCache.getStats();
  const dbOptimizer = DatabaseOptimizationService.getInstance();
  const dbPerformance = dbOptimizer.getPerformanceSummary();

  return NextResponse.json({
    timeframe,
    performance: {
      totalSearches: performanceMetrics.totalSearches,
      avgResponseTime: performanceMetrics.avgResponseTime,
      medianResponseTime: performanceMetrics.medianResponseTime,
      p95ResponseTime: performanceMetrics.p95ResponseTime
    },
    cache: {
      hitRate: cacheStats.hitRate,
      totalEntries: cacheStats.totalEntries,
      totalSize: Math.round(cacheStats.totalSize / 1024 / 1024 * 100) / 100, // MB
      avgResponseTime: cacheStats.avgResponseTime
    },
    database: {
      totalQueries: dbPerformance.totalQueries,
      avgQueryTime: dbPerformance.averageTime,
      slowQueries: dbPerformance.slowQueries
    },
    popularFilters: performanceMetrics.popularFilters
  });
}

async function getPerformanceData(timeframe: 'day' | 'week' | 'month') {
  const metrics = searchAnalytics.getPerformanceMetrics(timeframe);

  return NextResponse.json({
    timeframe,
    totalSearches: metrics.totalSearches,
    avgResponseTime: metrics.avgResponseTime,
    medianResponseTime: metrics.medianResponseTime,
    p95ResponseTime: metrics.p95ResponseTime,
    slowQueries: metrics.slowQueries.map(q => ({
      filters: q.filters,
      responseTime: q.responseTime,
      resultCount: q.resultCount,
      timestamp: q.timestamp
    })),
    popularFilters: Object.entries(metrics.popularFilters)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([filter, count]) => ({ filter, count })),
    searchVolume: metrics.searchVolume
  });
}

async function getTrendsData(timeframe: 'day' | 'week' | 'month') {
  const trends = searchAnalytics.getSearchTrends(
    timeframe === 'day' ? 'hour' :
    timeframe === 'week' ? 'day' : 'week'
  );

  return NextResponse.json({
    timeframe: trends.timeframe,
    data: trends.data.map(point => ({
      timestamp: point.timestamp,
      searchCount: point.searchCount,
      uniqueUsers: point.uniqueUsers,
      avgResponseTime: Math.round(point.avgResponseTime * 100) / 100,
      popularFilters: Object.entries(point.popularFilters)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([filter, count]) => ({ filter, count }))
    }))
  });
}

async function getPopularSearches() {
  const popular = searchAnalytics.getPopularSearches(20);

  return NextResponse.json({
    searches: popular.map(search => ({
      query: search.query,
      popularity: search.popularity,
      trendScore: Math.round(search.trendScore * 100) / 100,
      lastQueried: search.lastQueried,
      filters: search.filters
    }))
  });
}

async function getUserAnalytics(userId?: string) {
  if (!userId) {
    return NextResponse.json({
      message: 'User ID is required'
    }, { status: 400 });
  }

  const userBehavior = searchAnalytics.getUserBehavior(userId);

  if (!userBehavior) {
    return NextResponse.json({
      message: 'No analytics data found for this user'
    });
  }

  return NextResponse.json({
    userId: userBehavior.userId,
    totalSearches: userBehavior.totalSearches,
    avgSearchesPerSession: Math.round(userBehavior.avgSearchesPerSession * 100) / 100,
    searchFrequency: userBehavior.searchFrequency,
    avgResponseTime: Math.round(userBehavior.avgResponseTime * 100) / 100,
    mostActiveTimeOfDay: userBehavior.mostActiveTimeOfDay,
    preferredSortOrder: userBehavior.preferredSortOrder,
    deviceType: userBehavior.deviceType,
    topFilters: Object.entries(userBehavior.preferredFilters)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([filter, count]) => ({ filter, count, percentage: Math.round((count / userBehavior.totalSearches) * 100) }))
  });
}

async function getSearchSuggestions(userId?: string) {
  const suggestions = searchAnalytics.generateSearchSuggestions(userId || undefined);

  return NextResponse.json({
    suggestions: suggestions.map(suggestion => ({
      type: suggestion.type,
      label: suggestion.label,
      filters: suggestion.filters,
      confidence: Math.round(suggestion.confidence * 100) / 100
    }))
  });
}

async function getCacheStats() {
  const stats = searchCache.getStats();

  return NextResponse.json({
    totalEntries: stats.totalEntries,
    totalSize: Math.round(stats.totalSize / 1024 / 1024 * 100) / 100, // MB
    hitRate: Math.round(stats.hitRate * 100) / 100,
    totalHits: stats.totalHits,
    totalMisses: stats.totalMisses,
    avgResponseTime: Math.round(stats.avgResponseTime * 100) / 100,
    oldestEntry: new Date(stats.oldestEntry),
    newestEntry: new Date(stats.newestEntry)
  });
}

async function getDatabaseStats() {
  const dbOptimizer = DatabaseOptimizationService.getInstance();
  const performance = dbOptimizer.getPerformanceSummary();
  const health = await dbOptimizer.getDatabaseHealth();

  return NextResponse.json({
    performance: {
      totalQueries: performance.totalQueries,
      avgTime: Math.round(performance.averageTime * 100) / 100,
      slowQueries: performance.slowQueries,
      topSlowQueries: performance.topSlowQueries.map(q => ({
        queryId: q.queryId,
        duration: q.duration,
        timestamp: q.timestamp,
        resultCount: q.resultCount
      }))
    },
    health: {
      connectionCount: health.connectionCount,
      slowQueriesCount: health.slowQueries.length,
      indexUsage: health.indexUsage,
      tableStats: health.tableStats
    }
  });
}

// POST /api/search/analytics - Clear cache or perform maintenance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'clearCache':
        await searchCache.clear();
        return NextResponse.json({ message: 'Cache cleared successfully' });

      case 'cleanupCache':
        const removedCount = await searchCache.cleanup();
        return NextResponse.json({
          message: `Removed ${removedCount} expired entries`
        });

      case 'performMaintenance':
        const dbOptimizer = DatabaseOptimizationService.getInstance();
        const maintenanceResult = await dbOptimizer.performMaintenance();
        return NextResponse.json({
          success: maintenanceResult.success,
          tasksPerformed: maintenanceResult.tasksPerformed,
          errors: maintenanceResult.errors
        });

      case 'preloadCache':
        await searchCache.preloadPopularSearches();
        return NextResponse.json({ message: 'Cache preloaded successfully' });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Search analytics POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}