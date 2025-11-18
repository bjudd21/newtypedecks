'use client';
/**
 * Custom hook for admin cards page effects
 */

import { useEffect } from 'react';
import type { PaginationData } from '../types';

interface UseCardsPageEffectsOptions {
  search: string;
  debouncedSearch: string;
  currentPage: number;
  setDebouncedSearch: (search: string) => void;
  setPagination: (
    pagination: PaginationData | ((prev: PaginationData) => PaginationData)
  ) => void;
  loadCards: (page: number, searchQuery: string) => void;
}

export function useCardsPageEffects({
  search,
  debouncedSearch,
  currentPage,
  setDebouncedSearch,
  setPagination,
  loadCards,
}: UseCardsPageEffectsOptions) {
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, setDebouncedSearch]);

  // Load cards when search or page changes
  useEffect(() => {
    loadCards(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, loadCards]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (currentPage !== 1) {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
}
