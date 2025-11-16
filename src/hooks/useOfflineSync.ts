/**
 * useOfflineSync Hook
 * Manages PWA offline/online status and deck synchronization
 */

import { useState, useEffect } from 'react';
import { pwaService } from '@/lib/services/pwaService';

export type SaveStatus = 'saved' | 'saving' | 'offline' | 'error';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  // Load pending sync count from PWA service
  const loadPendingSyncCount = async () => {
    try {
      const offlineDecks = await pwaService.getOfflineDecks();
      setPendingSyncCount(offlineDecks.length);
    } catch (error) {
      console.error('Failed to load pending sync count:', error);
    }
  };

  useEffect(() => {
    // Initial online status
    setIsOnline(navigator.onLine);

    // Event handlers
    const handleOnline = () => {
      setIsOnline(true);
      setSaveStatus('saved');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSaveStatus('offline');
    };

    // PWA service event listeners
    const unsubscribeOnline = pwaService.on('online', (data) => {
      if (data) handleOnline();
    });

    const unsubscribeOffline = pwaService.on('online', (data) => {
      if (!data) handleOffline();
    });

    const unsubscribeDeckSynced = pwaService.on(
      'deckSynced',
      (deck: unknown) => {
        const deckObj = deck as { name?: string };
        console.warn('Deck synced:', deckObj.name);
        loadPendingSyncCount();
      }
    );

    // Browser events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load initial pending sync count
    loadPendingSyncCount();

    return () => {
      unsubscribeOnline();
      unsubscribeOffline();
      unsubscribeDeckSynced();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    pendingSyncCount,
    saveStatus,
    setSaveStatus,
    loadPendingSyncCount,
  };
}
