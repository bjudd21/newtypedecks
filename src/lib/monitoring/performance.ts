/**
 * Application Performance Monitoring (APM)
 * Tracks application performance, resource usage, and optimization opportunities
 */

import { metricsCollector } from './analytics';
import { logger } from './logger';

export interface PerformanceEntry {
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: 'api' | 'database' | 'component' | 'page' | 'user-action';
  metadata?: Record<string, any>;
}

export interface ResourceUsage {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu?: {
    usage: number;
    loadAverage?: number[];
  };
  network?: {
    bytesReceived: number;
    bytesSent: number;
  };
}

class PerformanceMonitor {
  private entries: PerformanceEntry[] = [];
  private activeTimers: Map<string, number> = new Map();
  private thresholds = {
    api: 2000, // 2 seconds
    database: 1000, // 1 second
    component: 100, // 100ms
    page: 3000, // 3 seconds
    'user-action': 500, // 500ms
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initBrowserMonitoring();
    } else {
      this.initServerMonitoring();
    }
  }

  // Start performance timing
  startTiming(name: string, type: PerformanceEntry['type'], metadata?: Record<string, any>): string {
    const timerId = `${type}:${name}:${Date.now()}`;
    this.activeTimers.set(timerId, performance.now());

    logger.debug(`Started timing: ${name}`, {
      action: 'performance_start',
      context: { timerId, type, metadata },
    });

    return timerId;
  }

  // End performance timing
  endTiming(timerId: string, metadata?: Record<string, any>): PerformanceEntry | null {
    const startTime = this.activeTimers.get(timerId);
    if (!startTime) {
      logger.warn(`Timer not found: ${timerId}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const [type, name] = timerId.split(':') as [PerformanceEntry['type'], string];

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
      tags: { operation: name, ...metadata },
    });

    // Log slow operations
    const threshold = this.thresholds[type];
    if (duration > threshold) {
      logger.warn(`Slow ${type} operation: ${name} took ${duration.toFixed(2)}ms`, {
        action: 'performance_slow',
        context: { timerId, duration, threshold, metadata },
      });
    } else {
      logger.debug(`Completed timing: ${name} (${duration.toFixed(2)}ms)`, {
        action: 'performance_end',
        context: { timerId, duration, metadata },
      });
    }

    // Keep only last 1000 entries
    if (this.entries.length > 1000) {
      this.entries = this.entries.slice(-1000);
    }

    return entry;
  }

  // Measure function execution time
  measure<T>(
    name: string,
    type: PerformanceEntry['type'],
    fn: () => T | Promise<T>,
    metadata?: Record<string, any>
  ): T | Promise<T> {
    const timerId = this.startTiming(name, type, metadata);

    try {
      const result = fn();

      // Handle promises
      if (result && typeof (result as any).then === 'function') {
        return (result as Promise<T>)
          .then((value) => {
            this.endTiming(timerId);
            return value;
          })
          .catch((error) => {
            this.endTiming(timerId, { error: error.message });
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

  // Get performance statistics
  getStats(type?: PerformanceEntry['type'], name?: string) {
    let filtered = this.entries;

    if (type) {
      filtered = filtered.filter(entry => entry.type === type);
    }

    if (name) {
      filtered = filtered.filter(entry => entry.name === name);
    }

    if (filtered.length === 0) {
      return null;
    }

    const durations = filtered.map(entry => entry.duration);
    const sorted = [...durations].sort((a, b) => a - b);

    return {
      count: filtered.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      avg: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      recent: filtered.slice(-10),
    };
  }

  // Get current resource usage
  getResourceUsage(): ResourceUsage | null {
    if (typeof window !== 'undefined') {
      return this.getBrowserResourceUsage();
    } else if (typeof process !== 'undefined') {
      return this.getServerResourceUsage();
    }
    return null;
  }

  // Browser-specific monitoring
  private initBrowserMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.trackPageLoadMetrics();
      }, 0);
    });

    // Monitor navigation timing
    if ('navigation' in performance) {
      this.trackNavigationTiming();
    }

    // Monitor resource timing
    if ('getEntriesByType' in performance) {
      this.trackResourceTiming();
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        this.trackMemoryUsage();
      }, 30000); // Every 30 seconds
    }
  }

  private getBrowserResourceUsage(): ResourceUsage | null {
    if (!('memory' in performance)) return null;

    const memory = (performance as any).memory;
    return {
      memory: {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      },
    };
  }

  private trackPageLoadMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (navigation) {
      const metrics = {
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
        loadComplete: navigation.loadEventEnd - navigation.startTime,
        domInteractive: navigation.domInteractive - navigation.startTime,
      };

      Object.entries(metrics).forEach(([name, value]) => {
        metricsCollector.collectMetric({
          name: `page_${name}`,
          value,
          unit: 'ms',
          tags: { page: window.location.pathname },
        });
      });

      logger.info('Page load metrics captured', {
        action: 'page_load',
        context: { ...metrics, page: window.location.pathname },
      });
    }
  }

  private trackNavigationTiming() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming;
          logger.debug('Navigation timing', {
            action: 'navigation',
            context: {
              type: nav.type,
              redirectCount: nav.redirectCount,
              transferSize: nav.transferSize,
            },
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });
  }

  private trackResourceTiming() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;

          // Track slow resources
          if (resource.duration > 1000) {
            logger.warn('Slow resource load', {
              action: 'resource_load',
              context: {
                name: resource.name,
                duration: resource.duration,
                transferSize: resource.transferSize,
                type: resource.initiatorType,
              },
            });
          }

          metricsCollector.collectMetric({
            name: 'resource_load_time',
            value: resource.duration,
            unit: 'ms',
            tags: {
              type: resource.initiatorType,
              cached: resource.transferSize === 0 ? 'true' : 'false',
            },
          });
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  private trackMemoryUsage() {
    const usage = this.getBrowserResourceUsage();
    if (usage) {
      metricsCollector.collectMetric({
        name: 'memory_usage',
        value: usage.memory.percentage,
        unit: 'percent',
      });

      // Warn if memory usage is high
      if (usage.memory.percentage > 80) {
        logger.warn('High memory usage detected', {
          action: 'memory_warning',
          context: usage.memory,
        });
      }
    }
  }

  // Server-specific monitoring
  private initServerMonitoring() {
    // Monitor process metrics
    setInterval(() => {
      this.trackServerMetrics();
    }, 30000); // Every 30 seconds
  }

  private getServerResourceUsage(): ResourceUsage | null {
    if (typeof process === 'undefined') return null;

    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
      },
      cpu: {
        usage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
      },
    };
  }

  private trackServerMetrics() {
    const usage = this.getServerResourceUsage();
    if (usage) {
      metricsCollector.collectMetric({
        name: 'server_memory_usage',
        value: usage.memory.percentage,
        unit: 'percent',
      });

      metricsCollector.collectMetric({
        name: 'server_cpu_usage',
        value: usage.cpu?.usage || 0,
        unit: 'seconds',
      });

      // Log if resource usage is high
      if (usage.memory.percentage > 80 || (usage.cpu?.usage || 0) > 5) {
        logger.warn('High server resource usage', {
          action: 'resource_warning',
          context: usage,
        });
      }
    }
  }

  // Clear old entries
  clearOldEntries(olderThanMinutes: number = 60) {
    const cutoff = Date.now() - olderThanMinutes * 60 * 1000;
    this.entries = this.entries.filter(entry => entry.endTime > cutoff);
  }

  // Export performance data
  exportData() {
    return {
      entries: this.entries,
      stats: {
        api: this.getStats('api'),
        database: this.getStats('database'),
        component: this.getStats('component'),
        page: this.getStats('page'),
        userAction: this.getStats('user-action'),
      },
      resourceUsage: this.getResourceUsage(),
      thresholds: this.thresholds,
    };
  }
}

// Create performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export function measureAPI<T>(name: string, fn: () => T | Promise<T>, metadata?: Record<string, any>) {
  return performanceMonitor.measure(name, 'api', fn, metadata);
}

export function measureDB<T>(name: string, fn: () => T | Promise<T>, metadata?: Record<string, any>) {
  return performanceMonitor.measure(name, 'database', fn, metadata);
}

export function measureComponent<T>(name: string, fn: () => T | Promise<T>, metadata?: Record<string, any>) {
  return performanceMonitor.measure(name, 'component', fn, metadata);
}

export function measureUserAction<T>(name: string, fn: () => T | Promise<T>, metadata?: Record<string, any>) {
  return performanceMonitor.measure(name, 'user-action', fn, metadata);
}

// Performance decorator
export function measurePerformance(type: PerformanceEntry['type'], operationName?: string) {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const method = descriptor.value!;
    const name = operationName || `${target.constructor.name}.${propertyName}`;

    descriptor.value = (function (this: any, ...args: any[]) {
      return performanceMonitor.measure(name, type, () => method.apply(this, args));
    } as any) as T;

    return descriptor;
  };
}

export default performanceMonitor;