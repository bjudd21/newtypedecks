/**
 * Monitoring Provider Component
 * Initializes and provides monitoring context throughout the application
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Script from 'next/script';
import { initSentry, errorTracker } from '@/lib/monitoring/sentry';
import {
  analytics,
  initAnalytics,
  trackWebVitals,
} from '@/lib/monitoring/analytics';
import { performanceMonitor } from '@/lib/monitoring/performance';
import { logger } from '@/lib/monitoring/logger';

interface MonitoringContextType {
  isInitialized: boolean;
  trackError: (error: Error, context?: Record<string, unknown>) => void;
  trackEvent: (name: string, properties?: Record<string, unknown>) => void;
  trackPerformance: (
    name: string,
    duration: number,
    metadata?: Record<string, unknown>
  ) => void;
}

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

interface MonitoringProviderProps {
  children: React.ReactNode;
  enableSentry?: boolean;
  enableAnalytics?: boolean;
  enablePerformanceMonitoring?: boolean;
}

export function MonitoringProvider({
  children,
  enableSentry = true,
  enableAnalytics = true,
  enablePerformanceMonitoring = true,
}: MonitoringProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [_scriptsLoaded, setScriptsLoaded] = useState({
    googleAnalytics: false,
    mixpanel: false,
  });

  // Initialize monitoring services
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

  // Track global errors
  useEffect(() => {
    if (!isInitialized) return;

    const handleGlobalError = (event: ErrorEvent) => {
      errorTracker.captureException(event.error, {
        global: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          message: event.message,
        },
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      errorTracker.captureException(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          global: {
            reason: event.reason,
            type: 'unhandledrejection',
          },
        }
      );
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, [isInitialized]);

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
      {enableAnalytics && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            strategy="afterInteractive"
            onLoad={() => {
              setScriptsLoaded((prev) => ({ ...prev, googleAnalytics: true }));
            }}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {/* Mixpanel */}
      {enableAnalytics && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN && (
        <Script
          id="mixpanel"
          strategy="afterInteractive"
          onLoad={() => {
            setScriptsLoaded((prev) => ({ ...prev, mixpanel: true }));
          }}
        >
          {`
            (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
            mixpanel.init('${process.env.NEXT_PUBLIC_MIXPANEL_TOKEN}', {
              debug: ${process.env.NODE_ENV === 'development'},
              track_pageview: true,
              persistence: 'localStorage',
            });
          `}
        </Script>
      )}

      {children}
    </MonitoringContext.Provider>
  );
}

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class MonitoringErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error }>;
  },
  ErrorBoundaryState
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error }>;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Track error in monitoring systems
    errorTracker.captureException(error, {
      errorBoundary: {
        componentStack: errorInfo.componentStack,
        errorBoundary: 'MonitoringErrorBoundary',
      },
    });

    analytics.trackEvent({
      name: 'react_error_boundary',
      properties: {
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack,
      },
    });

    logger.error('React Error Boundary caught error', error, {
      context: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} />;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800">
                  Something went wrong
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    We&apos;re sorry, but something unexpected happened. The
                    error has been reported and we&apos;re working to fix it.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm leading-4 font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                    onClick={() => window.location.reload()}
                  >
                    Reload page
                  </button>
                </div>
              </div>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600">
                  Error details (development only)
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-gray-500">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MonitoringProvider;
