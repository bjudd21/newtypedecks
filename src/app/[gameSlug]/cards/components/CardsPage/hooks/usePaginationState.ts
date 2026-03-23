'use client';
/**
 * Custom hook for pagination state management
 */

import { useState } from 'react';
import type { CardWithRelations, CardSearchFilters } from '@/lib/types/card';
import type { PaginationMode } from '../../CardsPageComponents';

export function usePaginationState() {
  const [selectedCard, setSelectedCard] = useState<CardWithRelations | null>(
    null
  );
  const [activeFilters, setActiveFilters] = useState<CardSearchFilters>({});
  const [sortOptions, setSortOptions] = useState<{
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }>({
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [paginationMode, setPaginationMode] =
    useState<PaginationMode>('infinite');

  // Traditional pagination state
  const [traditionalCards, setTraditionalCards] = useState<CardWithRelations[]>(
    []
  );
  const [traditionalLoading, setTraditionalLoading] = useState(false);
  const [traditionalError, setTraditionalError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  return {
    selectedCard,
    setSelectedCard,
    activeFilters,
    setActiveFilters,
    sortOptions,
    setSortOptions,
    paginationMode,
    setPaginationMode,
    traditionalCards,
    setTraditionalCards,
    traditionalLoading,
    setTraditionalLoading,
    traditionalError,
    setTraditionalError,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    totalResults,
    setTotalResults,
  };
}
