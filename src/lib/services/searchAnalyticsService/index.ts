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
import { generateEventId } from './utils';
import { updateSearchPatterns, updateUserBehavior } from './processors';
import {
  getPopularSearches,
  getSearchTrends,
  getPerformanceMetrics,
} from './analytics';
import { generateSearchSuggestions } from './suggestions';

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
    this.startPeriodicProcessing();
  }

  public static getInstance(
    config?: Partial<AnalyticsConfig>
  ): SearchAnalyticsService {
    if (!SearchAnalyticsService.instance) {
      SearchAnalyticsService.instance = new SearchAnalyticsService(config);
    }
    return SearchAnalyticsService.instance;
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
    if (!this.config.enableRealTimeTracking) {
      return;
    }

    const event: SearchEvent = {
      id: generateEventId(),
      timestamp: new Date(),
      sessionId: context.sessionId,
      userId: context.userId,
      filters,
      options,
      resultCount,
      responseTime,
      source: context.source || 'manual',
      userAgent: context.userAgent,
      referer: context.referer,
    };

    this.events.push(event);

    // Process the event for patterns and behavior tracking
    await this.processEvent(event);

    // Clean old events
    this.cleanOldEvents();
  }

  /**
   * Process a search event for analytics
   */
  private async processEvent(event: SearchEvent): Promise<void> {
    // Update search patterns
    if (this.config.enableTrendAnalysis) {
      updateSearchPatterns(event, this.patterns);
    }

    // Update user behavior
    if (this.config.enableUserBehaviorTracking && event.userId) {
      updateUserBehavior(event, this.userBehaviors);
    }
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

  /**
   * Clean old events based on retention policy
   */
  private cleanOldEvents(): void {
    if (this.events.length > 10000) {
      const cutoff = new Date(
        Date.now() - this.config.dataRetentionDays * 24 * 60 * 60 * 1000
      );
      this.events = this.events.filter((event) => event.timestamp >= cutoff);
    }
  }

  /**
   * Start periodic data processing
   */
  private startPeriodicProcessing(): void {
    // Process analytics data periodically
    setInterval(
      () => {
        this.cleanOldEvents();
        // Could add more periodic processing here
      },
      this.config.aggregationInterval * 60 * 1000
    );
  }
}

// Export singleton instance
export const searchAnalytics = SearchAnalyticsService.getInstance();
