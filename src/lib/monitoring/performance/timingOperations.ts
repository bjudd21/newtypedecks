/**
 * Timing operations for performance monitoring
 * Handles starting, stopping, and measuring timing
 */

import type { PerformanceEntry, PerformanceThresholds } from './types';
import { metricsCollector } from '../analytics';
import { logger } from '../logger';

export class TimingOperations {
  constructor(
    private entries: PerformanceEntry[],
    private activeTimers: Map<string, number>,
    private thresholds: PerformanceThresholds
  ) {}

  // Start performance timing
  startTiming(
    name: string,
    type: PerformanceEntry['type'],
    metadata?: Record<string, unknown>
  ): string {
    const timerId = `${type}:${name}:${Date.now()}`;
    this.activeTimers.set(timerId, performance.now());

    logger.debug(`Started timing: ${name}`, {
      action: 'performance_start',
      context: { timerId, type, metadata },
    });

    return timerId;
  }

  // End performance timing
  endTiming(
    timerId: string,
    metadata?: Record<string, unknown>
  ): PerformanceEntry | null {
    const startTime = this.activeTimers.get(timerId);
    if (!startTime) {
      logger.warn(`Timer not found: ${timerId}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const [type, name] = timerId.split(':') as [
      PerformanceEntry['type'],
      string,
    ];

    const entry: PerformanceEntry = {
      name,
      startTime,
      endTime,
      duration,
      type,
      metadata,
    };

    this.entries.push(entry);
    this.activeTimers.delete(timerId);

    // Track in metrics collector
    metricsCollector.collectMetric({
      name: `${type}_duration`,
      value: duration,
      unit: 'ms',
      tags: { operation: name, ...(metadata as Record<string, string>) },
    });

    // Log slow operations
    const threshold = this.thresholds[type];
    if (duration > threshold) {
      logger.warn(
        `Slow ${type} operation: ${name} took ${duration.toFixed(2)}ms`,
        {
          action: 'performance_slow',
          context: { timerId, duration, threshold, metadata },
        }
      );
    } else {
      logger.debug(`Completed timing: ${name} (${duration.toFixed(2)}ms)`, {
        action: 'performance_end',
        context: { timerId, duration, metadata },
      });
    }

    // Keep only last 1000 entries
    if (this.entries.length > 1000) {
      this.entries.splice(0, this.entries.length - 1000);
    }

    return entry;
  }

  // Measure function execution time
  measure<T>(
    name: string,
    type: PerformanceEntry['type'],
    fn: () => T | Promise<T>,
    metadata?: Record<string, unknown>
  ): T | Promise<T> {
    const timerId = this.startTiming(name, type, metadata);

    try {
      const result = fn();

      // Handle promises
      if (result && typeof (result as { then?: unknown }).then === 'function') {
        return (result as Promise<T>)
          .then((value) => {
            this.endTiming(timerId);
            return value;
          })
          .catch((error) => {
            this.endTiming(timerId, { error: (error as Error).message });
            throw error;
          });
      }

      this.endTiming(timerId);
      return result;
    } catch (error) {
      this.endTiming(timerId, { error: (error as Error).message });
      throw error;
    }
  }
}
