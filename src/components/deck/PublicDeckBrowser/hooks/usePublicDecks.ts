'use client';
/**
 * Hook for managing public deck browsing state and API calls
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { PublicDeck, DeckFilters, PaginationState } from '../types';

export function usePublicDecks() {
  const router = useRouter();
  const params = useParams<{ gameSlug: string }>();
  const gameSlug = params?.gameSlug ?? '';
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
    sortBy: 'trending',
    sortOrder: 'desc',
    ruleset: '',
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
      // Increment view count once per session
      const sessionKey = `viewed-${deckId}`;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, '1');
        fetch(`/api/decks/${deckId}/view`, { method: 'POST' }).catch(
          () => undefined
        );
      }
      router.push(`/${gameSlug}/decks/${deckId}`);
    },
    [router, gameSlug]
  );

  const handleLikeDeck = useCallback(async (deckId: string) => {
    // Optimistic update
    setDecks((prev) =>
      prev.map((d) =>
        d.id === deckId
          ? {
              ...d,
              isLikedByUser: !d.isLikedByUser,
              likeCount: d.isLikedByUser ? d.likeCount - 1 : d.likeCount + 1,
            }
          : d
      )
    );

    try {
      const response = await fetch(`/api/decks/${deckId}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Like failed');
    } catch {
      // Revert optimistic update on error
      setDecks((prev) =>
        prev.map((d) =>
          d.id === deckId
            ? {
                ...d,
                isLikedByUser: !d.isLikedByUser,
                likeCount: d.isLikedByUser ? d.likeCount - 1 : d.likeCount + 1,
              }
            : d
        )
      );
    }
  }, []);

  const handleCompareDeck = useCallback(
    (deckId: string) => {
      router.push(`/${gameSlug}/decks/compare?a=${deckId}`);
    },
    [router, gameSlug]
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
          cards: fullDeck.cards || [],
        };

        localStorage.setItem('importDeck', JSON.stringify(deckData));

        // Navigate to deck builder
        router.push(`/${gameSlug}/decks/create?import=true`);
      } catch (error) {
        console.error('Error copying deck:', error);
        console.warn('Failed to copy deck');
      }
    },
    [router, gameSlug]
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
    handleLikeDeck,
    handleCopyDeck,
    handleCompareDeck,
  };
}
