/**
 * Rate limiting monitoring
 */

import { NextRequest } from 'next/server';
import { logger } from '../logger';
import { businessMetrics } from '../analytics';
import type { RateLimitConfig } from './types';

export function createRateLimitMonitor(config: RateLimitConfig) {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return function rateLimitMiddleware(req: NextRequest): boolean {
    const key = config.keyGenerator
      ? config.keyGenerator(req)
      : req.headers.get('x-forwarded-for') || 'anonymous';

    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean old entries
    for (const [k, v] of requests.entries()) {
      if (v.resetTime < windowStart) {
        requests.delete(k);
      }
    }

    const current = requests.get(key) || {
      count: 0,
      resetTime: now + config.windowMs,
    };

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
