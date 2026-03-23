'use client';
/**
 * Custom hook for computed values based on pagination mode
 */

import { useMemo } from 'react';
import type { CardWithRelations, CardSearchFilters } from '@/lib/types/card';
import type { PaginationMode } from '../../CardsPageComponents';

interface UseComputedValuesOptions {
  paginationMode: PaginationMode;
  infiniteCards: CardWithRelations[];
  infiniteLoading: boolean;
  infiniteError: Error | null;
  infiniteTotal: number;
  traditionalCards: CardWithRelations[];
  traditionalLoading: boolean;
  traditionalError: Error | string | null;
  totalResults: number;
  activeFilters: CardSearchFilters;
}

export function useComputedValues({
  paginationMode,
  infiniteCards,
  infiniteLoading,
  infiniteError,
  infiniteTotal,
  traditionalCards,
  traditionalLoading,
  traditionalError,
  totalResults,
  activeFilters,
}: UseComputedValuesOptions) {
  // Get current state based on pagination mode
  const currentCards =
    paginationMode === 'infinite' ? infiniteCards : traditionalCards;
  const currentLoading =
    paginationMode === 'infinite' ? infiniteLoading : traditionalLoading;
  const currentError: Error | string | null =
    paginationMode === 'infinite' ? infiniteError : traditionalError;
  const currentTotal =
    paginationMode === 'infinite' ? infiniteTotal : totalResults;

  // Check if we have any active search
  const hasActiveSearch = useMemo(() => {
    return Object.values(activeFilters).some(
      (value) =>
        value !== undefined &&
        value !== null &&
        (Array.isArray(value) ? value.length > 0 : value !== '')
    );
  }, [activeFilters]);

  const showResults = hasActiveSearch || currentCards.length > 0;
  const showNoResults =
    !currentLoading && currentCards.length === 0 && hasActiveSearch;
  const showWelcome =
    !hasActiveSearch &&
    currentCards.length === 0 &&
    !currentLoading &&
    !currentError;

  return {
    currentCards,
    currentLoading,
    currentError,
    currentTotal,
    hasActiveSearch,
    showResults,
    showNoResults,
    showWelcome,
  };
}
