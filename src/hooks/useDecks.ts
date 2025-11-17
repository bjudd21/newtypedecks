'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  apiCreateDeck,
  apiUpdateDeck,
  apiDeleteDeck,
  apiGetDeck,
  apiGetUserDecks,
} from './useDecks/api';
import type {
  Deck,
  CreateDeckData,
  UpdateDeckData,
  GetUserDecksOptions,
  GetUserDecksResponse,
} from './useDecks/types';

export type {
  Deck,
  DeckCard,
  CreateDeckData,
  UpdateDeckData,
  Pagination,
  GetUserDecksOptions,
  GetUserDecksResponse,
} from './useDecks/types';

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
        const deck = await apiCreateDeck(deckData);
        return deck;
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
        const deck = await apiUpdateDeck(deckId, updateData);
        return deck;
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
        await apiDeleteDeck(deckId);
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
      const deck = await apiGetDeck(deckId);
      return deck;
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
    async (
      options?: GetUserDecksOptions
    ): Promise<GetUserDecksResponse | null> => {
      if (!isAuthenticated) {
        setError('Authentication required');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiGetUserDecks(options);
        return response;
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
