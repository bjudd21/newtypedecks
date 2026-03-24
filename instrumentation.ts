/**
 * Next.js instrumentation hook.
 *
 * Bootstraps Sentry for server-side and edge runtimes. The client-side config
 * is loaded automatically by @sentry/nextjs from sentry.client.config.ts.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
