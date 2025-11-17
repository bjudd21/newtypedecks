/**
 * Middleware module exports
 */

// Export types
export type {
  MonitoringContext,
  RateLimitConfig,
  NextRequestWithMonitoring,
} from './types';

// Export main middleware
export { createMonitoringMiddleware } from './monitoringMiddleware';

// Export wrapper function
export { withMonitoring } from './withMonitoring';

// Export monitoring wrappers
export { monitorDatabaseQuery } from './databaseMonitor';
export { monitorAuth } from './authMonitor';
export { monitorFileUpload } from './uploadMonitor';

// Export rate limiter
export { createRateLimitMonitor } from './rateLimiter';

// Export health check
export { monitorHealthCheck } from './healthCheck';

// Import for default export
import { withMonitoring } from './withMonitoring';
import { monitorDatabaseQuery } from './databaseMonitor';
import { monitorAuth } from './authMonitor';
import { monitorFileUpload } from './uploadMonitor';
import { createRateLimitMonitor } from './rateLimiter';
import { monitorHealthCheck } from './healthCheck';

// Default export
export default {
  withMonitoring,
  monitorDatabaseQuery,
  monitorAuth,
  monitorFileUpload,
  createRateLimitMonitor,
  monitorHealthCheck,
};
