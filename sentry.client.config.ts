/**
 * Sentry client-side configuration.
 *
 * This file is loaded automatically by @sentry/nextjs for browser/client bundles.
 * It is a no-op when NEXT_PUBLIC_SENTRY_DSN is not set — safe to deploy without a
 * Sentry project configured. Add the DSN to your Vercel environment variables when
 * you are ready to enable error tracking.
 */

import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: process.env.NODE_ENV === 'development',
    // Session replay — 10% of sessions, 100% of sessions with errors
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.replayIntegration()],
  });
}
