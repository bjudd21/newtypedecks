/**
 * Monitoring Health Check API
 * Provides status of monitoring services and system health
 */

import { NextRequest, NextResponse } from 'next/server';
import { monitoringHealthCheck } from '@/lib/monitoring';

export async function GET(_request: NextRequest) {
  try {
    const health = await monitoringHealthCheck();

    return NextResponse.json({
      status: 'success',
      data: health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'initialize') {
      const { initializeMonitoring } = await import('@/lib/monitoring');
      const success = await initializeMonitoring();

      return NextResponse.json({
        status: success ? 'success' : 'error',
        message: success
          ? 'Monitoring initialized'
          : 'Failed to initialize monitoring',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Monitoring action failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Action failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
