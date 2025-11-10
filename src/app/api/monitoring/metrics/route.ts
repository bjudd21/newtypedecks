import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { metricsCollector } from '@/lib/monitoring/analytics';
import { performanceMonitor } from '@/lib/monitoring/performance';
import { logger } from '@/lib/monitoring/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '1h'; // 1h, 24h, 7d, 30d
    const category = searchParams.get('category'); // performance, errors, business

    // Calculate time window
    const timeWindows = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    const timeWindow = timeWindows[timeRange as keyof typeof timeWindows] || timeWindows['1h'];
    const since = new Date(Date.now() - timeWindow);

    const metrics: any = {};

    // Performance metrics
    if (!category || category === 'performance') {
      metrics.performance = {
        responseTime: performanceMonitor.getStats('api'),
        databaseQueries: performanceMonitor.getStats('database'),
        pageLoads: performanceMonitor.getStats('page'),
        resourceUsage: performanceMonitor.getResourceUsage(),
        webVitals: {
          lcp: metricsCollector.getMetricsSummary('web_vital_lcp'),
          fid: metricsCollector.getMetricsSummary('web_vital_fid'),
          cls: metricsCollector.getMetricsSummary('web_vital_cls'),
          fcp: metricsCollector.getMetricsSummary('web_vital_fcp'),
          ttfb: metricsCollector.getMetricsSummary('web_vital_ttfb'),
        },
      };
    }

    // Business metrics from database
    if (!category || category === 'business') {
      const [
        totalUsers,
        activeUsers,
        totalDecks,
        totalCards,
        totalCollections,
        recentRegistrations,
        recentLogins,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            updatedAt: {
              gte: since,
            },
          },
        }),
        prisma.deck.count(),
        prisma.card.count(),
        prisma.collection.count(),
        prisma.user.count({
          where: {
            createdAt: {
              gte: since,
            },
          },
        }),
        prisma.session.count(),
      ]);

      metrics.business = {
        users: {
          total: totalUsers,
          active: activeUsers,
          newRegistrations: recentRegistrations,
        },
        content: {
          totalDecks,
          totalCards,
          totalCollections,
        },
        engagement: {
          recentLogins,
          cardViews: metricsCollector.getMetricsSummary('card_views'),
          deckShares: metricsCollector.getMetricsSummary('deck_shares'),
          searchQueries: metricsCollector.getMetricsSummary('search_results'),
        },
      };
    }

    // Error metrics
    if (!category || category === 'errors') {
      metrics.errors = {
        total: metricsCollector.getMetricsSummary('error_count'),
        byType: {
          api: performanceMonitor.getStats('api')?.recent?.filter(e => e.metadata?.error)?.length || 0,
          database: performanceMonitor.getStats('database')?.recent?.filter(e => e.metadata?.error)?.length || 0,
        },
      };
    }

    // System health
    if (!category || category === 'health') {
      // Test database connectivity
      const dbHealthStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const dbResponseTime = Date.now() - dbHealthStart;

      metrics.health = {
        database: {
          status: 'connected',
          responseTime: dbResponseTime,
        },
        application: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.env.npm_package_version || '0.1.0',
        },
        environment: process.env.NODE_ENV,
      };
    }

    return NextResponse.json({
      status: 'success',
      timeRange,
      timestamp: new Date().toISOString(),
      metrics,
    });

  } catch (error) {
    logger.error('Failed to fetch monitoring metrics', error as Error, {
      action: 'monitoring_metrics_fetch',
    });

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch metrics',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}