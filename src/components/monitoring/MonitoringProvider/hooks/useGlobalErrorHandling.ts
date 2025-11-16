/**
 * Hook for handling global errors
 */

import { useEffect } from 'react';
import { errorTracker } from '@/lib/monitoring/sentry';

export function useGlobalErrorHandling(isInitialized: boolean) {
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
}
