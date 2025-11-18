/**
 * React hooks for client-side monitoring and analytics
 * Export all monitoring hooks
 */

// Export types
export type {
  UseMonitoringOptions,
  MonitoringHookResult,
  ReactErrorInfo,
} from './types';

// Export hooks
export { useMonitoring } from './useBaseMonitoring';
export { usePageMonitoring } from './usePageMonitoring';
export { useAPIMonitoring } from './useAPIMonitoring';
export { useFormMonitoring } from './useFormMonitoring';
export { useErrorBoundaryMonitoring } from './useErrorBoundaryMonitoring';
