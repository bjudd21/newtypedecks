/**
 * CardsPageClient - Client-side component for cards page functionality
 *
 * This component handles the interactive parts of the cards page including
 * search, filtering, and displaying results.
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { CardSearch } from '@/components/card/CardSearch';
import { CardDisplay } from '@/components/card/CardDisplay';
import { Card, CardContent, CardHeader, CardTitle, Button, InfiniteScroll, useInfiniteScroll, Pagination } from '@/components/ui';
import type { CardWithRelations, CardSearchFilters, CardSearchOptions, CardSearchResult } from '@/lib/types/card';

type PaginationMode = 'infinite' | 'traditional';

export function CardsPageClient() {
  const [selectedCard, setSelectedCard] = useState<CardWithRelations | null>(null);
  const [activeFilters, setActiveFilters] = useState<CardSearchFilters>({});
  const [sortOptions, setSortOptions] = useState<{ sortBy: string; sortOrder: 'asc' | 'desc' }>({
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [paginationMode, setPaginationMode] = useState<PaginationMode>('infinite');

  // Traditional pagination state
  const [traditionalCards, setTraditionalCards] = useState<CardWithRelations[]>([]);
  const [traditionalLoading, setTraditionalLoading] = useState(false);
  const [traditionalError, setTraditionalError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 20;

  // Load function for infinite scroll
  const loadCards = useCallback(async (page: number, pageSize: number) => {
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
  }, [activeFilters, sortOptions]);

  // Traditional pagination load function
  const loadTraditionalPage = useCallback(async (page: number) => {
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
      setTraditionalError(error instanceof Error ? error.message : 'Failed to load cards');
    } finally {
      setTraditionalLoading(false);
    }
  }, [activeFilters, sortOptions, traditionalLoading, pageSize]);

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
    enableAutoLoad: false, // We'll trigger manually
  });

  const handleFiltersChange = useCallback((newFilters: CardSearchFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, []);

  const handleCardClick = useCallback((card: CardWithRelations) => {
    setSelectedCard(card);
  }, []);

  const handleSortChange = useCallback((sortField: string, sortOrder: 'asc' | 'desc') => {
    setSortOptions({ sortBy: sortField, sortOrder });
    setCurrentPage(1); // Reset to page 1 when sort changes
  }, []);

  const handleSearch = useCallback(() => {
    if (paginationMode === 'infinite') {
      resetInfinite();
    } else {
      setCurrentPage(1);
      loadTraditionalPage(1);
    }
  }, [paginationMode, resetInfinite, loadTraditionalPage]);

  const handlePageChange = useCallback((page: number) => {
    if (paginationMode === 'traditional') {
      loadTraditionalPage(page);
    }
  }, [paginationMode, loadTraditionalPage]);

  const handlePaginationModeChange = useCallback((mode: PaginationMode) => {
    setPaginationMode(mode);
    setCurrentPage(1);
    if (mode === 'traditional' && Object.keys(activeFilters).length > 0) {
      loadTraditionalPage(1);
    } else if (mode === 'infinite') {
      resetInfinite();
    }
  }, [activeFilters, loadTraditionalPage, resetInfinite]);

  // Get current state based on pagination mode
  const currentCards = paginationMode === 'infinite' ? infiniteCards : traditionalCards;
  const currentLoading = paginationMode === 'infinite' ? infiniteLoading : traditionalLoading;
  const currentError = paginationMode === 'infinite' ? infiniteError : traditionalError;
  const currentTotal = paginationMode === 'infinite' ? infiniteTotal : totalResults;

  // Check if we have any active search
  const hasActiveSearch = useMemo(() => {
    return Object.values(activeFilters).some(value =>
      value !== undefined && value !== null &&
      (Array.isArray(value) ? value.length > 0 : value !== '')
    );
  }, [activeFilters]);

  return (
    <div className="space-y-6">
      {/* Search Component */}
      <CardSearch
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        placeholder="Search cards by name, pilot, model, or description..."
        showAdvancedFilters={true}
      />

      {/* Results Section */}
      {(hasActiveSearch || currentCards.length > 0) && (
        <div className="space-y-4">
          {/* Results header with sorting and pagination mode */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results
              </h2>
              {currentTotal > 0 && (
                <span className="text-sm text-gray-500">
                  ({currentTotal.toLocaleString()} cards found)
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Pagination mode selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => handlePaginationModeChange('infinite')}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      paginationMode === 'infinite'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Infinite Scroll
                  </button>
                  <button
                    onClick={() => handlePaginationModeChange('traditional')}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      paginationMode === 'traditional'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Pages
                  </button>
                </div>
              </div>

              {/* Sort controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                  value={`${sortOptions.sortBy}:${sortOptions.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split(':');
                    handleSortChange(sortBy, sortOrder as 'asc' | 'desc');
                  }}
                >
                  <option value="name:asc">Name (A-Z)</option>
                  <option value="name:desc">Name (Z-A)</option>
                  <option value="level:asc">Level (Low-High)</option>
                  <option value="level:desc">Level (High-Low)</option>
                  <option value="cost:asc">Cost (Low-High)</option>
                  <option value="cost:desc">Cost (High-Low)</option>
                  <option value="createdAt:desc">Recently Added</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results display based on pagination mode */}
          {paginationMode === 'infinite' ? (
            /* Infinite Scroll Results */
            <InfiniteScroll
              items={infiniteCards}
              hasMore={hasMore}
              isLoading={infiniteLoading}
              loadMore={loadMore}
              renderItem={(card: CardWithRelations, index: number) => (
                <CardDisplay
                  key={card.id}
                  card={card}
                  onClick={handleCardClick}
                  className="cursor-pointer"
                />
              )}
              renderSkeleton={() => (
                <div className="border rounded-lg p-4 animate-pulse">
                  <div className="bg-gray-200 h-32 w-full rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded mb-1"></div>
                  <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                </div>
              )}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              containerClassName="space-y-4"
              errorMessage={infiniteError || undefined}
              onRetry={retryInfinite}
              endMessage={
                <div className="text-center text-gray-500 py-8">
                  <svg className="h-8 w-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <p className="text-sm">You've seen all {infiniteTotal.toLocaleString()} matching cards</p>
                </div>
              }
            />
          ) : (
            /* Traditional Pagination Results */
            <div className="space-y-4">
              {/* Loading state */}
              {traditionalLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 animate-pulse">
                      <div className="bg-gray-200 h-32 w-full rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 w-3/4 rounded mb-1"></div>
                      <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error state */}
              {traditionalError && (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-4">
                    <svg className="h-8 w-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">{traditionalError}</p>
                  </div>
                  <Button
                    onClick={() => loadTraditionalPage(currentPage)}
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Card grid */}
              {!traditionalLoading && !traditionalError && traditionalCards.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {traditionalCards.map((card: CardWithRelations) => (
                      <CardDisplay
                        key={card.id}
                        card={card}
                        onClick={handleCardClick}
                        className="cursor-pointer"
                      />
                    ))}
                  </div>

                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        disabled={traditionalLoading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* No results state */}
          {!currentLoading && currentCards.length === 0 && hasActiveSearch && (
            <Card className="border-gray-200">
              <CardContent className="py-8">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No cards found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search terms or filters.
                  </p>
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        setActiveFilters({});
                        setSortOptions({ sortBy: 'name', sortOrder: 'asc' });
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Welcome message when no search has been performed */}
      {!hasActiveSearch && currentCards.length === 0 && !currentLoading && !currentError && (
        <Card className="border-gray-200">
          <CardContent className="py-8">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Welcome to the Card Database
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Use the search bar above to find specific cards, or use the advanced filters to browse cards by faction, series, level, and more.
              </p>
              <div className="mt-4">
                <Button
                  onClick={handleSearch}
                  variant="default"
                  className="mx-auto"
                >
                  Browse All Cards
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card detail modal (future enhancement) */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedCard.name}</CardTitle>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <CardDisplay
                card={selectedCard}
                showFullDetails={true}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}