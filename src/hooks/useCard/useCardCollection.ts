/**
 * Hook for card collection operations
 */

'use client';

import { useState, useCallback } from 'react';
import {
  apiAddToCollection,
  apiRemoveFromCollection,
  apiUpdateQuantity,
} from './collectionApi';

export function useCardCollection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCollection = useCallback(async (cardId: string, quantity = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiAddToCollection(cardId, quantity);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to add card to collection'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromCollection = useCallback(
    async (cardId: string, quantity = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiRemoveFromCollection(cardId, quantity);
        return result;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to remove card from collection'
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (cardId: string, quantity: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiUpdateQuantity(cardId, quantity);
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update card quantity'
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    addToCollection,
    removeFromCollection,
    updateQuantity,
  };
}
