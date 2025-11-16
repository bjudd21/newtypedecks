/**
 * Custom hook for PWA event listeners
 */

import { useEffect } from 'react';
import { pwaService, type PWAState } from '@/lib/services/pwaService';

interface UsePWAEventListenersOptions {
  setPwaState: React.Dispatch<React.SetStateAction<PWAState>>;
  loadOfflineData: () => Promise<void>;
}

export function usePWAEventListeners({
  setPwaState,
  loadOfflineData,
}: UsePWAEventListenersOptions) {
  useEffect(() => {
    // Listen for online/offline events
    const unsubscribeOnline = pwaService.on('online', (data) => {
      const isOnline = data as boolean;
      setPwaState((prev) => ({ ...prev, isOnline }));
      if (isOnline) {
        loadOfflineData();
      }
    });

    // Listen for deck sync events
    const unsubscribeSynced = pwaService.on('deckSynced', () => {
      loadOfflineData();
    });

    // Listen for cache cleared events
    const unsubscribeCacheCleared = pwaService.on('cacheCleared', () => {
      setPwaState((prev) => ({ ...prev, cacheSize: 0 }));
    });

    return () => {
      unsubscribeOnline();
      unsubscribeSynced();
      unsubscribeCacheCleared();
    };
  }, [setPwaState, loadOfflineData]);
}
