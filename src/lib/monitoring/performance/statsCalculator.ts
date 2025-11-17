/**
 * Performance statistics calculator
 * Calculates stats from performance entries
 */

import type { PerformanceEntry, PerformanceStats } from './types';

export function calculateStats(
  entries: PerformanceEntry[],
  type?: PerformanceEntry['type'],
  name?: string
): PerformanceStats | null {
  let filtered = entries;

  if (type) {
    filtered = filtered.filter((entry) => entry.type === type);
  }

  if (name) {
    filtered = filtered.filter((entry) => entry.name === name);
  }

  if (filtered.length === 0) {
    return null;
  }

  const durations = filtered.map((entry) => entry.duration);
  const sorted = [...durations].sort((a, b) => a - b);

  return {
    count: filtered.length,
    min: Math.min(...durations),
    max: Math.max(...durations),
    avg: durations.reduce((sum, d) => sum + d, 0) / durations.length,
    median: sorted[Math.floor(sorted.length / 2)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
    recent: filtered.slice(-10),
  };
}

export function clearOldEntries(
  entries: PerformanceEntry[],
  olderThanMinutes: number = 60
): PerformanceEntry[] {
  const cutoff = Date.now() - olderThanMinutes * 60 * 1000;
  return entries.filter((entry) => entry.endTime > cutoff);
}
