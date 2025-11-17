/**
 * Error tracking helpers
 */

import * as Sentry from '@sentry/nextjs';

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
  captureMessage(
    message: string,
    level: Sentry.SeverityLevel = 'info',
    context?: Record<string, unknown>
  ) {
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
  addBreadcrumb(
    message: string,
    category: string,
    data?: Record<string, unknown>
  ) {
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
