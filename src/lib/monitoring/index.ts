/**
 * Monitoring and observability exports
 * Central export point for all monitoring functionality
 */

// Core monitoring services
export { initSentry, errorTracker, performanceMonitor as sentryPerformance } from './sentry';
export { analytics, businessMetrics, metricsCollector, initAnalytics, trackWebVitals } from './analytics';
export { logger, createRequestLogger, createComponentLogger, domainLoggers } from './logger';
export { performanceMonitor, measureAPI, measureDB, measureComponent, measureUserAction } from './performance';

// Middleware and utilities
export {
  withMonitoring,
  monitorDatabaseQuery,
  monitorAuth,
  monitorFileUpload,
  createRateLimitMonitor,
  monitorHealthCheck,
} from './middleware';

// React hooks
export {
  useMonitoring,
  usePageMonitoring,
  useAPIMonitoring,
} from '../../hooks/useMonitoring';

// React components
export { MonitoringProvider, MonitoringErrorBoundary } from '../../components/monitoring/MonitoringProvider';

// Types
export type { LogLevel, LogEntry } from './logger';
export type { PerformanceEntry, ResourceUsage } from './performance';
export type { AnalyticsEvent, PerformanceMetric, UserMetric } from './analytics';
export type { MonitoringContext } from './middleware';

// Import LogLevel for type checking
import type { LogLevel } from './logger';

// Default monitoring configuration
export const defaultMonitoringConfig = {
  enableSentry: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  enableAnalytics: !!(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || process.env.NEXT_PUBLIC_MIXPANEL_TOKEN),
  enablePerformanceMonitoring: true,
  enableLogging: true,
  logLevel: (process.env.LOG_LEVEL as LogLevel) || ('info' as LogLevel),
  environment: process.env.NODE_ENV || 'development',
};

// Initialize all monitoring services
export async function initializeMonitoring() {
  const { logger } = await import('./logger');

  try {
    logger.info('Initializing monitoring services...');

    // Initialize Sentry
    if (defaultMonitoringConfig.enableSentry) {
      const { initSentry } = await import('./sentry');
      initSentry();
      logger.info('Sentry initialized');
    }

    // Initialize Analytics
    if (defaultMonitoringConfig.enableAnalytics) {
      const { initAnalytics } = await import('./analytics');
      initAnalytics();
      logger.info('Analytics initialized');
    }

    // Initialize Performance Monitoring
    if (defaultMonitoringConfig.enablePerformanceMonitoring) {
      const { trackWebVitals } = await import('./analytics');
      trackWebVitals();
      logger.info('Performance monitoring initialized');
    }

    logger.info('All monitoring services initialized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize monitoring services', error as Error);
    return false;
  }
}

// Monitoring health check
export async function monitoringHealthCheck() {
  const { logger } = await import('./logger');
  const { performanceMonitor } = await import('./performance');

  const health = {
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    services: {
      sentry: defaultMonitoringConfig.enableSentry,
      analytics: defaultMonitoringConfig.enableAnalytics,
      performance: defaultMonitoringConfig.enablePerformanceMonitoring,
      logging: defaultMonitoringConfig.enableLogging,
    },
    metrics: {
      apiCalls: performanceMonitor.getStats('api'),
      databaseQueries: performanceMonitor.getStats('database'),
      pageLoads: performanceMonitor.getStats('page'),
      resourceUsage: performanceMonitor.getResourceUsage(),
    },
    timestamp: new Date().toISOString(),
  };

  logger.info('Monitoring health check completed', {
    action: 'monitoring_health_check',
    context: health,
  });

  return health;
}

export default {
  initializeMonitoring,
  monitoringHealthCheck,
  defaultMonitoringConfig,
};