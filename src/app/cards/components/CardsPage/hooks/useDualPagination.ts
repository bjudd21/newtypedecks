'use client';
/**
 * Custom hook for dual pagination logic (infinite + traditional)
 */

import { useCallback } from 'react';
import { useInfiniteScroll } from '@/components/ui';
import type {
  CardWithRelations,
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '@/lib/types/card';
import { fetchCardsPage } from '../api';

interface UseDualPaginationOptions {
  activeFilters: CardSearchFilters;
  sortOptions: { sortBy: string; sortOrder: 'asc' | 'desc' };
  setTraditionalCards: React.Dispatch<
    React.SetStateAction<CardWithRelations[]>
  >;
  setTraditionalLoading: (loading: boolean) => void;
  setTraditionalError: (error: string | null) => void;
  setTotalPages: (pages: number) => void;
  setTotalResults: (total: number) => void;
  setCurrentPage: (page: number) => void;
  traditionalLoading: boolean;
}

const PAGE_SIZE = 20;

export function useDualPagination({
  activeFilters,
  sortOptions,
  setTraditionalCards,
  setTraditionalLoading,
  setTraditionalError,
  setTotalPages,
  setTotalResults,
  setCurrentPage,
  traditionalLoading,
}: UseDualPaginationOptions) {
  // Load function for infinite scroll
  const loadCards = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const result = await fetchCardsPage(activeFilters, {
          page,
          limit: pageSize,
          sortBy: sortOptions.sortBy,
          sortOrder: sortOptions.sortOrder,
          includeRelations: true,
        } as CardSearchOptions);

        return {
          items: result.cards,
          hasMore: result.page < result.totalPages,
          total: result.total,
        };
      } catch (error) {
        console.error('Error loading cards:', error);
        throw error;
      }
    },
    [activeFilters, sortOptions]
  );

  // Traditional pagination load function
  const loadTraditionalPage = useCallback(
    async (page: number) => {
      if (traditionalLoading) return;

      try {
        setTraditionalLoading(true);
        setTraditionalError(null);

        const result: CardSearchResult = await fetchCardsPage(activeFilters, {
          page,
          limit: PAGE_SIZE,
          sortBy: sortOptions.sortBy,
          sortOrder: sortOptions.sortOrder,
          includeRelations: true,
        } as CardSearchOptions);

        setTraditionalCards(result.cards);
        setTotalPages(result.totalPages);
        setTotalResults(result.total);
        setCurrentPage(result.page);
      } catch (error) {
        console.error('Error loading cards:', error);
        setTraditionalError(
          error instanceof Error ? error.message : 'Failed to load cards'
        );
      } finally {
        setTraditionalLoading(false);
      }
    },
    [
      activeFilters,
      sortOptions,
      traditionalLoading,
      setTraditionalLoading,
      setTraditionalError,
      setTraditionalCards,
      setTotalPages,
      setTotalResults,
      setCurrentPage,
    ]
  );

  // Infinite scroll hook
  const {
    items: infiniteCards,
    hasMore,
    isLoading: infiniteLoading,
    error: infiniteError,
    total: infiniteTotal,
    loadMore,
    reset: resetInfinite,
    retry: retryInfinite,
  } = useInfiniteScroll({
    pageSize: PAGE_SIZE,
    loadFunction: loadCards,
    dependencies: [activeFilters, sortOptions],
    enableAutoLoad: false,
  });

  return {
    infiniteCards,
    hasMore,
    infiniteLoading,
    infiniteError,
    infiniteTotal,
    loadMore,
    resetInfinite,
    retryInfinite,
    loadTraditionalPage,
  };
}
