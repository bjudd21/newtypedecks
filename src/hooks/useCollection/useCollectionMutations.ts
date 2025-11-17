/**
 * Collection mutation operations
 * Handles adding, updating, and removing cards from collection
 */

'use client';

import { useCallback } from 'react';

export function useCollectionMutations(
  isAuthenticated: boolean,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) {
  const addToCollection = useCallback(
    async (
      cardId: string,
      quantity: number = 1,
      condition: string = 'Near Mint'
    ): Promise<boolean> => {
      if (!isAuthenticated) {
        setError('Authentication required');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardId,
            quantity,
            condition,
            action: 'add',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to add card to collection');
          return false;
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to add card to collection';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, setIsLoading, setError]
  );

  const updateCollection = useCallback(
    async (
      cardId: string,
      quantity: number,
      condition: string = 'Near Mint'
    ): Promise<boolean> => {
      if (!isAuthenticated) {
        setError('Authentication required');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardId,
            quantity,
            condition,
            action: 'set',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to update collection');
          return false;
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update collection';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, setIsLoading, setError]
  );

  const removeFromCollection = useCallback(
    async (cardId: string): Promise<boolean> => {
      if (!isAuthenticated) {
        setError('Authentication required');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardId,
            action: 'remove',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to remove card from collection');
          return false;
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to remove card from collection';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, setIsLoading, setError]
  );

  return {
    addToCollection,
    updateCollection,
    removeFromCollection,
  };
}
