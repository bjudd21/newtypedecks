/**
 * Sentry error tracking and performance monitoring configuration
 * Provides comprehensive error tracking, performance monitoring, and debugging
 *
 * Re-exports from modularized structure for backward compatibility
 */

// Export configuration
export { sentryConfig, initSentry } from './sentry/config';

// Export error tracker
export { errorTracker } from './sentry/errorTracker';

// Export domain-specific trackers
export {
  trackDatabaseError,
  trackAPIError,
  trackAuthError,
  trackUploadError,
} from './sentry/domainTrackers';

// Export performance monitor
export { performanceMonitor } from './sentry/performanceMonitor';

// Export feature tracking
export { trackFeatureUsage } from './sentry/featureTracking';

// Export instrumentation
export { instrumentFunction } from './sentry/instrumentation';
