/**
 * Web Vitals tracking
 * Tracks Core Web Vitals (CLS, INP, FCP, LCP, TTFB)
 */

import type { AnalyticsProvider } from './AnalyticsProvider';
import type { MetricsCollector } from './MetricsCollector';

export function createWebVitalsTracker(
  analytics: AnalyticsProvider,
  metricsCollector: MetricsCollector
) {
  return function trackWebVitals() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals
    function sendToAnalytics(metric: {
      name: string;
      value: number;
      id: string;
      delta: number;
    }) {
      analytics.trackEvent({
        name: 'web_vital',
        properties: {
          metric_name: metric.name,
          metric_value: metric.value,
          metric_id: metric.id,
          metric_delta: metric.delta,
        },
      });

      metricsCollector.collectMetric({
        name: `web_vital_${metric.name.toLowerCase()}`,
        value: metric.value,
        unit: 'ms',
        tags: { id: metric.id },
      });
    }

    // Import and track web vitals
    import('web-vitals')
      .then((webVitals) => {
        if (webVitals.onCLS) webVitals.onCLS(sendToAnalytics);
        if (webVitals.onINP) webVitals.onINP(sendToAnalytics); // FID is replaced by INP
        if (webVitals.onFCP) webVitals.onFCP(sendToAnalytics);
        if (webVitals.onLCP) webVitals.onLCP(sendToAnalytics);
        if (webVitals.onTTFB) webVitals.onTTFB(sendToAnalytics);
      })
      .catch(console.error);
  };
}
