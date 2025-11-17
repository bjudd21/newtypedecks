/**
 * Server-specific performance monitoring
 * Tracks server resource usage (CPU, memory)
 */

import type { ResourceUsage } from './types';
import { metricsCollector } from '../analytics';
import { logger } from '../logger';

export class ServerMonitoring {
  initServerMonitoring() {
    // Monitor process metrics
    setInterval(() => {
      this.trackServerMetrics();
    }, 30000); // Every 30 seconds
  }

  getServerResourceUsage(): ResourceUsage | null {
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
}
