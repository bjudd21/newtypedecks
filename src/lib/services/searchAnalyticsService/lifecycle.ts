/**
 * Search Analytics Lifecycle Management
 * Handles periodic data processing and cleanup
 */

import type { AnalyticsConfig } from './types';
import type { EventTrackingContext } from './eventTracking';

/**
 * Start periodic data processing
 */
export function startPeriodicProcessing(
  config: AnalyticsConfig,
  context: EventTrackingContext
): void {
  // Process analytics data periodically
  setInterval(
    () => {
      cleanOldEvents(context);
      // Could add more periodic processing here
    },
    config.aggregationInterval * 60 * 1000
  );
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
