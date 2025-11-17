/**
 * Hook for managing card search state and operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
  CardSortField,
  CardSortOrder,
} from '../../lib/types/card';

export function useCardSearch(initialFilters: CardSearchFilters = {}) {
  const [filters, setFilters] = useState<CardSearchFilters>(initialFilters);
  const [options, setOptions] = useState<CardSearchOptions>({
    page: 1,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc',
    includeRelations: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<CardSearchResult>({
    cards: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const searchCards = useCallback(
    async (newFilters?: CardSearchFilters, newOptions?: CardSearchOptions) => {
      const searchFilters = newFilters || filters;
      const searchOptions = { ...options, ...newOptions };

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/cards/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filters: searchFilters,
            options: searchOptions,
          }),
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        const result: CardSearchResult = await response.json();
        setSearchResult(result);

        if (newFilters) setFilters(newFilters);
        if (newOptions) setOptions((prev) => ({ ...prev, ...newOptions }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        console.error('Card search error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, options]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<CardSearchFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      searchCards(updatedFilters, { ...options, page: 1 }); // Reset to first page
    },
    [filters, options, searchCards]
  );

  const updateOptions = useCallback(
    (newOptions: Partial<CardSearchOptions>) => {
      const updatedOptions = { ...options, ...newOptions };
      setOptions(updatedOptions);
      searchCards(filters, updatedOptions);
    },
    [filters, options, searchCards]
  );

  const clearFilters = useCallback(() => {
    const clearedFilters: CardSearchFilters = {};
    setFilters(clearedFilters);
    searchCards(clearedFilters, { ...options, page: 1 });
  }, [options, searchCards]);

  const nextPage = useCallback(() => {
    if (searchResult.page < searchResult.totalPages) {
      updateOptions({ page: searchResult.page + 1 });
    }
  }, [searchResult.page, searchResult.totalPages, updateOptions]);

  const previousPage = useCallback(() => {
    if (searchResult.page > 1) {
      updateOptions({ page: searchResult.page - 1 });
    }
  }, [searchResult.page, updateOptions]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= searchResult.totalPages) {
        updateOptions({ page });
      }
    },
    [searchResult.totalPages, updateOptions]
  );

  const sortBy = useCallback(
    (field: CardSortField, order?: CardSortOrder) => {
      const sortOrder =
        order ||
        (options.sortBy === field && options.sortOrder === 'asc'
          ? 'desc'
          : 'asc');
      updateOptions({ sortBy: field, sortOrder });
    },
    [options.sortBy, options.sortOrder, updateOptions]
  );

  // Initial search effect
  useEffect(() => {
    searchCards();
  }, [searchCards]); // Only run once on mount (searchCards is stable due to useCallback)

  return {
    // State
    filters,
    options,
    isLoading,
    error,
    searchResult,

    // Actions
    searchCards,
    updateFilters,
    updateOptions,
    clearFilters,
    nextPage,
    previousPage,
    goToPage,
    sortBy,

    // Computed values
    hasNextPage: searchResult.page < searchResult.totalPages,
    hasPreviousPage: searchResult.page > 1,
    isEmpty: searchResult.cards.length === 0 && !isLoading,
    totalCards: searchResult.total,
  };
}
