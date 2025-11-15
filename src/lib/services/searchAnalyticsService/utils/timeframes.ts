/**
 * Timeframe Utilities
 */

/**
 * Get cutoff date for a given timeframe
 */
export function getTimeframeCutoff(
  timeframe: 'hour' | 'day' | 'week' | 'month'
): Date {
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

/**
 * Get bucket size in milliseconds for a given timeframe
 */
export function getBucketSize(
  timeframe: 'hour' | 'day' | 'week' | 'month'
): number {
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
