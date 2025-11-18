'use client';
/**
 * Hook for managing public deck browsing state and API calls
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { PublicDeck, DeckFilters, PaginationState } from '../types';

export function usePublicDecks() {
  const router = useRouter();
  const [decks, setDecks] = useState<PublicDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState<DeckFilters>({
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  const loadPublicDecks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters,
      });

      const response = await fetch(`/api/decks/public?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load public decks');
        return;
      }

      setDecks(data.decks);
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load public decks';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    loadPublicDecks();
  }, [loadPublicDecks]);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleViewDeck = useCallback(
    (deckId: string) => {
      router.push(`/decks/${deckId}`);
    },
    [router]
  );

  const handleCopyDeck = useCallback(
    async (deck: PublicDeck) => {
      try {
        // First get the full deck details
        const response = await fetch(`/api/decks/${deck.id}`);
        const fullDeck = await response.json();

        if (!response.ok) {
          console.warn('Failed to load deck details');
          return;
        }

        // Store deck data in localStorage for the deck builder to pick up
        const deckData = {
          name: `${deck.name} (Copy)`,
          description: deck.description || '',
          format: deck.format,
          cards: fullDeck.cards || [],
        };

        localStorage.setItem('importDeck', JSON.stringify(deckData));

        // Navigate to deck builder
        router.push('/decks/builder?import=true');
      } catch (error) {
        console.error('Error copying deck:', error);
        console.warn('Failed to copy deck');
      }
    },
    [router]
  );

  return {
    decks,
    isLoading,
    error,
    pagination,
    filters,
    handleFilterChange,
    handlePageChange,
    handleViewDeck,
    handleCopyDeck,
  };
}
