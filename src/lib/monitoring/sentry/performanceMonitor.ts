/**
 * Performance monitoring helpers
 */

import * as Sentry from '@sentry/nextjs';
import { errorTracker } from './errorTracker';

// Performance monitoring helpers
export const performanceMonitor = {
  // Track page load times
  trackPageLoad(page: string, loadTime: number) {
    errorTracker.addBreadcrumb(`Page loaded: ${page}`, 'navigation', {
      loadTime,
    });

    if (process.env.SENTRY_DSN) {
      Sentry.addBreadcrumb({
        message: `Page loaded: ${page}`,
        category: 'performance',
        data: { loadTime, page },
        level: 'info',
      });
    }
  },

  // Track API response times
  trackAPICall(
    endpoint: string,
    method: string,
    duration: number,
    success: boolean
  ) {
    errorTracker.addBreadcrumb(`API ${method} ${endpoint}`, 'http', {
      duration,
      success,
      endpoint,
      method,
    });
  },

  // Track database query performance
  trackDatabaseQuery(
    operation: string,
    duration: number,
    recordCount?: number
  ) {
    errorTracker.addBreadcrumb(`DB ${operation}`, 'db', {
      duration,
      recordCount,
      operation,
    });
  },

  // Track user interactions
  trackUserAction(
    action: string,
    component: string,
    metadata?: Record<string, unknown>
  ) {
    errorTracker.addBreadcrumb(`User ${action}`, 'user', {
      action,
      component,
      ...metadata,
    });
  },
};
