/**
 * Analytics and metrics collection
 * Provides application performance metrics, user behavior tracking, and business metrics
 */

import '../../../types/global';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  userId?: string;
  timestamp?: Date;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  tags?: Record<string, string>;
  timestamp?: Date;
}

export interface UserMetric {
  userId: string;
  action: string;
  resource?: string;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
}

// Analytics providers
class AnalyticsProvider {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = !!process.env.GOOGLE_ANALYTICS_ID || !!process.env.MIXPANEL_TOKEN;
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
  trackUserAction(action: string, resource: string, userId?: string, metadata?: Record<string, unknown>) {
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

// Create analytics instance
export const analytics = new AnalyticsProvider();

// Application metrics collector
export class MetricsCollector {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
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
    analytics.trackPerformance(metric);
  }

  // Get metrics summary
  getMetricsSummary(metricName: string) {
    const metrics = this.metrics.get(metricName) || [];
    if (metrics.length === 0) return null;

    const values = metrics.map(m => m.value);
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
      const filtered = metrics.filter(m => m.timestamp! > cutoff);
      this.metrics.set(key, filtered);
    });
  }
}

// Create metrics collector instance
export const metricsCollector = new MetricsCollector();

// Business metrics tracking
export const businessMetrics = {
  // Card-related metrics
  trackCardView(cardId: string, userId?: string) {
    analytics.trackUserAction('card_view', 'card', userId, { card_id: cardId });
    metricsCollector.collectMetric({
      name: 'card_views',
      value: 1,
      unit: 'count',
      tags: { card_id: cardId },
    });
  },

  trackCardSearch(query: string, resultCount: number, userId?: string) {
    analytics.trackUserAction('card_search', 'search', userId, {
      query: query.substring(0, 100), // Limit query length
      result_count: resultCount,
    });
    metricsCollector.collectMetric({
      name: 'search_results',
      value: resultCount,
      unit: 'count',
      tags: { query_length: query.length.toString() },
    });
  },

  // Deck-related metrics
  trackDeckCreation(deckId: string, cardCount: number, userId?: string) {
    analytics.trackUserAction('deck_create', 'deck', userId, {
      deck_id: deckId,
      card_count: cardCount,
    });
    metricsCollector.collectMetric({
      name: 'deck_card_count',
      value: cardCount,
      unit: 'cards',
      tags: { action: 'create' },
    });
  },

  trackDeckShare(deckId: string, shareType: 'public' | 'private' | 'url', userId?: string) {
    analytics.trackUserAction('deck_share', 'deck', userId, {
      deck_id: deckId,
      share_type: shareType,
    });
    metricsCollector.collectMetric({
      name: 'deck_shares',
      value: 1,
      unit: 'count',
      tags: { share_type: shareType },
    });
  },

  // Collection metrics
  trackCollectionUpdate(cardCount: number, totalValue: number, userId?: string) {
    analytics.trackUserAction('collection_update', 'collection', userId, {
      card_count: cardCount,
      total_value: totalValue,
    });
    metricsCollector.collectMetric({
      name: 'collection_size',
      value: cardCount,
      unit: 'cards',
      tags: { user_id: userId || 'anonymous' },
    });
  },

  // Authentication metrics
  trackUserRegistration(userId: string, method: 'email' | 'google' | 'discord') {
    analytics.trackUserAction('user_register', 'auth', userId, { method });
    metricsCollector.collectMetric({
      name: 'user_registrations',
      value: 1,
      unit: 'count',
      tags: { method },
    });
  },

  trackUserLogin(userId: string, method: 'email' | 'google' | 'discord') {
    analytics.trackUserAction('user_login', 'auth', userId, { method });
    metricsCollector.collectMetric({
      name: 'user_logins',
      value: 1,
      unit: 'count',
      tags: { method },
    });
  },

  // Performance metrics
  trackPageLoad(page: string, loadTime: number, userId?: string) {
    analytics.trackEvent({
      name: 'page_performance',
      properties: { page, load_time: loadTime },
      userId,
    });
    metricsCollector.collectMetric({
      name: 'page_load_time',
      value: loadTime,
      unit: 'ms',
      tags: { page },
    });
  },

  trackAPIResponse(endpoint: string, method: string, duration: number, success: boolean) {
    metricsCollector.collectMetric({
      name: 'api_response_time',
      value: duration,
      unit: 'ms',
      tags: {
        endpoint: endpoint.replace(/\/\d+/g, '/:id'), // Normalize IDs
        method,
        success: success.toString(),
      },
    });
  },

  // Error metrics
  trackError(error: Error, context?: Record<string, unknown>) {
    analytics.trackError(error, context);
    metricsCollector.collectMetric({
      name: 'error_count',
      value: 1,
      unit: 'count',
      tags: {
        error_type: error.constructor.name,
        ...(context as Record<string, string>),
      },
    });
  },
};

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  function sendToAnalytics(metric: { name: string; value: number; id: string; delta: number }) {
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
  import('web-vitals').then((webVitals) => {
    if (webVitals.onCLS) webVitals.onCLS(sendToAnalytics);
    if (webVitals.onINP) webVitals.onINP(sendToAnalytics); // FID is replaced by INP
    if (webVitals.onFCP) webVitals.onFCP(sendToAnalytics);
    if (webVitals.onLCP) webVitals.onLCP(sendToAnalytics);
    if (webVitals.onTTFB) webVitals.onTTFB(sendToAnalytics);
  }).catch(console.error);
}

// Session tracking
export function trackSession() {
  if (typeof window === 'undefined') return;

  const sessionStart = Date.now();
  let pageViews = 0;
  let userActions = 0;

  // Track session start
  analytics.trackEvent({
    name: 'session_start',
    properties: {
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      timestamp: new Date(sessionStart),
    },
  });

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const sessionDuration = Date.now() - sessionStart;
      analytics.trackEvent({
        name: 'session_end',
        properties: {
          session_duration: sessionDuration,
          page_views: pageViews,
          user_actions: userActions,
        },
      });
    }
  });

  // Track before unload
  window.addEventListener('beforeunload', () => {
    const sessionDuration = Date.now() - sessionStart;
    analytics.trackEvent({
      name: 'session_end',
      properties: {
        session_duration: sessionDuration,
        page_views: pageViews,
        user_actions: userActions,
      },
    });
  });

  return {
    incrementPageViews: () => pageViews++,
    incrementUserActions: () => userActions++,
    getSessionDuration: () => Date.now() - sessionStart,
  };
}

// Initialize analytics
export function initAnalytics() {
  if (typeof window !== 'undefined') {
    trackWebVitals();
    trackSession();
  }
}