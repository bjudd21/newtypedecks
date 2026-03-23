'use client';
/**
 * Custom hook for cards page event handlers
 */

import { useCallback } from 'react';
import type { CardWithRelations, CardSearchFilters } from '@/lib/types/card';
import type { PaginationMode } from '../../CardsPageComponents';

interface UseCardsHandlersOptions {
  paginationMode: PaginationMode;
  setActiveFilters: (filters: CardSearchFilters) => void;
  setSelectedCard: (card: CardWithRelations | null) => void;
  setSortOptions: (options: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) => void;
  setCurrentPage: (page: number) => void;
  setPaginationMode: (mode: PaginationMode) => void;
  resetInfinite: () => void;
  loadTraditionalPage: (page: number) => void;
  activeFilters: CardSearchFilters;
}

export function useCardsHandlers({
  paginationMode,
  setActiveFilters,
  setSelectedCard,
  setSortOptions,
  setCurrentPage,
  setPaginationMode,
  resetInfinite,
  loadTraditionalPage,
  activeFilters,
}: UseCardsHandlersOptions) {
  const handleFiltersChange = useCallback(
    (newFilters: CardSearchFilters) => {
      setActiveFilters(newFilters);
      setCurrentPage(1);
    },
    [setActiveFilters, setCurrentPage]
  );

  const handleCardClick = useCallback(
    (card: CardWithRelations) => {
      setSelectedCard(card);
    },
    [setSelectedCard]
  );

  const handleSortChange = useCallback(
    (sortField: string, sortOrder: 'asc' | 'desc') => {
      setSortOptions({ sortBy: sortField, sortOrder });
      setCurrentPage(1);
    },
    [setSortOptions, setCurrentPage]
  );

  const handleSearch = useCallback(() => {
    if (paginationMode === 'infinite') {
      resetInfinite();
    } else {
      setCurrentPage(1);
      loadTraditionalPage(1);
    }
  }, [paginationMode, resetInfinite, loadTraditionalPage, setCurrentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      loadTraditionalPage(page);
    },
    [loadTraditionalPage]
  );

  const handlePaginationModeChange = useCallback(
    (mode: PaginationMode) => {
      setPaginationMode(mode);
      setCurrentPage(1);

      if (mode === 'traditional') {
        if (Object.keys(activeFilters).length > 0) {
          loadTraditionalPage(1);
        }
        return;
      }

      resetInfinite();
    },
    [
      activeFilters,
      loadTraditionalPage,
      resetInfinite,
      setPaginationMode,
      setCurrentPage,
    ]
  );

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setSortOptions({ sortBy: 'name', sortOrder: 'asc' });
  }, [setActiveFilters, setSortOptions]);

  return {
    handleFiltersChange,
    handleCardClick,
    handleSortChange,
    handleSearch,
    handlePageChange,
    handlePaginationModeChange,
    handleClearFilters,
  };
}
