/**
 * Custom hook for managing PWA state and event subscriptions
 */

import { useState, useEffect } from 'react';
import { pwaService, type PWAState } from '@/lib/services/pwaService';

export function usePWAState() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: true,
    isServiceWorkerRegistered: false,
    updateAvailable: false,
    cacheSize: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pendingSync, setPendingSync] = useState<number>(0);

  const loadPWAState = async () => {
    try {
      const state = await pwaService.getPWAState();
      setPwaState(state);
    } catch (error) {
      console.error('Failed to load PWA state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingSyncData = async () => {
    try {
      const [offlineDecks, collectionUpdates] = await Promise.all([
        pwaService.getOfflineDecks(),
        pwaService.getOfflineCollectionUpdates(),
      ]);

      setPendingSync(offlineDecks.length + collectionUpdates.length);
    } catch (error) {
      console.error('Failed to load pending sync data:', error);
    }
  };

  useEffect(() => {
    loadPWAState();

    // Listen for PWA events
    const unsubscribeOnline = pwaService.on('online', (data: unknown) => {
      setPwaState((prev) => ({
        ...prev,
        isOnline: data as boolean,
      }));
    });

    const unsubscribeUpdate = pwaService.on(
      'updateAvailable',
      (data: unknown) => {
        setPwaState((prev) => ({
          ...prev,
          updateAvailable: data as boolean,
        }));
      }
    );

    const unsubscribeCacheSize = pwaService.on('cacheSize', (data: unknown) => {
      setPwaState((prev) => ({
        ...prev,
        cacheSize: data as number,
      }));
    });

    const unsubscribeSynced = pwaService.on('deckSynced', () => {
      loadPendingSyncData();
    });

    // Load pending sync data
    loadPendingSyncData();

    return () => {
      unsubscribeOnline();
      unsubscribeUpdate();
      unsubscribeCacheSize();
      unsubscribeSynced();
    };
  }, []);

  return {
    pwaState,
    isLoading,
    pendingSync,
    loadPWAState,
  };
}
