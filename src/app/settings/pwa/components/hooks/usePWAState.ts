'use client';
/**
 * Custom hook for PWA state management
 */

import { useState, useCallback } from 'react';
import {
  pwaService,
  type PWAState,
  type OfflineDeck,
} from '@/lib/services/pwaService';

export function usePWAState() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: true,
    isServiceWorkerRegistered: false,
    updateAvailable: false,
    cacheSize: 0,
  });
  const [offlineDecks, setOfflineDecks] = useState<OfflineDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadPWAData = useCallback(async () => {
    try {
      const [state, decks] = await Promise.all([
        pwaService.getPWAState(),
        pwaService.getOfflineDecks(),
      ]);

      setPwaState(state);
      setOfflineDecks(decks);
    } catch (error) {
      console.error('Failed to load PWA data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadOfflineData = useCallback(async () => {
    try {
      const decks = await pwaService.getOfflineDecks();
      setOfflineDecks(decks);
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }, []);

  return {
    pwaState,
    setPwaState,
    offlineDecks,
    isLoading,
    actionLoading,
    setActionLoading,
    loadPWAData,
    loadOfflineData,
  };
}
