/**
 * Custom hook for PWA action handlers
 */

import { useCallback } from 'react';
import { pwaService } from '@/lib/services/pwaService';

export function usePWAHandlers(loadPWAState: () => Promise<void>) {
  const handleUpdateApp = useCallback(async () => {
    try {
      await pwaService.updateServiceWorker();
    } catch (error) {
      console.error('Failed to update app:', error);
    }
  }, []);

  const handleClearCache = useCallback(async () => {
    try {
      await pwaService.clearCache();
      loadPWAState();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }, [loadPWAState]);

  const handleInstallApp = useCallback(async () => {
    try {
      await pwaService.showInstallPrompt();
    } catch (error) {
      console.error('Failed to show install prompt:', error);
    }
  }, []);

  return {
    handleUpdateApp,
    handleClearCache,
    handleInstallApp,
  };
}
