'use client';
/**
 * Custom hook for PWA action handlers
 */

import { useCallback } from 'react';
import { pwaService } from '@/lib/services/pwaService';

interface UsePWAHandlersOptions {
  setActionLoading: (action: string | null) => void;
  loadPWAData: () => Promise<void>;
}

export function usePWAHandlers({
  setActionLoading,
  loadPWAData,
}: UsePWAHandlersOptions) {
  const handleInstallApp = useCallback(async () => {
    setActionLoading('install');
    try {
      const success = await pwaService.showInstallPrompt();
      if (success) {
        await loadPWAData();
      }
    } catch (error) {
      console.error('Failed to install app:', error);
    } finally {
      setActionLoading(null);
    }
  }, [setActionLoading, loadPWAData]);

  const handleUpdateApp = useCallback(async () => {
    setActionLoading('update');
    try {
      await pwaService.updateServiceWorker();
    } catch (error) {
      console.error('Failed to update app:', error);
    } finally {
      setActionLoading(null);
    }
  }, [setActionLoading]);

  const handleClearCache = useCallback(async () => {
    // TODO: Replace with proper confirmation dialog component
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      'Are you sure you want to clear the cache? This will remove all cached content and may require re-downloading data.'
    );
    if (!confirmed) {
      return;
    }

    setActionLoading('clearCache');
    try {
      await pwaService.clearCache();
      await loadPWAData();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setActionLoading(null);
    }
  }, [setActionLoading, loadPWAData]);

  const handleUnregisterSW = useCallback(async () => {
    // TODO: Replace with proper confirmation dialog component
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      'Are you sure you want to disable offline features? The app will no longer work offline.'
    );
    if (!confirmed) {
      return;
    }

    setActionLoading('unregister');
    try {
      await pwaService.unregisterServiceWorker();
      window.location.reload();
    } catch (error) {
      console.error('Failed to unregister service worker:', error);
    } finally {
      setActionLoading(null);
    }
  }, [setActionLoading]);

  return {
    handleInstallApp,
    handleUpdateApp,
    handleClearCache,
    handleUnregisterSW,
  };
}
