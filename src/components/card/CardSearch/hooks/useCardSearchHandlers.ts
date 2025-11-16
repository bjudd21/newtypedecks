/**
 * Custom hook for card search event handlers
 */

import { useCallback } from 'react';
import type { SearchSuggestion } from '@/components/ui/Search';
import type { CardWithRelations, CardSearchFilters } from '@/lib/types/card';
import { fetchCardSuggestions, performCardSearch } from '../api';

interface UseCardSearchHandlersOptions {
  searchValue: string;
  filters: CardSearchFilters;
  maxSuggestions: number;
  setSearchValue: (value: string) => void;
  setSuggestions: (suggestions: SearchSuggestion[]) => void;
  setIsLoading: (loading: boolean) => void;
  setFilters: (filters: CardSearchFilters) => void;
  onResults?: (cards: CardWithRelations[]) => void;
  onFiltersChange?: (filters: CardSearchFilters) => void;
  onSearch?: () => void;
}

export function useCardSearchHandlers({
  searchValue,
  filters,
  maxSuggestions,
  setSearchValue,
  setSuggestions,
  setIsLoading,
  setFilters,
  onResults,
  onFiltersChange,
  onSearch,
}: UseCardSearchHandlersOptions) {
  // Fetch card suggestions based on search input
  const fetchSuggestions = useCallback(
    async (query: string) => {
      try {
        setIsLoading(true);
        const cardSuggestions = await fetchCardSuggestions(query, maxSuggestions);
        setSuggestions(cardSuggestions);
      } finally {
        setIsLoading(false);
      }
    },
    [maxSuggestions, setIsLoading, setSuggestions]
  );

  // Perform full search
  const performSearch = useCallback(
    async (query: string, searchFilters: CardSearchFilters = {}) => {
      if (!onResults) return;

      try {
        setIsLoading(true);
        const cards = await performCardSearch(query, searchFilters);
        onResults(cards);
      } finally {
        setIsLoading(false);
      }
    },
    [onResults, setIsLoading]
  );

  // Handle search input changes
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      fetchSuggestions(value);
    },
    [setSearchValue, fetchSuggestions]
  );

  // Handle search execution
  const handleSearch = useCallback(
    (value: string) => {
      performSearch(value, filters);
      onSearch?.();
    },
    [filters, performSearch, onSearch]
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      setSearchValue(suggestion.value);
      performSearch(suggestion.value, filters);
    },
    [setSearchValue, performSearch, filters]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (key: keyof CardSearchFilters, value: unknown) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);

      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }

      // Re-run search with new filters
      performSearch(searchValue, newFilters);
      onSearch?.();
    },
    [filters, setFilters, onFiltersChange, performSearch, searchValue, onSearch]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    if (onFiltersChange) {
      onFiltersChange({});
    }
    performSearch(searchValue, {});
    onSearch?.();
  }, [setFilters, onFiltersChange, performSearch, searchValue, onSearch]);

  return {
    handleSearchChange,
    handleSearch,
    handleSuggestionSelect,
    handleFilterChange,
    clearFilters,
    performSearch,
  };
}
