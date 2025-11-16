/**
 * Custom hook for card event handlers
 */

import { useCallback } from 'react';
import type {
  CardWithRelations,
  CardSearchFilters,
  CardSearchOptions,
  CardSortField,
} from '@/lib/types/card';
import { fetchCards, fetchRandomCard } from '../api';

interface UseCardHandlersOptions {
  searchQuery: string;
  currentPage: number;
  sortBy: CardSortField;
  sortOrder: 'asc' | 'desc';
  setLoading: (loading: boolean) => void;
  setCards: (cards: CardWithRelations[]) => void;
  setTotalResults: (total: number) => void;
  setTotalPages: (pages: number) => void;
  setSelectedCard: (card: CardWithRelations | null) => void;
  setCurrentPage: (page: number) => void;
}

export function useCardHandlers({
  searchQuery,
  currentPage,
  sortBy,
  sortOrder,
  setLoading,
  setCards,
  setTotalResults,
  setTotalPages,
  setSelectedCard,
  setCurrentPage,
}: UseCardHandlersOptions) {
  const handleSearch = useCallback(
    async (query?: string) => {
      setLoading(true);
      try {
        const filters: CardSearchFilters = {};
        if (query || searchQuery) {
          filters.name = query || searchQuery;
        }

        const options: CardSearchOptions = {
          page: currentPage,
          limit: 20,
          sortBy,
          sortOrder,
          includeRelations: true,
        };

        const result = await fetchCards(filters, options);
        setCards(result.cards);
        setTotalResults(result.total);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Error searching cards:', error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, currentPage, sortBy, sortOrder, setLoading, setCards, setTotalResults, setTotalPages]
  );

  const handleRandomCard = useCallback(async () => {
    setLoading(true);
    try {
      const randomCard = await fetchRandomCard();
      setSelectedCard(randomCard);
    } catch (error) {
      console.error('Error fetching random card:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSelectedCard]);

  const handleCardClick = useCallback(
    (card: CardWithRelations) => {
      setSelectedCard(card);
    },
    [setSelectedCard]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setCurrentPage(1);
      handleSearch();
    },
    [handleSearch, setCurrentPage]
  );

  return {
    handleSearch,
    handleRandomCard,
    handleCardClick,
    handleSearchSubmit,
  };
}
