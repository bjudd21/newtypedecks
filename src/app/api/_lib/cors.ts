/**
 * CORS utility for API routes.
 *
 * Currently allows all origins (*) for development and cross-origin client access.
 *
 * TODO: Before production deployment, set the CORS_ORIGINS environment variable
 * to the production domain (e.g. CORS_ORIGINS=https://newtypedecks.com) so that
 * Access-Control-Allow-Origin is locked to your domain instead of *.
 * The corsOrigins export in src/lib/config/environment.ts is read here.
 */

import { NextResponse } from 'next/server';
import { corsOrigins } from '@/lib/config/environment';

// Resolve the allowed origin: use the first configured origin, or '*' if it
// contains a wildcard. A single value is required by the CORS spec.
const allowedOrigin =
  corsOrigins.includes('*') || corsOrigins.length === 0 ? '*' : corsOrigins[0];

export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

/**
 * Returns a 200 response for CORS preflight (OPTIONS) requests.
 * Export an OPTIONS handler from any route that needs it:
 *
 *   export { corsPreflightResponse as OPTIONS } from '@/app/api/_lib/cors';
 */
export function corsPreflightResponse(): NextResponse {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

/**
 * Adds CORS headers to an existing NextResponse.
 */
export function withCors(response: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
