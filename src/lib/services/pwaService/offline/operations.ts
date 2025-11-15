/**
 * Offline Data Operations
 */

import type {
  OfflineDeck,
  OfflineCollectionUpdate,
  ServiceWorkerRegistrationWithSync,
} from '../types';
import { storeOfflineData, getOfflineData } from './indexedDB';

export async function saveOfflineDeck(
  deck: Omit<OfflineDeck, 'synced'>
): Promise<void> {
  const deckData: OfflineDeck = {
    ...deck,
    synced: false,
  };

  await storeOfflineData('pending-deck-saves', deckData);

  // Register background sync if available
  if (
    'serviceWorker' in navigator &&
    'sync' in window.ServiceWorkerRegistration.prototype
  ) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        await (
          registration as ServiceWorkerRegistrationWithSync
        ).sync?.register('sync-deck-saves');
      }
    } catch (error) {
      console.warn('Background sync registration failed:', error);
    }
  }
}

export async function saveOfflineCollectionUpdate(
  update: Omit<OfflineCollectionUpdate, 'synced'>
): Promise<void> {
  const updateData: OfflineCollectionUpdate = {
    ...update,
    synced: false,
  };

  await storeOfflineData('pending-collection-updates', updateData);

  // Register background sync if available
  if (
    'serviceWorker' in navigator &&
    'sync' in window.ServiceWorkerRegistration.prototype
  ) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        await (
          registration as ServiceWorkerRegistrationWithSync
        ).sync?.register('sync-collection-updates');
      }
    } catch (error) {
      console.warn('Background sync registration failed:', error);
    }
  }
}

export async function getOfflineDecks(): Promise<OfflineDeck[]> {
  return await getOfflineData('pending-deck-saves');
}

export async function getOfflineCollectionUpdates(): Promise<
  OfflineCollectionUpdate[]
> {
  return await getOfflineData('pending-collection-updates');
}
