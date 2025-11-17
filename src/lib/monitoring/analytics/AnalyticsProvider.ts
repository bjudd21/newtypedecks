/**
 * Analytics provider class
 * Handles Google Analytics 4 and Mixpanel integration
 */

import type { AnalyticsEvent, PerformanceMetric } from './types';

export class AnalyticsProvider {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled =
      !!process.env.GOOGLE_ANALYTICS_ID || !!process.env.MIXPANEL_TOKEN;
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) {
      console.warn('Analytics Event:', event);
      return;
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.name, {
        ...event.properties,
        user_id: event.userId,
      });
    }

    // Mixpanel
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(event.name, {
        ...event.properties,
        user_id: event.userId,
        timestamp: event.timestamp || new Date(),
      });
    }
  }

  // Track page views
  trackPageView(page: string, userId?: string) {
    this.trackEvent({
      name: 'page_view',
      properties: {
        page_title: document?.title,
        page_location: page,
      },
      userId,
    });
  }

  // Track user interactions
  trackUserAction(
    action: string,
    resource: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ) {
    this.trackEvent({
      name: 'user_action',
      properties: {
        action,
        resource,
        ...metadata,
      },
      userId,
    });
  }

  // Track performance metrics
  trackPerformance(metric: PerformanceMetric) {
    this.trackEvent({
      name: 'performance_metric',
      properties: {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_unit: metric.unit,
        ...metric.tags,
      },
    });
  }

  // Track errors
  trackError(error: Error, context?: Record<string, unknown>) {
    this.trackEvent({
      name: 'error',
      properties: {
        error_message: error.message,
        error_stack: error.stack?.substring(0, 500),
        ...context,
      },
    });
  }

  // Set user properties
  setUser(userId: string, properties?: Record<string, unknown>) {
    if (!this.isEnabled) return;

    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.GOOGLE_ANALYTICS_ID!, {
        user_id: userId,
        custom_map: properties,
      });
    }

    // Mixpanel
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.identify(userId);
      if (properties && window.mixpanel.people) {
        window.mixpanel.people.set(properties);
      }
    }
  }
}
