/**
 * Main Performance Monitor class
 * Orchestrates all performance monitoring operations
 */

import type {
  PerformanceEntry,
  ResourceUsage,
  PerformanceThresholds,
} from './types';
import { TimingOperations } from './timingOperations';
import { calculateStats, clearOldEntries } from './statsCalculator';
import { BrowserMonitoring } from './browserMonitoring';
import { ServerMonitoring } from './serverMonitoring';

export class PerformanceMonitor {
  private entries: PerformanceEntry[] = [];
  private activeTimers: Map<string, number> = new Map();
  private thresholds: PerformanceThresholds = {
    api: 2000, // 2 seconds
    database: 1000, // 1 second
    component: 100, // 100ms
    page: 3000, // 3 seconds
    'user-action': 500, // 500ms
  };

  private timingOps: TimingOperations;
  private browserMonitoring: BrowserMonitoring;
  private serverMonitoring: ServerMonitoring;

  constructor() {
    this.timingOps = new TimingOperations(
      this.entries,
      this.activeTimers,
      this.thresholds
    );
    this.browserMonitoring = new BrowserMonitoring();
    this.serverMonitoring = new ServerMonitoring();

    if (typeof window !== 'undefined') {
      this.browserMonitoring.initBrowserMonitoring();
    } else {
      this.serverMonitoring.initServerMonitoring();
    }
  }

  // Start performance timing
  startTiming(
    name: string,
    type: PerformanceEntry['type'],
    metadata?: Record<string, unknown>
  ): string {
    return this.timingOps.startTiming(name, type, metadata);
  }

  // End performance timing
  endTiming(
    timerId: string,
    metadata?: Record<string, unknown>
  ): PerformanceEntry | null {
    return this.timingOps.endTiming(timerId, metadata);
  }

  // Measure function execution time
  measure<T>(
    name: string,
    type: PerformanceEntry['type'],
    fn: () => T | Promise<T>,
    metadata?: Record<string, unknown>
  ): T | Promise<T> {
    return this.timingOps.measure(name, type, fn, metadata);
  }

  // Get performance statistics
  getStats(type?: PerformanceEntry['type'], name?: string) {
    return calculateStats(this.entries, type, name);
  }

  // Get current resource usage
  getResourceUsage(): ResourceUsage | null {
    if (typeof window !== 'undefined') {
      return this.browserMonitoring.getBrowserResourceUsage();
    } else if (typeof process !== 'undefined') {
      return this.serverMonitoring.getServerResourceUsage();
    }
    return null;
  }

  // Clear old entries
  clearOldEntries(olderThanMinutes: number = 60) {
    this.entries = clearOldEntries(this.entries, olderThanMinutes);
  }

  // Export performance data
  exportData() {
    return {
      entries: this.entries,
      stats: {
        api: this.getStats('api'),
        database: this.getStats('database'),
        component: this.getStats('component'),
        page: this.getStats('page'),
        userAction: this.getStats('user-action'),
      },
      resourceUsage: this.getResourceUsage(),
      thresholds: this.thresholds,
    };
  }
}
