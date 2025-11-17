/**
 * API monitoring hook
 * Specialized hook for API call monitoring
 */

'use client';

import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { analytics, businessMetrics } from '@/lib/monitoring/analytics';
import { errorTracker } from '@/lib/monitoring/sentry';

export function useAPIMonitoring() {
  const { data: session } = useSession();

  const trackAPICall = useCallback(
    async <T>(
      endpoint: string,
      method: string,
      apiCall: () => Promise<T>
    ): Promise<T> => {
      const startTime = performance.now();

      try {
        const result = await apiCall();
        const duration = performance.now() - startTime;

        businessMetrics.trackAPIResponse(endpoint, method, duration, true);

        analytics.trackEvent({
          name: 'api_call',
          properties: {
            endpoint,
            method,
            duration,
            success: true,
          },
          userId: session?.user?.id,
        });

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;

        businessMetrics.trackAPIResponse(endpoint, method, duration, false);

        errorTracker.captureException(error as Error, {
          api: {
            endpoint,
            method,
            duration,
            success: false,
          },
        });

        analytics.trackEvent({
          name: 'api_error',
          properties: {
            endpoint,
            method,
            duration,
            error: (error as Error).message,
          },
          userId: session?.user?.id,
        });

        throw error;
      }
    },
    [session?.user?.id]
  );

  return { trackAPICall };
}
