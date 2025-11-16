/**
 * Monitoring Provider Component
 * Initializes and provides monitoring context throughout the application
 */

'use client';

import React, { createContext, useContext } from 'react';
import { errorTracker } from '@/lib/monitoring/sentry';
import { analytics } from '@/lib/monitoring/analytics';
import { performanceMonitor } from '@/lib/monitoring/performance';
import { useMonitoringInitialization } from './hooks/useMonitoringInitialization';
import { useGlobalErrorHandling } from './hooks/useGlobalErrorHandling';
import { useScriptsLoaded } from './hooks/useScriptsLoaded';
import { GoogleAnalyticsScript } from './components/GoogleAnalyticsScript';
import { MixpanelScript } from './components/MixpanelScript';
import type {
  MonitoringContextType,
  MonitoringProviderProps,
} from './types';

const MonitoringContext = createContext<MonitoringContextType | undefined>(
  undefined
);

export function useMonitoringContext() {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error(
      'useMonitoringContext must be used within a MonitoringProvider'
    );
  }
  return context;
}

export function MonitoringProviderComponent({
  children,
  enableSentry = true,
  enableAnalytics = true,
  enablePerformanceMonitoring = true,
}: MonitoringProviderProps) {
  // Initialize monitoring services
  const { isInitialized } = useMonitoringInitialization({
    enableSentry,
    enableAnalytics,
    enablePerformanceMonitoring,
  });

  // Track global errors
  useGlobalErrorHandling(isInitialized);

  // Track script loading state
  const { setGoogleAnalyticsLoaded, setMixpanelLoaded } = useScriptsLoaded();

  // Context value
  const contextValue: MonitoringContextType = {
    isInitialized,
    trackError: (error: Error, context?: Record<string, unknown>) => {
      errorTracker.captureException(error, context);
    },
    trackEvent: (name: string, properties?: Record<string, unknown>) => {
      analytics.trackEvent({ name, properties });
    },
    trackPerformance: (
      name: string,
      duration: number,
      metadata?: Record<string, unknown>
    ) => {
      performanceMonitor.measure(
        name,
        'component',
        () => Promise.resolve(),
        metadata
      );
    },
  };

  return (
    <MonitoringContext.Provider value={contextValue}>
      {/* Google Analytics */}
      {enableAnalytics && (
        <GoogleAnalyticsScript onLoad={setGoogleAnalyticsLoaded} />
      )}

      {/* Mixpanel */}
      {enableAnalytics && <MixpanelScript onLoad={setMixpanelLoaded} />}

      {children}
    </MonitoringContext.Provider>
  );
}

export default MonitoringProviderComponent;
