/**
 * MonitoringProvider types
 */

export interface MonitoringContextType {
  isInitialized: boolean;
  trackError: (error: Error, context?: Record<string, unknown>) => void;
  trackEvent: (name: string, properties?: Record<string, unknown>) => void;
  trackPerformance: (
    name: string,
    duration: number,
    metadata?: Record<string, unknown>
  ) => void;
}

export interface MonitoringProviderProps {
  children: React.ReactNode;
  enableSentry?: boolean;
  enableAnalytics?: boolean;
  enablePerformanceMonitoring?: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

export interface ScriptsLoadedState {
  googleAnalytics: boolean;
  mixpanel: boolean;
}
