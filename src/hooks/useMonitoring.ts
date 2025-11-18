'use client';

/**
 * React hook for client-side monitoring and analytics
 * Provides easy integration of monitoring capabilities into React components
 *
 * Re-exports from modularized structure for backward compatibility
 */

// Export types
export type {
  UseMonitoringOptions,
  MonitoringHookResult,
  ReactErrorInfo,
} from './useMonitoring/types';

// Export hooks
export { useMonitoring } from './useMonitoring/useBaseMonitoring';
export { usePageMonitoring } from './useMonitoring/usePageMonitoring';
export { useAPIMonitoring } from './useMonitoring/useAPIMonitoring';
export { useFormMonitoring } from './useMonitoring/useFormMonitoring';
export { useErrorBoundaryMonitoring } from './useMonitoring/useErrorBoundaryMonitoring';

// Default export
export { useMonitoring as default } from './useMonitoring/useBaseMonitoring';
