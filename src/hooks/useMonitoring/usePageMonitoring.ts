/**
 * Page monitoring hook
 * Specialized hook for page-level monitoring
 */

'use client';

import { useCallback } from 'react';
import { useMonitoring } from './useBaseMonitoring';

export function usePageMonitoring(pageName: string) {
  const monitoring = useMonitoring({
    componentName: `Page:${pageName}`,
    trackPageViews: true,
    trackPerformance: true,
  });

  const trackPageAction = useCallback(
    (action: string, metadata?: Record<string, unknown>) => {
      monitoring.trackUserAction(action, 'page', {
        page: pageName,
        ...metadata,
      });
    },
    [monitoring, pageName]
  );

  return {
    ...monitoring,
    trackPageAction,
  };
}
