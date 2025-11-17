/**
 * Metrics collector class
 * Collects and aggregates performance metrics
 */

import type { PerformanceMetric } from './types';
import type { AnalyticsProvider } from './AnalyticsProvider';

export class MetricsCollector {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private isEnabled: boolean;
  private analytics: AnalyticsProvider;

  constructor(analytics: AnalyticsProvider) {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.analytics = analytics;
  }

  // Collect performance metric
  collectMetric(metric: PerformanceMetric) {
    if (!this.isEnabled) return;

    const key = metric.name;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }

    const metrics = this.metrics.get(key)!;
    metrics.push({
      ...metric,
      timestamp: metric.timestamp || new Date(),
    });

    // Keep only last 100 metrics per type
    if (metrics.length > 100) {
      metrics.shift();
    }

    // Track in analytics
    this.analytics.trackPerformance(metric);
  }

  // Get metrics summary
  getMetricsSummary(metricName: string) {
    const metrics = this.metrics.get(metricName) || [];
    if (metrics.length === 0) return null;

    const values = metrics.map((m) => m.value);
    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      recent: metrics.slice(-10),
    };
  }

  // Clear old metrics
  clearOldMetrics(olderThanHours: number = 24) {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);

    this.metrics.forEach((metrics, key) => {
      const filtered = metrics.filter((m) => m.timestamp! > cutoff);
      this.metrics.set(key, filtered);
    });
  }
}
