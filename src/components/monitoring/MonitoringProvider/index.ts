/**
 * MonitoringProvider Module Exports
 *
 * This module provides comprehensive monitoring and analytics:
 * - Sentry error tracking initialization
 * - Analytics tracking (Google Analytics, Mixpanel)
 * - Performance monitoring setup
 * - Web vitals tracking
 * - Error boundary implementation
 * - Global error and unhandled rejection tracking
 */

// Main component
export { MonitoringProviderComponent } from './MonitoringProviderComponent';
export { useMonitoringContext } from './MonitoringProviderComponent';

// Error Boundary
export { MonitoringErrorBoundary } from './components/MonitoringErrorBoundary';

// Types
export type {
  MonitoringContextType,
  MonitoringProviderProps,
  ErrorBoundaryState,
  ErrorBoundaryProps,
  ScriptsLoadedState,
} from './types';

// Hooks
export { useMonitoringInitialization } from './hooks/useMonitoringInitialization';
export { useGlobalErrorHandling } from './hooks/useGlobalErrorHandling';
export { useScriptsLoaded } from './hooks/useScriptsLoaded';

// Components
export { GoogleAnalyticsScript } from './components/GoogleAnalyticsScript';
export { MixpanelScript } from './components/MixpanelScript';
export { ErrorBoundaryFallback } from './components/ErrorBoundaryFallback';
