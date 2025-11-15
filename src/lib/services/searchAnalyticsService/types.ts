/**
 * Search Analytics Types
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
  conversionRate?: number;
}

export interface PopularSearch {
  query: string;
  filters: CardSearchFilters;
  options: CardSearchOptions;
  popularity: number;
  trendScore: number;
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
  mostActiveTimeOfDay: number;
  preferredSortOrder: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
}

export interface AnalyticsConfig {
  enableRealTimeTracking: boolean;
  enableUserBehaviorTracking: boolean;
  enablePerformanceTracking: boolean;
  enableTrendAnalysis: boolean;
  dataRetentionDays: number;
  aggregationInterval: number;
  enableAnonymization: boolean;
}

export interface SearchSuggestion {
  type: 'popular' | 'personalized' | 'related';
  label: string;
  filters: CardSearchFilters;
  confidence: number;
}
