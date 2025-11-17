/**
 * Sentry module exports
 */

// Export configuration
export { sentryConfig, initSentry } from './config';

// Export error tracker
export { errorTracker } from './errorTracker';

// Export domain-specific trackers
export {
  trackDatabaseError,
  trackAPIError,
  trackAuthError,
  trackUploadError,
} from './domainTrackers';

// Export performance monitor
export { performanceMonitor } from './performanceMonitor';

// Export feature tracking
export { trackFeatureUsage } from './featureTracking';

// Export instrumentation
export { instrumentFunction } from './instrumentation';
