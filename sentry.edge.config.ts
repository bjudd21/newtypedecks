/**
 * Sentry Edge runtime configuration.
 *
 * Loaded via instrumentation.ts when NEXT_RUNTIME === "edge".
 * No-op when NEXT_PUBLIC_SENTRY_DSN is not set.
 */

import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}
