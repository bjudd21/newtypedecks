/**
 * CardsPageClient - Client-side component for cards page functionality
 *
 * This component handles the interactive parts of the cards page including
 * search, filtering, and displaying results.
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { CardSearch } from '@/components/card/CardSearch';
import { useInfiniteScroll } from '@/components/ui';
import type {
  CardWithRelations,
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '@/lib/types/card';
import {
  PaginationMode,
  ResultsSection,
  WelcomeMessage,
  CardDetailModal,
} from './components/CardsPageComponents';

export function CardsPageClient() {
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
  const pageSize = 20;

  // Load function for infinite scroll
  const loadCards = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const response = await fetch('/api/cards/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filters: activeFilters,
            options: {
              page,
              limit: pageSize,
              sortBy: sortOptions.sortBy,
              sortOrder: sortOptions.sortOrder,
              includeRelations: true,
            } as CardSearchOptions,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }

        const result = await response.json();

        return {
          items: result.cards as CardWithRelations[],
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

        const response = await fetch('/api/cards/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filters: activeFilters,
            options: {
              page,
              limit: pageSize,
              sortBy: sortOptions.sortBy,
              sortOrder: sortOptions.sortOrder,
              includeRelations: true,
            } as CardSearchOptions,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }

        const result: CardSearchResult = await response.json();

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
    [activeFilters, sortOptions, traditionalLoading, pageSize]
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
    pageSize: 20,
    loadFunction: loadCards,
    dependencies: [activeFilters, sortOptions],
    enableAutoLoad: false,
  });

  const handleFiltersChange = useCallback((newFilters: CardSearchFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleCardClick = useCallback((card: CardWithRelations) => {
    setSelectedCard(card);
  }, []);

  const handleSortChange = useCallback(
    (sortField: string, sortOrder: 'asc' | 'desc') => {
      setSortOptions({ sortBy: sortField, sortOrder });
      setCurrentPage(1);
    },
    []
  );

  const handleSearch = useCallback(() => {
    if (paginationMode === 'infinite') {
      resetInfinite();
    } else {
      setCurrentPage(1);
      loadTraditionalPage(1);
    }
  }, [paginationMode, resetInfinite, loadTraditionalPage]);

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
    [activeFilters, loadTraditionalPage, resetInfinite]
  );

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setSortOptions({ sortBy: 'name', sortOrder: 'asc' });
  }, []);

  // Get current state based on pagination mode
  const currentCards =
    paginationMode === 'infinite' ? infiniteCards : traditionalCards;
  const currentLoading =
    paginationMode === 'infinite' ? infiniteLoading : traditionalLoading;
  const currentError =
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

  return (
    <div className="space-y-6">
      <CardSearch
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        placeholder="Search cards by name, pilot, model, or description..."
        showAdvancedFilters={true}
      />

      {showResults && (
        <ResultsSection
          paginationMode={paginationMode}
          currentTotal={currentTotal}
          sortOptions={sortOptions}
          infiniteCards={infiniteCards}
          hasMore={hasMore}
          infiniteLoading={infiniteLoading}
          infiniteError={infiniteError}
          infiniteTotal={infiniteTotal}
          traditionalCards={traditionalCards}
          traditionalLoading={traditionalLoading}
          traditionalError={traditionalError}
          currentPage={currentPage}
          totalPages={totalPages}
          showNoResults={showNoResults}
          onPaginationModeChange={handlePaginationModeChange}
          onSortChange={handleSortChange}
          onLoadMore={loadMore}
          onCardClick={handleCardClick}
          onRetryInfinite={retryInfinite}
          onPageChange={handlePageChange}
          onRetryTraditional={() => loadTraditionalPage(currentPage)}
          onClearFilters={handleClearFilters}
        />
      )}

      {showWelcome && <WelcomeMessage onBrowseAll={handleSearch} />}

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
