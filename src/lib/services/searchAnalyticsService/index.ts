/**
 * Search Analytics Service
 *
 * Tracks user search behavior, popular queries, and performance metrics
 */

import type {
  SearchEvent,
  SearchPattern,
  UserSearchBehavior,
  AnalyticsConfig,
  PopularSearch,
  SearchTrend,
  SearchSuggestion,
} from './types';
import type { CardSearchFilters, CardSearchOptions } from '@/lib/types/card';
import {
  trackSearch as recordSearch,
  type EventTrackingContext,
} from './eventTracking';
import {
  getPopularSearches,
  getSearchTrends,
  getPerformanceMetrics,
} from './analytics';
import { generateSearchSuggestions } from './suggestions';
import { startPeriodicProcessing } from './lifecycle';

export type {
  SearchEvent,
  SearchPattern,
  PopularSearch,
  SearchTrend,
  UserSearchBehavior,
  AnalyticsConfig,
};

export class SearchAnalyticsService {
  private static instance: SearchAnalyticsService;
  private events: SearchEvent[] = [];
  private patterns: Map<string, SearchPattern> = new Map();
  private userBehaviors: Map<string, UserSearchBehavior> = new Map();

  private config: AnalyticsConfig = {
    enableRealTimeTracking: true,
    enableUserBehaviorTracking: true,
    enablePerformanceTracking: true,
    enableTrendAnalysis: true,
    dataRetentionDays: 90,
    aggregationInterval: 15, // 15 minutes
    enableAnonymization: true,
  };

  private constructor(config?: Partial<AnalyticsConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Start periodic data processing
    startPeriodicProcessing(this.config, this.getContext());
  }

  public static getInstance(
    config?: Partial<AnalyticsConfig>
  ): SearchAnalyticsService {
    if (!SearchAnalyticsService.instance) {
      SearchAnalyticsService.instance = new SearchAnalyticsService(config);
    }
    return SearchAnalyticsService.instance;
  }

  private getContext(): EventTrackingContext {
    return {
      events: this.events,
      patterns: this.patterns,
      userBehaviors: this.userBehaviors,
      config: this.config,
    };
  }

  /**
   * Track a search event
   */
  async trackSearch(
    filters: CardSearchFilters,
    options: CardSearchOptions,
    resultCount: number,
    responseTime: number,
    context: {
      sessionId?: string;
      userId?: string;
      source?: 'manual' | 'suggestion' | 'filter' | 'sort';
      userAgent?: string;
      referer?: string;
    } = {}
  ): Promise<void> {
    return recordSearch(
      filters,
      options,
      resultCount,
      responseTime,
      this.getContext(),
      context
    );
  }

  /**
   * Get popular searches
   */
  getPopularSearches(
    limit = 10,
    timeframe?: 'day' | 'week' | 'month'
  ): PopularSearch[] {
    return getPopularSearches(this.patterns, limit, timeframe);
  }

  /**
   * Get search trends for a timeframe
   */
  getSearchTrends(timeframe: 'hour' | 'day' | 'week' | 'month'): SearchTrend {
    return getSearchTrends(this.events, timeframe);
  }

  /**
   * Get user search behavior
   */
  getUserBehavior(userId: string): UserSearchBehavior | null {
    return this.userBehaviors.get(userId) || null;
  }

  /**
   * Get search performance metrics
   */
  getPerformanceMetrics(timeframe?: 'day' | 'week' | 'month') {
    return getPerformanceMetrics(this.events, timeframe);
  }

  /**
   * Generate suggestions based on user behavior
   */
  generateSearchSuggestions(
    userId?: string,
    currentFilters: Partial<CardSearchFilters> = {}
  ): SearchSuggestion[] {
    return generateSearchSuggestions(
      this.patterns,
      this.userBehaviors,
      userId,
      currentFilters
    );
  }
}

// Export singleton instance
export const searchAnalytics = SearchAnalyticsService.getInstance();
