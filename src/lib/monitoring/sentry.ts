/**
 * Sentry error tracking and performance monitoring configuration
 * Provides comprehensive error tracking, performance monitoring, and debugging
 */

import * as Sentry from '@sentry/nextjs';

// Sentry configuration
export const sentryConfig = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  beforeSend(event: Sentry.ErrorEvent) {
    // Filter out common non-critical errors
    if (event.exception) {
      const error = event.exception.values?.[0];

      // Skip client-side network errors
      if (error?.type === 'ChunkLoadError' ||
          error?.value?.includes('Loading chunk') ||
          error?.value?.includes('Network Error')) {
        return null;
      }

      // Skip common browser extension errors
      if (error?.value?.includes('Non-Error promise rejection captured') ||
          error?.value?.includes('ResizeObserver loop limit exceeded')) {
        return null;
      }
    }

    return event;
  },
} as Sentry.BrowserOptions;

// Initialize Sentry
export function initSentry() {
  if (process.env.SENTRY_DSN) {
    Sentry.init(sentryConfig);
  }
}

// Error tracking helpers
export const errorTracker = {
  // Capture exceptions with context
  captureException(error: Error, context?: Record<string, unknown>) {
    if (process.env.SENTRY_DSN) {
      Sentry.withScope((scope) => {
        if (context) {
          Object.entries(context).forEach(([key, value]) => {
            scope.setContext(key, value as Record<string, unknown>);
          });
        }
        Sentry.captureException(error);
      });
    } else {
      console.error('Error captured:', error, context);
    }
  },

  // Capture messages with different levels
  captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, unknown>) {
    if (process.env.SENTRY_DSN) {
      Sentry.withScope((scope) => {
        scope.setLevel(level);
        if (context) {
          Object.entries(context).forEach(([key, value]) => {
            scope.setContext(key, value as Record<string, unknown>);
          });
        }
        Sentry.captureMessage(message);
      });
    } else {
      console.warn(`[${level.toUpperCase()}] ${message}`, context);
    }
  },

  // Set user context
  setUser(user: { id: string; email?: string; username?: string }) {
    if (process.env.SENTRY_DSN) {
      Sentry.setUser(user);
    }
  },

  // Add breadcrumb for debugging
  addBreadcrumb(message: string, category: string, data?: Record<string, unknown>) {
    if (process.env.SENTRY_DSN) {
      Sentry.addBreadcrumb({
        message,
        category,
        data,
        level: 'info',
      });
    }
  },

  // Start a span for performance monitoring
  startSpan(name: string, operation: string) {
    if (process.env.SENTRY_DSN) {
      return Sentry.startInactiveSpan({ name, op: operation });
    }
    return null;
  },

  // Tag an operation
  setTag(key: string, value: string) {
    if (process.env.SENTRY_DSN) {
      Sentry.setTag(key, value);
    }
  },

  // Set context for additional debugging info
  setContext(key: string, context: Record<string, unknown>) {
    if (process.env.SENTRY_DSN) {
      Sentry.setContext(key, context);
    }
  },
};

// Database error tracking
export function trackDatabaseError(operation: string, error: Error, query?: string) {
  errorTracker.captureException(error, {
    database: {
      operation,
      query: query?.substring(0, 200), // Limit query length
      timestamp: new Date().toISOString(),
    },
  });
}

// API error tracking
export function trackAPIError(endpoint: string, method: string, error: Error, statusCode?: number) {
  errorTracker.captureException(error, {
    api: {
      endpoint,
      method,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  });
}

// Authentication error tracking
export function trackAuthError(action: string, error: Error, userId?: string) {
  errorTracker.captureException(error, {
    auth: {
      action,
      userId,
      timestamp: new Date().toISOString(),
    },
  });
}

// File upload error tracking
export function trackUploadError(fileName: string, fileSize: number, error: Error) {
  errorTracker.captureException(error, {
    upload: {
      fileName,
      fileSize,
      timestamp: new Date().toISOString(),
    },
  });
}

// Performance monitoring helpers
export const performanceMonitor = {
  // Track page load times
  trackPageLoad(page: string, loadTime: number) {
    errorTracker.addBreadcrumb(`Page loaded: ${page}`, 'navigation', { loadTime });

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
  trackAPICall(endpoint: string, method: string, duration: number, success: boolean) {
    errorTracker.addBreadcrumb(
      `API ${method} ${endpoint}`,
      'http',
      { duration, success, endpoint, method }
    );
  },

  // Track database query performance
  trackDatabaseQuery(operation: string, duration: number, recordCount?: number) {
    errorTracker.addBreadcrumb(
      `DB ${operation}`,
      'db',
      { duration, recordCount, operation }
    );
  },

  // Track user interactions
  trackUserAction(action: string, component: string, metadata?: Record<string, unknown>) {
    errorTracker.addBreadcrumb(
      `User ${action}`,
      'user',
      { action, component, ...metadata }
    );
  },
};

// Feature flag tracking
export function trackFeatureUsage(feature: string, enabled: boolean, userId?: string) {
  errorTracker.addBreadcrumb(
    `Feature ${feature} ${enabled ? 'enabled' : 'disabled'}`,
    'feature',
    { feature, enabled, userId }
  );
}

// Custom instrumentation
export function instrumentFunction<T extends (...args: unknown[]) => unknown>(
  fn: T,
  name: string,
  category: string = 'function'
): T {
  return ((...args: Parameters<T>) => {
    const start = Date.now();

    try {
      const result = fn(...args);

      // Handle promises
      if (result && typeof (result as { then?: unknown }).then === 'function') {
        return (result as Promise<unknown>)
          .then((value: unknown) => {
            performanceMonitor.trackAPICall(name, category, Date.now() - start, true);
            return value;
          })
          .catch((error: Error) => {
            performanceMonitor.trackAPICall(name, category, Date.now() - start, false);
            errorTracker.captureException(error, { function: name, category });
            throw error;
          });
      }

      performanceMonitor.trackAPICall(name, category, Date.now() - start, true);
      return result;
    } catch (error) {
      performanceMonitor.trackAPICall(name, category, Date.now() - start, false);
      errorTracker.captureException(error as Error, { function: name, category });
      throw error;
    }
  }) as T;
}