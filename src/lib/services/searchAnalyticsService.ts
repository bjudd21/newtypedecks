/**
 * Search Analytics Service
 *
 * Tracks user search behavior, popular queries, and performance metrics
 */

import type { CardSearchFilters, CardSearchOptions } from '@/lib/types/card';

export interface SearchEvent {
  id: string;
  timestamp: Date;
  sessionId?: string;
  userId?: string;
  filters: CardSearchFilters;
  options: CardSearchOptions;
  resultCount: number;
  responseTime: number;
  source: 'manual' | 'suggestion' | 'filter' | 'sort';
  userAgent?: string;
  referer?: string;
}

export interface SearchPattern {
  filters: Partial<CardSearchFilters>;
  count: number;
  avgResponseTime: number;
  avgResultCount: number;
  firstSeen: Date;
  lastSeen: Date;
  uniqueUsers: Set<string>;
  conversionRate?: number; // If we track clicks/actions after search
}

export interface PopularSearch {
  query: string;
  filters: CardSearchFilters;
  options: CardSearchOptions;
  popularity: number;
  trendScore: number; // Recent popularity vs historical
  lastQueried: Date;
}

export interface SearchTrend {
  timeframe: 'hour' | 'day' | 'week' | 'month';
  data: Array<{
    timestamp: Date;
    searchCount: number;
    uniqueUsers: number;
    avgResponseTime: number;
    popularFilters: Record<string, number>;
  }>;
}

export interface UserSearchBehavior {
  userId: string;
  totalSearches: number;
  avgSearchesPerSession: number;
  preferredFilters: Record<string, number>;
  searchFrequency: 'low' | 'medium' | 'high';
  avgResponseTime: number;
  mostActiveTimeOfDay: number; // Hour (0-23)
  preferredSortOrder: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
}

