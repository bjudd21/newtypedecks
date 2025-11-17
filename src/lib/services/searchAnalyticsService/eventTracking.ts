/**
 * Search Event Tracking
 * Handles recording and processing of search events
 */

import type {
  SearchEvent,
  SearchPattern,
  UserSearchBehavior,
  AnalyticsConfig,
} from './types';
import type { CardSearchFilters, CardSearchOptions } from '@/lib/types/card';
import { generateEventId } from './utils';
import { updateSearchPatterns, updateUserBehavior } from './processors';

export interface EventTrackingContext {
  events: SearchEvent[];
  patterns: Map<string, SearchPattern>;
  userBehaviors: Map<string, UserSearchBehavior>;
  config: AnalyticsConfig;
}

/**
 * Track a search event
 */
export async function trackSearch(
  filters: CardSearchFilters,
  options: CardSearchOptions,
  resultCount: number,
  responseTime: number,
  context: EventTrackingContext,
  eventContext: {
    sessionId?: string;
    userId?: string;
    source?: 'manual' | 'suggestion' | 'filter' | 'sort';
    userAgent?: string;
    referer?: string;
  } = {}
): Promise<void> {
  if (!context.config.enableRealTimeTracking) {
    return;
  }

  const event: SearchEvent = {
    id: generateEventId(),
    timestamp: new Date(),
    sessionId: eventContext.sessionId,
    userId: eventContext.userId,
    filters,
    options,
    resultCount,
    responseTime,
    source: eventContext.source || 'manual',
    userAgent: eventContext.userAgent,
    referer: eventContext.referer,
  };

  context.events.push(event);

  // Process the event for patterns and behavior tracking
  await processEvent(event, context);

  // Clean old events
  cleanOldEvents(context);
}

/**
 * Process a search event for analytics
 */
async function processEvent(
  event: SearchEvent,
  context: EventTrackingContext
): Promise<void> {
  // Update search patterns
  if (context.config.enableTrendAnalysis) {
    updateSearchPatterns(event, context.patterns);
  }

  // Update user behavior
  if (context.config.enableUserBehaviorTracking && event.userId) {
    updateUserBehavior(event, context.userBehaviors);
  }
}

/**
 * Clean old events based on retention policy
 */
function cleanOldEvents(context: EventTrackingContext): void {
  if (context.events.length > 10000) {
    const cutoff = new Date(
      Date.now() - context.config.dataRetentionDays * 24 * 60 * 60 * 1000
    );
    context.events = context.events.filter((event) => event.timestamp >= cutoff);
  }
}
