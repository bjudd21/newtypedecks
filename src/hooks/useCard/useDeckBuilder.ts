/**
 * Hook for deck building operations
 */

'use client';

import { useState, useCallback } from 'react';

export function useDeckBuilder(deckId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToDeck = useCallback(
    async (cardId: string, quantity = 1, category = 'main') => {
      if (!deckId) throw new Error('No deck selected');

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/decks/${deckId}/cards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cardId, quantity, category }),
        });

        if (!response.ok) {
          throw new Error(`Failed to add card to deck: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to add card to deck'
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [deckId]
  );

  const removeFromDeck = useCallback(
    async (cardId: string, quantity = 1) => {
      if (!deckId) throw new Error('No deck selected');

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/decks/${deckId}/cards`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cardId, quantity }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to remove card from deck: ${response.statusText}`
          );
        }

        return await response.json();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to remove card from deck'
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [deckId]
  );

  return {
    isLoading,
    error,
    addToDeck,
    removeFromDeck,
    canAddToDeck: !!deckId,
  };
}
