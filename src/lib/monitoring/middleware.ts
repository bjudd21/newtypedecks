/**
 * Monitoring middleware for tracking API requests, performance, and errors
 * Automatically instruments Next.js API routes with comprehensive monitoring
 *
 * Re-exports from modularized structure for backward compatibility
 */

// Export types
export type {
  MonitoringContext,
  RateLimitConfig,
  NextRequestWithMonitoring,
} from './middleware/types';

// Export main middleware
export { createMonitoringMiddleware } from './middleware/monitoringMiddleware';

// Export wrapper function
export { withMonitoring } from './middleware/withMonitoring';

// Export monitoring wrappers
export { monitorDatabaseQuery } from './middleware/databaseMonitor';
export { monitorAuth } from './middleware/authMonitor';
export { monitorFileUpload } from './middleware/uploadMonitor';

// Export rate limiter
export { createRateLimitMonitor } from './middleware/rateLimiter';

// Export health check
export { monitorHealthCheck } from './middleware/healthCheck';

// Default export
export { default } from './middleware/index';
