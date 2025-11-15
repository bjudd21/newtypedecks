/**
 * Search Pattern Processing
 */

import type { SearchEvent, SearchPattern } from '../types';
import { generatePatternKey } from '../utils';

/**
 * Update search patterns based on event
 */
export function updateSearchPatterns(
  event: SearchEvent,
  patterns: Map<string, SearchPattern>
): void {
  const patternKey = generatePatternKey(event.filters);
  const existingPattern = patterns.get(patternKey);

  if (existingPattern) {
    // Update existing pattern
    existingPattern.count++;
    existingPattern.avgResponseTime =
      (existingPattern.avgResponseTime * (existingPattern.count - 1) +
        event.responseTime) /
      existingPattern.count;
    existingPattern.avgResultCount =
      (existingPattern.avgResultCount * (existingPattern.count - 1) +
        event.resultCount) /
      existingPattern.count;
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
      uniqueUsers: new Set(event.userId ? [event.userId] : []),
    };

    patterns.set(patternKey, newPattern);
  }
}
