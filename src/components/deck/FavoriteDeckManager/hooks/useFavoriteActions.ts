'use client';
/**
 * Custom hook for favorite deck actions
 */

import { useState } from 'react';
import type { FavoriteDeck } from '../types';

interface UseFavoriteActionsOptions {
  setFavorites: React.Dispatch<React.SetStateAction<FavoriteDeck[]>>;
  onDeckSelect?: (deckId: string) => void;
  onRemoveFavorite?: (deckId: string) => void;
}

export function useFavoriteActions({
  setFavorites,
  onDeckSelect,
  onRemoveFavorite,
}: UseFavoriteActionsOptions) {
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Handle removing favorite
  const handleRemoveFavorite = async (deckId: string) => {
    // TODO: Replace with proper confirmation dialog component
    // eslint-disable-next-line no-alert
    if (!window.confirm('Remove this deck from your favorites?')) {
      return;
    }

    try {
      setRemovingId(deckId);

      const response = await fetch(`/api/favorites/${deckId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove favorite');
      }

      // Remove from local state
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.deck.id !== deckId)
      );

      if (onRemoveFavorite) {
        onRemoveFavorite(deckId);
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      console.warn(
        `TODO: Replace with proper UI notification - ${err instanceof Error ? err.message : 'Failed to remove favorite'}`
      );
    } finally {
      setRemovingId(null);
    }
  };

  // Handle deck selection
  const handleDeckClick = (deckId: string) => {
    if (onDeckSelect) {
      onDeckSelect(deckId);
    }
  };

  return {
    removingId,
    handleRemoveFavorite,
    handleDeckClick,
  };
}
