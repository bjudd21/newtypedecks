/**
 * Analytics module exports
 */

// Export types
export type {
  AnalyticsEvent,
  PerformanceMetric,
  UserMetric,
} from './types';

// Export classes
export { AnalyticsProvider } from './AnalyticsProvider';
export { MetricsCollector } from './MetricsCollector';

// Create singleton instances
import { AnalyticsProvider } from './AnalyticsProvider';
import { MetricsCollector } from './MetricsCollector';
import { createBusinessMetrics } from './businessMetrics';
import { createWebVitalsTracker } from './webVitals';
import { createSessionTracker } from './sessionTracking';

// Create analytics instance
export const analytics = new AnalyticsProvider();

// Create metrics collector instance
export const metricsCollector = new MetricsCollector(analytics);

// Create business metrics
export const businessMetrics = createBusinessMetrics(
  analytics,
  metricsCollector
);

// Create tracking functions
export const trackWebVitals = createWebVitalsTracker(
  analytics,
  metricsCollector
);

export const trackSession = createSessionTracker(analytics);

// Initialize analytics
export function initAnalytics() {
  if (typeof window !== 'undefined') {
    trackWebVitals();
    trackSession();
  }
}

// Default export
export default analytics;
