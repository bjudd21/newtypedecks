/**
 * MonitoringProvider - Backward compatibility re-export layer
 *
 * This file maintains backward compatibility for existing imports while
 * the actual implementation has been modularized into MonitoringProvider/
 */

// Main component exports
export {
  MonitoringProviderComponent as MonitoringProvider,
  useMonitoringContext,
} from './MonitoringProvider/MonitoringProviderComponent';
export { MonitoringProviderComponent as default } from './MonitoringProvider/MonitoringProviderComponent';

// Error Boundary export
export { MonitoringErrorBoundary } from './MonitoringProvider/components/MonitoringErrorBoundary';

// Type exports
export type {
  MonitoringContextType,
  MonitoringProviderProps,
  ErrorBoundaryState,
  ErrorBoundaryProps,
  ScriptsLoadedState,
} from './MonitoringProvider/types';

// Hook exports
export { useMonitoringInitialization } from './MonitoringProvider/hooks/useMonitoringInitialization';
export { useGlobalErrorHandling } from './MonitoringProvider/hooks/useGlobalErrorHandling';
export { useScriptsLoaded } from './MonitoringProvider/hooks/useScriptsLoaded';

// Component exports
export { GoogleAnalyticsScript } from './MonitoringProvider/components/GoogleAnalyticsScript';
export { MixpanelScript } from './MonitoringProvider/components/MixpanelScript';
export { ErrorBoundaryFallback } from './MonitoringProvider/components/ErrorBoundaryFallback';
