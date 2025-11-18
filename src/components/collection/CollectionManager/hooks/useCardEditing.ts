'use client';
/**
 * Hook for card editing operations
 */

import { useCallback } from 'react';
import type { CollectionCard } from '../types';
import { DEFAULT_CONDITION } from '../constants';

interface UseCardEditingOptions {
  setEditingCard: (cardId: string | null) => void;
  setEditQuantity: (quantity: number) => void;
  setEditCondition: (condition: string) => void;
  updateCollection: (
    cardId: string,
    quantity: number,
    condition: string
  ) => Promise<boolean>;
  removeFromCollection: (cardId: string) => Promise<boolean>;
  loadCollection: () => Promise<void>;
}

export function useCardEditing({
  setEditingCard,
  setEditQuantity,
  setEditCondition,
  updateCollection,
  removeFromCollection,
  loadCollection,
}: UseCardEditingOptions) {
  const startEditing = useCallback(
    (card: CollectionCard) => {
      setEditingCard(card.cardId);
      setEditQuantity(card.quantity);
      setEditCondition(card.condition);
    },
    [setEditingCard, setEditQuantity, setEditCondition]
  );

  const cancelEditing = useCallback(() => {
    setEditingCard(null);
    setEditQuantity(0);
    setEditCondition(DEFAULT_CONDITION);
  }, [setEditingCard, setEditQuantity, setEditCondition]);

  const handleUpdateCard = useCallback(
    async (cardId: string, quantity: number, condition: string) => {
      if (quantity <= 0) {
        // TODO: Replace with proper confirmation dialog component
        // eslint-disable-next-line no-alert
        const confirmed = window.confirm(
          'Are you sure you want to remove this card from your collection?'
        );
        if (confirmed) {
          const success = await removeFromCollection(cardId);
          if (success) {
            loadCollection();
          }
        }
      } else {
        const success = await updateCollection(cardId, quantity, condition);
        if (success) {
          loadCollection();
        }
      }
      setEditingCard(null);
    },
    [updateCollection, removeFromCollection, loadCollection, setEditingCard]
  );

  return {
    startEditing,
    cancelEditing,
    handleUpdateCard,
  };
}
