/**
 * Base monitoring hook
 * Main monitoring hook with all core functionality
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { analytics, businessMetrics } from '@/lib/monitoring/analytics';
import {
  performanceMonitor,
  measureComponent,
} from '@/lib/monitoring/performance';
import { errorTracker } from '@/lib/monitoring/sentry';
import type { UseMonitoringOptions, MonitoringHookResult } from './types';

export function useMonitoring(
  options: UseMonitoringOptions = {}
): MonitoringHookResult {
  const {
    componentName = 'UnknownComponent',
    trackPageViews = true,
    trackUserActions = true,
    trackPerformance = true,
    trackErrors = true,
  } = options;

  const _router = useRouter();
  const { data: session } = useSession();
  const mountTimeRef = useRef(Date.now());
  const activeTimersRef = useRef<Map<string, number>>(new Map());

  // Track page views
  useEffect(() => {
    if (!trackPageViews) return;

    const handleRouteChange = (url: string) => {
      analytics.trackPageView(url, session?.user?.id);
      businessMetrics.trackPageLoad(
        url,
        Date.now() - mountTimeRef.current,
        session?.user?.id
      );
    };

    // Track initial page load
    handleRouteChange(window.location.pathname);

    // Listen for route changes (Next.js app router doesn't have router events like pages router)
    // We'll track via performance observer for navigation
    if ('navigation' in performance) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            handleRouteChange(window.location.pathname);
          }
        }
      });
      observer.observe({ entryTypes: ['navigation'] });

      return () => observer.disconnect();
    }
  }, [trackPageViews, session?.user?.id]);

  // Track component lifecycle
  useEffect(() => {
    if (!trackPerformance) return;

    const componentMountTime = Date.now();

    // Track component mount time
    performanceMonitor.measure(
      `${componentName} Mount`,
      'component',
      () => Promise.resolve(),
      { component: componentName }
    );

    return () => {
      // Track component unmount and lifetime
      const lifetime = Date.now() - componentMountTime;
      performanceMonitor.measure(
        `${componentName} Lifetime`,
        'component',
        () => Promise.resolve(),
        { component: componentName, lifetime }
      );
    };
  }, [componentName, trackPerformance]);

  // Set user context when session changes
  useEffect(() => {
    if (session?.user) {
      errorTracker.setUser({
        id: session.user.id || 'unknown',
        email: session.user.email || undefined,
        username: session.user.name || undefined,
      });

      analytics.setUser(session.user.id || 'unknown', {
        email: session.user.email,
        name: session.user.name,
        lastLogin: new Date().toISOString(),
      });
    }
  }, [session]);

  // Error boundary effect
  useEffect(() => {
    if (!trackErrors) return;

    const handleError = (event: ErrorEvent) => {
      errorTracker.captureException(event.error, {
        component: componentName,
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      errorTracker.captureException(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          component: componentName,
          url: window.location.href,
          reason: event.reason,
        }
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, [componentName, trackErrors]);

  // Track custom events
  const trackEvent = useCallback(
    (eventName: string, properties?: Record<string, unknown>) => {
      analytics.trackEvent({
        name: eventName,
        properties: {
          component: componentName,
          ...properties,
        },
        userId: session?.user?.id,
      });
    },
    [componentName, session?.user?.id]
  );

  // Track user actions
  const trackUserAction = useCallback(
    (action: string, resource: string, metadata?: Record<string, unknown>) => {
      if (!trackUserActions) return;

      analytics.trackUserAction(action, resource, session?.user?.id, {
        component: componentName,
        ...metadata,
      });

      errorTracker.addBreadcrumb(`User ${action} on ${resource}`, 'user', {
        component: componentName,
        ...metadata,
      });
    },
    [componentName, session?.user?.id, trackUserActions]
  );

  // Track errors
  const trackError = useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      if (!trackErrors) return;

      errorTracker.captureException(error, {
        component: componentName,
        userId: session?.user?.id,
        url: window.location.href,
        ...context,
      });
    },
    [componentName, session?.user?.id, trackErrors]
  );

  // Track performance
  const trackPerformanceCallback = useCallback(
    <T>(name: string, fn: () => T | Promise<T>): T | Promise<T> => {
      if (!trackPerformance) return fn();

      return measureComponent(`${componentName}: ${name}`, fn, {
        component: componentName,
        userId: session?.user?.id,
      });
    },
    [componentName, session?.user?.id, trackPerformance]
  );

  // Start/stop timing
  const startTiming = useCallback(
    (name: string) => {
      const timerId = `${componentName}:${name}:${Date.now()}`;
      const startTime = performance.now();
      activeTimersRef.current.set(timerId, startTime);

      return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        performanceMonitor.measure(
          `${componentName}: ${name}`,
          'component',
          () => Promise.resolve(),
          { component: componentName, duration }
        );

        activeTimersRef.current.delete(timerId);
      };
    },
    [componentName]
  );

  // Set user context
  const setUserContext = useCallback(
    (context: Record<string, unknown>) => {
      errorTracker.setContext('user', {
        component: componentName,
        ...context,
      });
    },
    [componentName]
  );

  return {
    trackEvent,
    trackUserAction,
    trackError,
    trackPerformance: trackPerformanceCallback,
    startTiming,
    setUserContext,
  };
}
