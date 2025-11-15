/**
 * User Behavior Processing
 */

import type { SearchEvent, UserSearchBehavior } from '../types';

/**
 * Update user behavior tracking
 */
export function updateUserBehavior(
  event: SearchEvent,
  userBehaviors: Map<string, UserSearchBehavior>
): void {
  if (!event.userId) return;

  const existingBehavior = userBehaviors.get(event.userId);

  if (existingBehavior) {
    // Update existing behavior
    existingBehavior.totalSearches++;
    existingBehavior.avgResponseTime =
      (existingBehavior.avgResponseTime *
        (existingBehavior.totalSearches - 1) +
        event.responseTime) /
      existingBehavior.totalSearches;

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
      preferredSortOrder:
        event.options.sortBy && event.options.sortOrder
          ? `${event.options.sortBy}:${event.options.sortOrder}`
          : 'name:asc',
    };

    userBehaviors.set(event.userId, newBehavior);
  }
}
