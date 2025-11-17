/**
 * API route handler wrapper with monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { createMonitoringMiddleware } from './monitoringMiddleware';
import type { NextRequestWithMonitoring } from './types';

// Wrap API route handler with monitoring
export function withMonitoring<T extends unknown[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
) {
  const middleware = createMonitoringMiddleware();

  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    return middleware(req, async (request, context) => {
      // Set monitoring context for the handler
      (request as NextRequestWithMonitoring).monitoring = context;
      return handler(request, ...args);
    });
  };
}
