/**
 * Sentry configuration
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
      if (
        error?.type === 'ChunkLoadError' ||
        error?.value?.includes('Loading chunk') ||
        error?.value?.includes('Network Error')
      ) {
        return null;
      }

      // Skip common browser extension errors
      if (
        error?.value?.includes('Non-Error promise rejection captured') ||
        error?.value?.includes('ResizeObserver loop limit exceeded')
      ) {
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
