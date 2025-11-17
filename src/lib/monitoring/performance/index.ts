/**
 * Performance monitoring exports
 */

// Export types
export type {
  PerformanceEntry,
  ResourceUsage,
  PerformanceStats,
  PerformanceThresholds,
  PerformanceWithMemory,
} from './types';

// Export main class
export { PerformanceMonitor } from './PerformanceMonitor';

// Create and export singleton instance
import { PerformanceMonitor } from './PerformanceMonitor';
export const performanceMonitor = new PerformanceMonitor();

// Create and export helper functions
import { createHelpers } from './helpers';
const helpers = createHelpers(performanceMonitor);
export const measureAPI = helpers.measureAPI;
export const measureDB = helpers.measureDB;
export const measureComponent = helpers.measureComponent;
export const measureUserAction = helpers.measureUserAction;
export const measurePerformance = helpers.measurePerformance;

// Export sub-modules (for advanced usage)
export { TimingOperations } from './timingOperations';
export { calculateStats, clearOldEntries } from './statsCalculator';
export { BrowserMonitoring } from './browserMonitoring';
export { ServerMonitoring } from './serverMonitoring';
export { createHelpers } from './helpers';

// Default export
export default performanceMonitor;
