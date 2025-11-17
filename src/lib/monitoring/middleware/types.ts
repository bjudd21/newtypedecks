/**
 * Middleware type definitions
 */

import { NextRequest } from 'next/server';

export interface MonitoringContext {
  requestId: string;
  userId?: string;
  userAgent?: string;
  ip?: string;
  startTime: number;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
}

// Extended NextRequest with monitoring context
export interface NextRequestWithMonitoring extends NextRequest {
  monitoring?: MonitoringContext;
}