export interface AnalyticsConfig {
  enableRealTimeTracking: boolean;
  enableUserBehaviorTracking: boolean;
  enablePerformanceTracking: boolean;
  enableTrendAnalysis: boolean;
  dataRetentionDays: number;
  aggregationInterval: number; // Minutes
  enableAnonymization: boolean;
}

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
    enableAnonymization: true
  };

  private constructor(config?: Partial<AnalyticsConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Start periodic data processing
    this.startPeriodicProcessing();
  }

  public static getInstance(config?: Partial<AnalyticsConfig>): SearchAnalyticsService {
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
      id: this.generateEventId(),
      timestamp: new Date(),
      sessionId: context.sessionId,
      userId: context.userId,
      filters,
      options,
      resultCount,
      responseTime,
      source: context.source || 'manual',
      userAgent: context.userAgent,
      referer: context.referer
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
      await this.updateSearchPatterns(event);
    }

    // Update user behavior
    if (this.config.enableUserBehaviorTracking && event.userId) {
      await this.updateUserBehavior(event);
    }
  }

  /**
   * Update search patterns based on event
   */
  private async updateSearchPatterns(event: SearchEvent): Promise<void> {
    const patternKey = this.generatePatternKey(event.filters);
    const existingPattern = this.patterns.get(patternKey);

    if (existingPattern) {
      // Update existing pattern
      existingPattern.count++;
      existingPattern.avgResponseTime =
        (existingPattern.avgResponseTime * (existingPattern.count - 1) + event.responseTime) / existingPattern.count;
      existingPattern.avgResultCount =
        (existingPattern.avgResultCount * (existingPattern.count - 1) + event.resultCount) / existingPattern.count;
      existingPattern.lastSeen = event.timestamp;

      if (event.userId) {
        existingPattern.uniqueUsers.add(event.userId);
      }
    } else {
      // Create new pattern
      const newPattern: SearchPattern = {
        filters: { ...event.filters },
        count: 1,
        avgResponseTime: event.responseTime,
        avgResultCount: event.resultCount,
        firstSeen: event.timestamp,
        lastSeen: event.timestamp,
        uniqueUsers: new Set(event.userId ? [event.userId] : [])
      };

      this.patterns.set(patternKey, newPattern);
    }
  }

  /**
   * Update user behavior tracking
   */
  private async updateUserBehavior(event: SearchEvent): Promise<void> {
    if (!event.userId) return;

    const existingBehavior = this.userBehaviors.get(event.userId);

    if (existingBehavior) {
      // Update existing behavior
      existingBehavior.totalSearches++;
      existingBehavior.avgResponseTime =
        (existingBehavior.avgResponseTime * (existingBehavior.totalSearches - 1) + event.responseTime) / existingBehavior.totalSearches;

      // Update preferred filters
      Object.entries(event.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const filterKey = `${key}:${JSON.stringify(value)}`;
          existingBehavior.preferredFilters[filterKey] =
            (existingBehavior.preferredFilters[filterKey] || 0) + 1;
        }
      });

      // Update preferred sort order
      if (event.options.sortBy && event.options.sortOrder) {
        existingBehavior.preferredSortOrder = `${event.options.sortBy}:${event.options.sortOrder}`;
      }

      // Update most active time of day
      existingBehavior.mostActiveTimeOfDay = event.timestamp.getHours();
    } else {
      // Create new user behavior
      const preferredFilters: Record<string, number> = {};
      Object.entries(event.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const filterKey = `${key}:${JSON.stringify(value)}`;
          preferredFilters[filterKey] = 1;
        }
      });

      const newBehavior: UserSearchBehavior = {
        userId: event.userId,
        totalSearches: 1,
        avgSearchesPerSession: 1, // Will be calculated over time
        preferredFilters,
        searchFrequency: 'low', // Will be updated based on patterns
        avgResponseTime: event.responseTime,
        mostActiveTimeOfDay: event.timestamp.getHours(),
        preferredSortOrder: event.options.sortBy && event.options.sortOrder ?
          `${event.options.sortBy}:${event.options.sortOrder}` : 'name:asc'
      };

      this.userBehaviors.set(event.userId, newBehavior);
    }
  }

  /**
   * Get popular searches
   */
  getPopularSearches(limit = 10, timeframe?: 'day' | 'week' | 'month'): PopularSearch[] {
    const cutoffTime = timeframe ? this.getTimeframeCutoff(timeframe) : null;

    const popularPatterns = Array.from(this.patterns.entries())
      .filter(([, pattern]) => !cutoffTime || pattern.lastSeen >= cutoffTime)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit);

    return popularPatterns.map(([_key, pattern]) => ({
      query: this.patternToReadableQuery(pattern.filters),
      filters: pattern.filters as CardSearchFilters,
      options: { sortBy: 'name', sortOrder: 'asc' as const },
      popularity: pattern.count,
      trendScore: this.calculateTrendScore(pattern),
      lastQueried: pattern.lastSeen
    }));
  }

  /**
   * Get search trends for a timeframe
   */
  getSearchTrends(timeframe: 'hour' | 'day' | 'week' | 'month'): SearchTrend {
    const cutoffTime = this.getTimeframeCutoff(timeframe);
    const relevantEvents = this.events.filter(event => event.timestamp >= cutoffTime);

    // Group events by time buckets
    const bucketSize = this.getBucketSize(timeframe);
    const buckets = new Map<number, {
      searchCount: number;
      uniqueUsers: Set<string>;
      totalResponseTime: number;
      filterCounts: Map<string, number>;
    }>();

    relevantEvents.forEach(event => {
      const bucketKey = Math.floor(event.timestamp.getTime() / bucketSize) * bucketSize;

      if (!buckets.has(bucketKey)) {
        buckets.set(bucketKey, {
          searchCount: 0,
          uniqueUsers: new Set(),
          totalResponseTime: 0,
          filterCounts: new Map()
        });
      }

      const bucket = buckets.get(bucketKey)!;
      bucket.searchCount++;
      if (event.userId) bucket.uniqueUsers.add(event.userId);
      bucket.totalResponseTime += event.responseTime;

      // Count filters
      Object.entries(event.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const filterKey = `${key}:${JSON.stringify(value)}`;
          bucket.filterCounts.set(filterKey, (bucket.filterCounts.get(filterKey) || 0) + 1);
        }
      });
    });

    const data = Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([timestamp, bucket]) => ({
        timestamp: new Date(timestamp),
        searchCount: bucket.searchCount,
        uniqueUsers: bucket.uniqueUsers.size,
        avgResponseTime: bucket.searchCount > 0 ? bucket.totalResponseTime / bucket.searchCount : 0,
        popularFilters: Object.fromEntries(
          Array.from(bucket.filterCounts.entries()).slice(0, 10)
        )
      }));

    return { timeframe, data };
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
    const cutoffTime = timeframe ? this.getTimeframeCutoff(timeframe) : null;
    const relevantEvents = cutoffTime ?
      this.events.filter(event => event.timestamp >= cutoffTime) :
      this.events;

    if (relevantEvents.length === 0) {
      return {
        totalSearches: 0,
        avgResponseTime: 0,
        medianResponseTime: 0,
        p95ResponseTime: 0,
        slowQueries: [],
        popularFilters: {},
        searchVolume: []
      };
    }

    const responseTimes = relevantEvents.map(e => e.responseTime).sort((a, b) => a - b);
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const medianIndex = Math.floor(responseTimes.length / 2);
    const medianResponseTime = responseTimes.length % 2 === 0 ?
      (responseTimes[medianIndex - 1] + responseTimes[medianIndex]) / 2 :
      responseTimes[medianIndex];
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p95ResponseTime = responseTimes[p95Index];

    // Identify slow queries (top 5% by response time)
    const slowQueryThreshold = responseTimes[Math.floor(responseTimes.length * 0.95)];
    const slowQueries = relevantEvents
      .filter(e => e.responseTime >= slowQueryThreshold)
      .map(e => ({
        filters: e.filters,
        responseTime: e.responseTime,
        resultCount: e.resultCount,
        timestamp: e.timestamp
      }));

    // Calculate popular filters
    const filterCounts: Record<string, number> = {};
    relevantEvents.forEach(event => {
      Object.entries(event.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const filterKey = `${key}:${JSON.stringify(value)}`;
          filterCounts[filterKey] = (filterCounts[filterKey] || 0) + 1;
        }
      });
    });

    return {
      totalSearches: relevantEvents.length,
      avgResponseTime,
      medianResponseTime,
      p95ResponseTime,
      slowQueries: slowQueries.slice(0, 10),
      popularFilters: Object.fromEntries(
        Object.entries(filterCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20)
      ),
      searchVolume: this.getSearchTrends(timeframe || 'day').data
    };
  }

  /**
   * Generate suggestions based on user behavior
   */
  generateSearchSuggestions(userId?: string, currentFilters: Partial<CardSearchFilters> = {}): Array<{
    type: 'popular' | 'personalized' | 'related';
    label: string;
    filters: CardSearchFilters;
    confidence: number;
  }> {
    const suggestions: Array<{
      type: 'popular' | 'personalized' | 'related';
      label: string;
      filters: CardSearchFilters;
      confidence: number;
    }> = [];

    // Add popular searches
    const popularSearches = this.getPopularSearches(5);
    popularSearches.forEach(search => {
      suggestions.push({
        type: 'popular',
        label: `Popular: ${search.query}`,
        filters: search.filters,
        confidence: Math.min(search.popularity / 100, 1)
      });
    });

    // Add personalized suggestions if user ID provided
    if (userId) {
      const userBehavior = this.getUserBehavior(userId);
      if (userBehavior) {
        const topFilters = Object.entries(userBehavior.preferredFilters)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);

        topFilters.forEach(([filterKey, count]) => {
          const [key, valueStr] = filterKey.split(':');
          try {
            const value = JSON.parse(valueStr);
            suggestions.push({
              type: 'personalized',
              label: `Your favorite: ${key} = ${value}`,
              filters: { [key]: value } as CardSearchFilters,
              confidence: Math.min(count / userBehavior.totalSearches, 1)
            });
          } catch {
            // Ignore invalid JSON
          }
        });
      }
    }

    // Add related suggestions based on current filters
    if (Object.keys(currentFilters).length > 0) {
      const relatedPatterns = Array.from(this.patterns.values())
        .filter(pattern => this.hasOverlap(pattern.filters, currentFilters))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      relatedPatterns.forEach(pattern => {
        suggestions.push({
          type: 'related',
          label: `Related: ${this.patternToReadableQuery(pattern.filters)}`,
          filters: pattern.filters as CardSearchFilters,
          confidence: Math.min(pattern.count / 50, 1)
        });
      });
    }

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  }

  /**
   * Helper methods
   */
  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePatternKey(filters: CardSearchFilters): string {
    // Create a consistent key from filters
    const sortedFilters = Object.keys(filters)
      .sort()
      .reduce((obj, key) => {
        const value = filters[key as keyof CardSearchFilters];
        if (value !== undefined && value !== null && value !== '') {
          (obj as Record<string, unknown>)[key] = value;
        }
        return obj;
      }, {} as Record<string, unknown>);

    return JSON.stringify(sortedFilters);
  }

  private patternToReadableQuery(filters: Partial<CardSearchFilters>): string {
    const parts: string[] = [];

    if (filters.name) parts.push(`"${filters.name}"`);
    if (filters.faction) parts.push(`Faction: ${filters.faction}`);
    if (filters.series) parts.push(`Series: ${filters.series}`);
    if (filters.pilot) parts.push(`Pilot: ${filters.pilot}`);
    if (filters.levelMin || filters.levelMax) {
      const min = filters.levelMin || 0;
      const max = filters.levelMax || '∞';
      parts.push(`Level: ${min}-${max}`);
    }

    return parts.join(', ') || 'All cards';
  }

  private calculateTrendScore(pattern: SearchPattern): number {
    // Calculate trend based on recent activity vs historical
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);

    // Simple trend calculation - could be more sophisticated
    const recentActivity = pattern.lastSeen.getTime() > dayAgo ? 1 : 0;
    const totalActivity = pattern.count;

    return (recentActivity * 0.7) + (Math.min(totalActivity / 100, 1) * 0.3);
  }

  private getTimeframeCutoff(timeframe: 'hour' | 'day' | 'week' | 'month'): Date {
    const now = new Date();
    switch (timeframe) {
      case 'hour':
        return new Date(now.getTime() - 60 * 60 * 1000);
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  private getBucketSize(timeframe: 'hour' | 'day' | 'week' | 'month'): number {
    switch (timeframe) {
      case 'hour':
        return 5 * 60 * 1000; // 5 minutes
      case 'day':
        return 60 * 60 * 1000; // 1 hour
      case 'week':
        return 24 * 60 * 60 * 1000; // 1 day
      case 'month':
        return 7 * 24 * 60 * 60 * 1000; // 1 week
    }
  }

  private hasOverlap(filters1: Partial<CardSearchFilters>, filters2: Partial<CardSearchFilters>): boolean {
    for (const key of Object.keys(filters2)) {
      if (filters1[key as keyof CardSearchFilters] === filters2[key as keyof CardSearchFilters]) {
        return true;
      }
    }
    return false;
  }

  private cleanOldEvents(): void {
    if (this.events.length > 10000) {
      const cutoff = new Date(Date.now() - this.config.dataRetentionDays * 24 * 60 * 60 * 1000);
      this.events = this.events.filter(event => event.timestamp >= cutoff);
    }
  }

  private startPeriodicProcessing(): void {
    // Process analytics data periodically
    setInterval(() => {
      this.cleanOldEvents();
      // Could add more periodic processing here
    }, this.config.aggregationInterval * 60 * 1000);
  }
}

// Export singleton instance
export const searchAnalytics = SearchAnalyticsService.getInstance();