/**
 * Collection query operations
 * Handles querying card quantities from collection
 */

'use client';

import { useCallback } from 'react';
import type { Collection } from './types';

export function useCollectionQueries(
  isAuthenticated: boolean,
  getCollection: () => Promise<Collection | null>
) {
  const getCardQuantity = useCallback(
    async (cardId: string): Promise<number> => {
      if (!isAuthenticated) {
        return 0;
      }

      try {
        const collection = await getCollection();
        if (!collection) return 0;

        const collectionCard = collection.cards.find(
          (cc) => cc.cardId === cardId
        );
        return collectionCard?.quantity || 0;
      } catch (error) {
        console.error('Error getting card quantity:', error);
        return 0;
      }
    },
    [isAuthenticated, getCollection]
  );

  const getCardQuantities = useCallback(
    async (cardIds: string[]): Promise<Record<string, number>> => {
      if (!isAuthenticated || cardIds.length === 0) {
        return {};
      }

      try {
        const collection = await getCollection();
        if (!collection) return {};

        const quantities: Record<string, number> = {};
        cardIds.forEach((cardId) => {
          const collectionCard = collection.cards.find(
            (cc) => cc.cardId === cardId
          );
          quantities[cardId] = collectionCard?.quantity || 0;
        });

        return quantities;
      } catch (error) {
        console.error('Error getting card quantities:', error);
        return {};
      }
    },
    [isAuthenticated, getCollection]
  );

  return {
    getCardQuantity,
    getCardQuantities,
  };
}
