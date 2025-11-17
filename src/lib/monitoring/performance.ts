/**
 * Application Performance Monitoring (APM)
 * Tracks application performance, resource usage, and optimization opportunities
 *
 * Re-exports from modularized structure for backward compatibility
 */

// Export types
export type {
  PerformanceEntry,
  ResourceUsage,
  PerformanceStats,
  PerformanceThresholds,
  PerformanceWithMemory,
} from './performance/types';

// Export main class and singleton
export { PerformanceMonitor, performanceMonitor } from './performance/index';

// Export helper functions
export {
  measureAPI,
  measureDB,
  measureComponent,
  measureUserAction,
  measurePerformance,
} from './performance/index';

// Default export
export { default } from './performance/index';
