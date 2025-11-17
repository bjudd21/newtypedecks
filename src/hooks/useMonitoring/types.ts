/**
 * Type definitions for monitoring hooks
 */

export interface UseMonitoringOptions {
  componentName?: string;
  trackPageViews?: boolean;
  trackUserActions?: boolean;
  trackPerformance?: boolean;
  trackErrors?: boolean;
}

export interface MonitoringHookResult {
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => void;
  trackUserAction: (
    action: string,
    resource: string,
    metadata?: Record<string, unknown>
  ) => void;
  trackError: (error: Error, context?: Record<string, unknown>) => void;
  trackPerformance: <T>(
    name: string,
    fn: () => T | Promise<T>
  ) => T | Promise<T>;
  startTiming: (name: string) => () => void;
  setUserContext: (context: Record<string, unknown>) => void;
}

// React error info interface
export interface ReactErrorInfo {
  componentStack?: string;
  digest?: string;
}
