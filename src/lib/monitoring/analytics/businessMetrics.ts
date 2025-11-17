/**
 * Business metrics tracking
 * Provides tracking methods for business-specific operations
 */

import type { AnalyticsProvider } from './AnalyticsProvider';
import type { MetricsCollector } from './MetricsCollector';

export function createBusinessMetrics(
  analytics: AnalyticsProvider,
  metricsCollector: MetricsCollector
) {
  return {
    // Card-related metrics
    trackCardView(cardId: string, userId?: string) {
      analytics.trackUserAction('card_view', 'card', userId, {
        card_id: cardId,
      });
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

    trackDeckShare(
      deckId: string,
      shareType: 'public' | 'private' | 'url',
      userId?: string
    ) {
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
    trackCollectionUpdate(
      cardCount: number,
      totalValue: number,
      userId?: string
    ) {
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
    trackUserRegistration(
      userId: string,
      method: 'email' | 'google' | 'discord'
    ) {
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

    trackAPIResponse(
      endpoint: string,
      method: string,
      duration: number,
      success: boolean
    ) {
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
}
