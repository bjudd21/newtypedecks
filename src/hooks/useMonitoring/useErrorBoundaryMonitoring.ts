/**
 * Error boundary monitoring hook
 * Specialized hook for error boundary monitoring
 */

'use client';

import { useCallback } from 'react';
import { analytics } from '@/lib/monitoring/analytics';
import { errorTracker } from '@/lib/monitoring/sentry';
import type { ReactErrorInfo } from './types';

export function useErrorBoundaryMonitoring(boundaryName: string) {
  const trackBoundaryError = useCallback(
    (error: Error, errorInfo: ReactErrorInfo) => {
      errorTracker.captureException(error, {
        errorBoundary: {
          name: boundaryName,
          componentStack: errorInfo.componentStack,
        },
      });

      analytics.trackEvent({
        name: 'error_boundary_triggered',
        properties: {
          boundaryName,
          errorMessage: error.message,
        },
      });
    },
    [boundaryName]
  );

  return { trackBoundaryError };
}
