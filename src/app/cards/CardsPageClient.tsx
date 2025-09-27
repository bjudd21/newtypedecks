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
import { Card, CardContent, CardHeader, CardTitle, Button, InfiniteScroll, useInfiniteScroll } from '@/components/ui';
import type { CardWithRelations, CardSearchFilters, CardSearchOptions } from '@/lib/types/card';

export function CardsPageClient() {
  const [selectedCard, setSelectedCard] = useState<CardWithRelations | null>(null);
  const [activeFilters, setActiveFilters] = useState<CardSearchFilters>({});
  const [sortOptions, setSortOptions] = useState<{ sortBy: string; sortOrder: 'asc' | 'desc' }>({
    sortBy: 'name',
    sortOrder: 'asc',
  });

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

  // Infinite scroll hook
  const {
    items: cards,
    hasMore,
    isLoading,
    error,
    total,
    loadMore,
    reset,
    retry,
  } = useInfiniteScroll({
    pageSize: 20,
    loadFunction: loadCards,
    dependencies: [activeFilters, sortOptions],
    enableAutoLoad: false, // We'll trigger manually
  });

  const handleFiltersChange = useCallback((newFilters: CardSearchFilters) => {
    setActiveFilters(newFilters);
  }, []);

  const handleCardClick = useCallback((card: CardWithRelations) => {
    setSelectedCard(card);
  }, []);

  const handleSortChange = useCallback((sortField: string, sortOrder: 'asc' | 'desc') => {
    setSortOptions({ sortBy: sortField, sortOrder });
  }, []);

  const handleSearch = useCallback(() => {
    reset();
    // The reset will trigger a re-load through dependencies
  }, [reset]);

  // Memoized components for performance
  const cardItems = useMemo(() => cards, [cards]);

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
      {(hasActiveSearch || cards.length > 0) && (
        <div className="space-y-4">
          {/* Results header with sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results
              </h2>
              {total > 0 && (
                <span className="text-sm text-gray-500">
                  ({total.toLocaleString()} cards found)
                </span>
              )}
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

          {/* Infinite Scroll Results */}
          <InfiniteScroll
            items={cardItems}
            hasMore={hasMore}
            isLoading={isLoading}
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
            errorMessage={error || undefined}
            onRetry={retry}
            endMessage={
              <div className="text-center text-gray-500 py-8">
                <svg className="h-8 w-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <p className="text-sm">You've seen all {total.toLocaleString()} matching cards</p>
              </div>
            }
          />

          {/* No results state */}
          {!isLoading && cards.length === 0 && hasActiveSearch && (
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
      {!hasActiveSearch && cards.length === 0 && !isLoading && !error && (
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
                  variant="primary"
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