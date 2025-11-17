/**
 * Browser-specific performance monitoring
 * Tracks page load, navigation, resources, and memory
 */

import type { ResourceUsage, PerformanceWithMemory } from './types';
import { metricsCollector } from '../analytics';
import { logger } from '../logger';

export class BrowserMonitoring {
  initBrowserMonitoring() {
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

  getBrowserResourceUsage(): ResourceUsage | null {
    const perf = performance as PerformanceWithMemory;
    if (!perf.memory) return null;

    return {
      memory: {
        used: perf.memory.usedJSHeapSize,
        total: perf.memory.totalJSHeapSize,
        percentage:
          (perf.memory.usedJSHeapSize / perf.memory.totalJSHeapSize) * 100,
      },
    };
  }

  private trackPageLoadMetrics() {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      const metrics = {
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.startTime,
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
}
