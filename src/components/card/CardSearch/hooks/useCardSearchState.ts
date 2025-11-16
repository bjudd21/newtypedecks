/**
 * Custom hook for card search state management
 */

import { useState } from 'react';
import type { SearchSuggestion } from '@/components/ui/Search';
import type { CardSearchFilters } from '@/lib/types/card';

export function useCardSearchState(initialValue: string = '') {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<CardSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  return {
    searchValue,
    setSearchValue,
    suggestions,
    setSuggestions,
    isLoading,
    setIsLoading,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
  };
}
