/**
 * Hook for tracking script loading state
 */

import { useState } from 'react';
import type { ScriptsLoadedState } from '../types';

export function useScriptsLoaded() {
  const [scriptsLoaded, setScriptsLoaded] = useState<ScriptsLoadedState>({
    googleAnalytics: false,
    mixpanel: false,
  });

  const setGoogleAnalyticsLoaded = () => {
    setScriptsLoaded((prev) => ({ ...prev, googleAnalytics: true }));
  };

  const setMixpanelLoaded = () => {
    setScriptsLoaded((prev) => ({ ...prev, mixpanel: true }));
  };

  return {
    scriptsLoaded,
    setGoogleAnalyticsLoaded,
    setMixpanelLoaded,
  };
}
