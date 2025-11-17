/**
 * Hook for card collection operations
 */

'use client';

import { useState, useCallback } from 'react';

export function useCardCollection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCollection = useCallback(async (cardId: string, quantity = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/collection/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, quantity }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add card to collection: ${response.statusText}`
        );
      }

      return await response.json();
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
        const response = await fetch('/api/collection/cards', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cardId, quantity }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to remove card from collection: ${response.statusText}`
          );
        }

        return await response.json();
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
        const response = await fetch('/api/collection/cards', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cardId, quantity }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to update card quantity: ${response.statusText}`
          );
        }

        return await response.json();
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
