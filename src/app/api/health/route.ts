/**
 * Health check endpoint — /api/health
 *
 * Public response (no auth):
 *   { status: "ok" | "error", database: "connected" | "error", rateLimit: "..." }
 *
 * Verbose response (?verbose=true + HEALTH_CHECK_TOKEN or admin session):
 *   Adds memory, uptime, version, environment, node version, db response time.
 *
 * Rate limiting note: the current implementation uses in-memory Maps and is
 * not safe for multi-instance deployments (e.g. Vercel serverless). Redis-backed
 * rate limiting is tracked in a separate issue.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const RATE_LIMIT_NOTE = 'in-memory-only-not-production-safe';

async function isVerboseAuthorized(request: NextRequest): Promise<boolean> {
  // Bearer token check — useful for uptime monitors and CI health checks
  const token = process.env.HEALTH_CHECK_TOKEN;
  if (token) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader === `Bearer ${token}`) return true;
  }

  // Admin session check
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string } | undefined)?.role === 'ADMIN';
}

export async function GET(request: NextRequest) {
  let dbStatus: 'connected' | 'error' = 'connected';
  let dbError: string | undefined;
  let dbResponseTime: number | undefined;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbResponseTime = Date.now() - dbStart;
  } catch (error) {
    dbStatus = 'error';
    dbError = error instanceof Error ? error.message : 'Connection failed';
    console.error('Health check — database error:', error);
  }

  const overall = dbStatus === 'connected' ? 'ok' : 'error';
  const statusCode = dbStatus === 'connected' ? 200 : 503;

  const verbose =
    request.nextUrl.searchParams.get('verbose') === 'true' &&
    (await isVerboseAuthorized(request));

  if (!verbose) {
    return NextResponse.json(
      { status: overall, database: dbStatus, rateLimit: RATE_LIMIT_NOTE },
      { status: statusCode }
    );
  }

  const memory = process.memoryUsage();
  return NextResponse.json(
    {
      status: overall,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version ?? '0.1.0',
      nodeVersion: process.version,
      uptime: Math.floor(process.uptime()),
      database: {
        status: dbStatus,
        ...(dbResponseTime !== undefined && {
          responseTime: `${dbResponseTime}ms`,
        }),
        ...(dbError && { error: dbError }),
      },
      rateLimit: RATE_LIMIT_NOTE,
      memory: {
        used: Math.round(memory.heapUsed / 1024 / 1024),
        total: Math.round(memory.heapTotal / 1024 / 1024),
        unit: 'MB',
      },
    },
    { status: statusCode }
  );
}
