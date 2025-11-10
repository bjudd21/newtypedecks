'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { CardWithRelations } from '@/lib/types/card';

interface CollectionCard {
  cardId: string;
  card: CardWithRelations;
  quantity: number;
  condition: string;
  addedAt: Date | string;
  updatedAt: Date | string;
}

interface Collection {
  userId: string;
  cards: CollectionCard[];
  statistics: {
    totalCards: number;
    uniqueCards: number;
    completionPercentage: number;
    totalValue: number;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useCollection() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getCollection = useCallback(
    async (options?: {
      page?: number;
      limit?: number;
      search?: string;
      rarity?: string;
      type?: string;
      faction?: string;
    }): Promise<Collection | null> => {
      if (!isAuthenticated) {
        setError('Authentication required');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (options?.page) params.set('page', options.page.toString());
        if (options?.limit) params.set('limit', options.limit.toString());
        if (options?.search) params.set('search', options.search);
        if (options?.rarity) params.set('rarity', options.rarity);
        if (options?.type) params.set('type', options.type);
        if (options?.faction) params.set('faction', options.faction);

        const response = await fetch(`/api/collections?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to load collection');
          return null;
        }

        return data.collection;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load collection';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

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
    [isAuthenticated]
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
    [isAuthenticated]
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
    [isAuthenticated]
  );

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
    isLoading,
    error,
    clearError,
    getCollection,
    addToCollection,
    updateCollection,
    removeFromCollection,
    getCardQuantity,
    getCardQuantities,
  };
}
