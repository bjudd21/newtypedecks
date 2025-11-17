/**
 * Analytics and metrics collection
 * Provides application performance metrics, user behavior tracking, and business metrics
 *
 * Re-exports from modularized structure for backward compatibility
 */

// Export types
export type {
  AnalyticsEvent,
  PerformanceMetric,
  UserMetric,
} from './analytics/types';

// Export classes
export { AnalyticsProvider, MetricsCollector } from './analytics/index';

// Export singleton instances
export {
  analytics,
  metricsCollector,
  businessMetrics,
} from './analytics/index';

// Export tracking functions
export {
  trackWebVitals,
  trackSession,
  initAnalytics,
} from './analytics/index';

// Default export
export { default } from './analytics/index';
