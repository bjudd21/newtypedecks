'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckCard {
  cardId: string;
  card: CardWithRelations;
  quantity: number;
  category?: string;
}

interface Deck {
  id: string;
  name: string;
  description?: string;
  format?: string;
  isPublic: boolean;
  cards: DeckCard[];
  cardCount?: number;
  uniqueCards?: number;
  totalCost?: number;
  colors?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface CreateDeckData {
  name: string;
  description?: string;
  format?: string;
  isPublic?: boolean;
  cards: DeckCard[];
}

interface UpdateDeckData {
  name?: string;
  description?: string;
  format?: string;
  isPublic?: boolean;
  cards?: DeckCard[];
}

export function useDecks() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createDeck = useCallback(
    async (deckData: CreateDeckData): Promise<Deck | null> => {
      if (!isAuthenticated) {
        setError('Authentication required to save decks');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/decks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deckData),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to save deck');
          return null;
        }

        return data.deck;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to save deck';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const updateDeck = useCallback(
    async (
      deckId: string,
      updateData: UpdateDeckData
    ): Promise<Deck | null> => {
      if (!isAuthenticated) {
        setError('Authentication required');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/decks/${deckId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to update deck');
          return null;
        }

        return data.deck;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update deck';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const deleteDeck = useCallback(
    async (deckId: string): Promise<boolean> => {
      if (!isAuthenticated) {
        setError('Authentication required');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/decks/${deckId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to delete deck');
          return false;
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete deck';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const getDeck = useCallback(async (deckId: string): Promise<Deck | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/decks/${deckId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load deck');
        return null;
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load deck';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserDecks = useCallback(
    async (options?: {
      page?: number;
      limit?: number;
      search?: string;
      format?: string;
    }): Promise<{ decks: Deck[]; pagination: Pagination } | null> => {
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
        if (options?.format) params.set('format', options.format);

        const response = await fetch(`/api/decks?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to load decks');
          return null;
        }

        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load decks';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  return {
    isLoading,
    error,
    clearError,
    createDeck,
    updateDeck,
    deleteDeck,
    getDeck,
    getUserDecks,
  };
}
