/**
 * Sync Operations
 */

import type { OfflineDeck, OfflineCollectionUpdate } from '../types';
import type { EventEmitter } from '../events/eventEmitter';
import { removeOfflineData } from '../offline/indexedDB';
import { getOfflineDecks, getOfflineCollectionUpdates } from '../offline/operations';

export async function syncDeck(
  deck: OfflineDeck,
  emitter: EventEmitter
): Promise<void> {
  try {
    const response = await fetch('/api/decks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: deck.name,
        cards: deck.cards,
      }),
    });

    if (response.ok) {
      // Mark as synced and remove from offline storage
      await removeOfflineData('pending-deck-saves', deck.id);
      emitter.emit('deckSynced', deck);
    }
  } catch (error) {
    console.error('Failed to sync deck:', error);
  }
}

export async function syncCollectionUpdate(
  update: OfflineCollectionUpdate,
  emitter: EventEmitter
): Promise<void> {
  try {
    const response = await fetch('/api/collections', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardId: update.cardId,
        quantity: update.quantity,
      }),
    });

    if (response.ok) {
      // Mark as synced and remove from offline storage
      await removeOfflineData('pending-collection-updates', update.id);
      emitter.emit('collectionUpdateSynced', update);
    }
  } catch (error) {
    console.error('Failed to sync collection update:', error);
  }
}

export async function syncOfflineData(emitter: EventEmitter): Promise<void> {
  try {
    // Sync deck saves
    const offlineDecks = await getOfflineDecks();
    for (const deck of offlineDecks) {
      if (!deck.synced) {
        await syncDeck(deck, emitter);
      }
    }

    // Sync collection updates
    const collectionUpdates = await getOfflineCollectionUpdates();
    for (const update of collectionUpdates) {
      if (!update.synced) {
        await syncCollectionUpdate(update, emitter);
      }
    }

    console.warn('Offline data sync completed');
  } catch (error) {
    console.error('Offline data sync failed:', error);
  }
}
