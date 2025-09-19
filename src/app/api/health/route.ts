// Health check API endpoint
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: 'connected', // Will be updated when DB is connected
        redis: 'connected', // Will be updated when Redis is connected
      },
    };

    return NextResponse.json(health, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    );
  }
}
