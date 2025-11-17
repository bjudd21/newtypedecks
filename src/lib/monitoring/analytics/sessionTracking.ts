/**
 * Session tracking
 * Tracks user session duration and engagement
 */

import type { AnalyticsProvider } from './AnalyticsProvider';

export function createSessionTracker(analytics: AnalyticsProvider) {
  return function trackSession() {
    if (typeof window === 'undefined') return;

    const sessionStart = Date.now();
    let pageViews = 0;
    let userActions = 0;

    // Track session start
    analytics.trackEvent({
      name: 'session_start',
      properties: {
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        timestamp: new Date(sessionStart),
      },
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const sessionDuration = Date.now() - sessionStart;
        analytics.trackEvent({
          name: 'session_end',
          properties: {
            session_duration: sessionDuration,
            page_views: pageViews,
            user_actions: userActions,
          },
        });
      }
    });

    // Track before unload
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - sessionStart;
      analytics.trackEvent({
        name: 'session_end',
        properties: {
          session_duration: sessionDuration,
          page_views: pageViews,
          user_actions: userActions,
        },
      });
    });

    return {
      incrementPageViews: () => pageViews++,
      incrementUserActions: () => userActions++,
      getSessionDuration: () => Date.now() - sessionStart,
    };
  };
}
