/**
 * Monitoring middleware for tracking API requests, performance, and errors
 * Automatically instruments Next.js API routes with comprehensive monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { errorTracker, performanceMonitor } from './sentry';
import { businessMetrics } from './analytics';
import { logger, createRequestLogger } from './logger';
import { measureAPI } from './performance';

export interface MonitoringContext {
  requestId: string;
  userId?: string;
  userAgent?: string;
  ip?: string;
  startTime: number;
}

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Extract user ID from request (from session, JWT, etc.)
async function extractUserId(request: NextRequest): Promise<string | undefined> {
  try {
    // Try to get user ID from session or JWT token
    // This is a placeholder - implement based on your auth system
    const sessionCookie = request.cookies.get('next-auth.session-token');
    if (sessionCookie) {
      // In a real implementation, you'd decode the session/JWT
      // For now, we'll return undefined
      return undefined;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}

// Create monitoring middleware
export function createMonitoringMiddleware() {
  return async function monitoringMiddleware(
    request: NextRequest,
    handler: (req: NextRequest, context: MonitoringContext) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const startTime = Date.now();
    const requestId = generateRequestId();
    const userId = await extractUserId(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for') ||
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
    errorTracker.addBreadcrumb(
      `API Request: ${method} ${endpoint}`,
      'http',
      { requestId, userId, ip }
    );

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
    return response || NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  };
}

// Wrap API route handler with monitoring
export function withMonitoring<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
) {
  const middleware = createMonitoringMiddleware();

  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    return middleware(req, async (request, context) => {
      // Set monitoring context for the handler
      (request as any).monitoring = context;
      return handler(request, ...args);
    });
  };
}

// Database query monitoring wrapper
export function monitorDatabaseQuery<T>(
  operation: string,
  query: () => Promise<T>,
  tableName?: string
): Promise<T> {
  return measureAPI(
    `DB ${operation}${tableName ? ` on ${tableName}` : ''}`,
    async () => {
      const result = await query();

      // Log successful query
      logger.dbLog(operation, tableName || 'unknown', Date.now(), undefined, {
        context: { success: true },
      });

      return result;
    },
    { operation, table: tableName }
  );
}

// Authentication monitoring wrapper
export function monitorAuth<T>(
  action: string,
  authFunction: () => Promise<T>,
  userId?: string
): Promise<T> {
  return measureAPI(
    `Auth ${action}`,
    async () => {
      try {
        const result = await authFunction();

        // Log successful auth action
        logger.authLog(action, userId, true);
        businessMetrics.trackUserLogin(userId || 'unknown', 'email'); // Default to email

        return result;
      } catch (error) {
        // Log failed auth action
        logger.authLog(action, userId, false);
        errorTracker.captureException(error as Error, {
          auth: { action, userId, success: false },
        });
        throw error;
      }
    },
    { action, userId }
  );
}

// File upload monitoring wrapper
export function monitorFileUpload<T>(
  fileName: string,
  fileSize: number,
  uploadFunction: () => Promise<T>
): Promise<T> {
  return measureAPI(
    `Upload ${fileName}`,
    async () => {
      try {
        const result = await uploadFunction();

        // Log successful upload
        logger.info(`File uploaded successfully: ${fileName}`, {
          action: 'file_upload',
          context: { fileName, fileSize, success: true },
        });

        return result;
      } catch (error) {
        // Log failed upload
        logger.error(`File upload failed: ${fileName}`, error as Error, {
          action: 'file_upload',
          context: { fileName, fileSize, success: false },
        });

        errorTracker.captureException(error as Error, {
          upload: { fileName, fileSize, success: false },
        });

        throw error;
      }
    },
    { fileName, fileSize }
  );
}

// Rate limiting monitoring
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
}

export function createRateLimitMonitor(config: RateLimitConfig) {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return function rateLimitMiddleware(req: NextRequest): boolean {
    const key = config.keyGenerator ? config.keyGenerator(req) :
                req.headers.get('x-forwarded-for') || 'anonymous';

    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean old entries
    for (const [k, v] of requests.entries()) {
      if (v.resetTime < windowStart) {
        requests.delete(k);
      }
    }

    const current = requests.get(key) || { count: 0, resetTime: now + config.windowMs };

    if (current.count >= config.maxRequests) {
      // Rate limit exceeded
      logger.warn('Rate limit exceeded', {
        action: 'rate_limit_exceeded',
        context: { key, count: current.count, maxRequests: config.maxRequests },
      });

      businessMetrics.trackError(new Error('Rate limit exceeded'), {
        type: 'rate_limit',
        key,
        count: current.count,
      });

      return false;
    }

    // Update request count
    current.count++;
    requests.set(key, current);

    return true;
  };
}

// Health check monitoring
export async function monitorHealthCheck() {
  const startTime = Date.now();

  try {
    // Check database
    const dbStart = Date.now();
    // Placeholder for database check
    const dbDuration = Date.now() - dbStart;

    // Check external services (Redis, etc.)
    const serviceChecks = {
      database: { status: 'healthy', responseTime: dbDuration },
      redis: { status: 'unknown', responseTime: 0 }, // Implement if using Redis
    };

    const duration = Date.now() - startTime;

    logger.info('Health check completed', {
      action: 'health_check',
      context: { duration, services: serviceChecks },
    });

    return {
      status: 'healthy',
      duration,
      services: serviceChecks,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error('Health check failed', error as Error, {
      action: 'health_check',
      context: { duration },
    });

    errorTracker.captureException(error as Error, {
      healthCheck: { duration, success: false },
    });

    return {
      status: 'unhealthy',
      duration,
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    };
  }
}

export default {
  withMonitoring,
  monitorDatabaseQuery,
  monitorAuth,
  monitorFileUpload,
  createRateLimitMonitor,
  monitorHealthCheck,
};