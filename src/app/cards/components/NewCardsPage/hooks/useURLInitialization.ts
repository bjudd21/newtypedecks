/**
 * Custom hook for URL parameter initialization
 */

import { useEffect } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';

interface UseURLInitializationOptions {
  searchParams: ReadonlyURLSearchParams;
  setSearchQuery: (query: string) => void;
  handleSearch: (query?: string) => void;
  handleRandomCard: () => void;
  selectedColors: string[];
  selectedTypes: string[];
}

export function useURLInitialization({
  searchParams,
  setSearchQuery,
  handleSearch,
  handleRandomCard,
}: UseURLInitializationOptions) {
  // Initialize from URL params
  useEffect(() => {
    const search = searchParams.get('search');
    const random = searchParams.get('random');

    if (search) {
      setSearchQuery(search);
      handleSearch(search);
    } else if (random === 'true') {
      handleRandomCard();
    } else if (
      !searchParams.get('advanced') &&
      !searchParams.get('help') &&
      !searchParams.get('view')
    ) {
      handleSearch();
    }
  }, [searchParams, setSearchQuery, handleSearch, handleRandomCard]);
}

export function useFilterEffects(
  selectedColors: string[],
  selectedTypes: string[],
  handleSearch: () => void
) {
  // Apply filters when they change
  useEffect(() => {
    if (selectedColors.length > 0 || selectedTypes.length > 0) {
      handleSearch();
    }
  }, [selectedColors, selectedTypes, handleSearch]);
}
