/**
 * Main monitoring middleware
 * Comprehensive request tracking and error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { errorTracker } from '../sentry';
import { businessMetrics } from '../analytics';
import { createRequestLogger } from '../logger';
import { measureAPI } from '../performance';
import type { MonitoringContext } from './types';
import { generateRequestId, extractUserId } from './helpers';

// Create monitoring middleware
export function createMonitoringMiddleware() {
  return async function monitoringMiddleware(
    request: NextRequest,
    handler: (
      req: NextRequest,
      context: MonitoringContext
    ) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const startTime = Date.now();
    const requestId = generateRequestId();
    const userId = await extractUserId(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const context: MonitoringContext = {
      requestId,
      userId,
      userAgent,
      ip,
      startTime,
    };

    const requestLogger = createRequestLogger(requestId, userId, 'API');
    const method = request.method;
    const url = new URL(request.url);
    const endpoint = url.pathname;

    // Log request start
    requestLogger.info(`${method} ${endpoint} started`, {
      context: {
        userAgent,
        ip,
        query: Object.fromEntries(url.searchParams),
      },
    });

    // Add breadcrumb for debugging
    errorTracker.addBreadcrumb(`API Request: ${method} ${endpoint}`, 'http', {
      requestId,
      userId,
      ip,
    });

    let response: NextResponse | undefined;
    let statusCode = 500;
    let success = false;

    try {
      // Execute the handler with performance monitoring
      response = await measureAPI(
        `${method} ${endpoint}`,
        () => handler(request, context),
        { requestId, userId, endpoint, method }
      );

      statusCode = response.status;
      success = statusCode < 400;

      return response;
    } catch (error) {
      // Handle errors
      statusCode = 500;
      success = false;

      requestLogger.error(`${method} ${endpoint} failed`, error as Error, {
        context: { statusCode, duration: Date.now() - startTime },
      });

      errorTracker.captureException(error as Error, {
        api: {
          method,
          endpoint,
          requestId,
          userId,
          statusCode,
          duration: Date.now() - startTime,
        },
      });

      // Return error response
      response = NextResponse.json(
        {
          error: 'Internal Server Error',
          requestId,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );

      return response;
    } finally {
      const duration = Date.now() - startTime;

      // Log request completion
      requestLogger.apiLog(method, endpoint, statusCode, duration, {
        context: {
          success,
          responseSize: response?.headers.get('content-length') || 0,
        },
      });

      // Track business metrics and performance
      businessMetrics.trackAPIResponse(endpoint, method, duration, success);

      // Set response headers with monitoring data
      if (response) {
        response.headers.set('X-Request-ID', requestId);
        response.headers.set('X-Response-Time', `${duration}ms`);

        if (process.env.NODE_ENV === 'development') {
          response.headers.set('X-Debug-Duration', `${duration}ms`);
          response.headers.set('X-Debug-Success', success.toString());
        }
      }
    }

    // Return response or a fallback error response
    return (
      response ||
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  };
}
