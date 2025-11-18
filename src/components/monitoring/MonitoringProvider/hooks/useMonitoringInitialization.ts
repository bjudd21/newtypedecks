'use client';
/**
 * Hook for initializing monitoring services
 */

import { useEffect, useState } from 'react';
import { initSentry } from '@/lib/monitoring/sentry';
import { initAnalytics, trackWebVitals } from '@/lib/monitoring/analytics';
import { logger } from '@/lib/monitoring/logger';

interface UseMonitoringInitializationOptions {
  enableSentry: boolean;
  enableAnalytics: boolean;
  enablePerformanceMonitoring: boolean;
}

export function useMonitoringInitialization({
  enableSentry,
  enableAnalytics,
  enablePerformanceMonitoring,
}: UseMonitoringInitializationOptions) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMonitoring = async () => {
      try {
        // Initialize Sentry
        if (enableSentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
          initSentry();
          logger.info('Sentry initialized');
        }

        // Initialize performance monitoring
        if (enablePerformanceMonitoring) {
          trackWebVitals();
          logger.info('Performance monitoring initialized');
        }

        // Initialize analytics
        if (enableAnalytics) {
          initAnalytics();
          logger.info('Analytics initialized');
        }

        setIsInitialized(true);
      } catch (error) {
        logger.error('Failed to initialize monitoring', error as Error);
      }
    };

    initializeMonitoring();
  }, [enableSentry, enableAnalytics, enablePerformanceMonitoring]);

  return { isInitialized };
}
