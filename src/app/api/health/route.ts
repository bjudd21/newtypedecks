// Enhanced health check API endpoint for production monitoring
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(_request: NextRequest) {
  try {
    // Check database connectivity
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - dbStart;

    // Get system information
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '0.1.0',
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
      services: {
        database: {
          status: 'connected',
          responseTime: `${dbResponseTime}ms`,
        },
        nextjs: {
          status: 'running',
          version: process.version,
        },
      },
      checks: {
        database: true,
        memory: process.memoryUsage().heapUsed < 500 * 1024 * 1024, // Less than 500MB
        uptime: process.uptime() > 0,
      },
    };

    // Determine overall health status
    const allChecksPass = Object.values(healthData.checks).every(check => check === true);
    healthData.status = allChecksPass ? 'healthy' : 'degraded';

    const statusCode = allChecksPass ? 200 : 503;
    return NextResponse.json(healthData, { status: statusCode });

  } catch (error) {
    console.error('Health check failed:', error);

    const errorData = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      error: error instanceof Error ? error.message : 'Unknown error',
      uptime: Math.floor(process.uptime()),
      services: {
        database: {
          status: 'disconnected',
          error: error instanceof Error ? error.message : 'Connection failed',
        },
        nextjs: {
          status: 'running',
          version: process.version,
        },
      },
      checks: {
        database: false,
        memory: true,
        uptime: process.uptime() > 0,
      },
    };

    return NextResponse.json(errorData, { status: 503 });
  }
}
