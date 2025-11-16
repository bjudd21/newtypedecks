/**
 * Custom hook for fetching and managing favorite decks
 */

import { useState, useEffect } from 'react';
import type { FavoriteDeck } from '../types';

export function useFavorites(searchQuery: string, currentPage: number) {
  const [favorites, setFavorites] = useState<FavoriteDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch user's favorite decks
  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/favorites?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorite decks');
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load favorite decks'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [currentPage, searchQuery]);

  return {
    favorites,
    setFavorites,
    isLoading,
    error,
    totalPages,
    refetch: fetchFavorites,
  };
}
