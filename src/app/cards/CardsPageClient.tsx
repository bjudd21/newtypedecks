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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  InfiniteScroll,
  useInfiniteScroll,
  Pagination,
} from '@/components/ui';
import type {
  CardWithRelations,
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '@/lib/types/card';

type PaginationMode = 'infinite' | 'traditional';

// ============================================================================
// Sub-components
// ============================================================================

interface PaginationModeSelectorProps {
  mode: PaginationMode;
  onChange: (mode: PaginationMode) => void;
}

function PaginationModeSelector({ mode, onChange }: PaginationModeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">View:</span>
      <div className="flex overflow-hidden rounded-md border border-gray-300">
        <button
          onClick={() => onChange('infinite')}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            mode === 'infinite'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Infinite Scroll
        </button>
        <button
          onClick={() => onChange('traditional')}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            mode === 'traditional'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Pages
        </button>
      </div>
    </div>
  );
}

interface SortControlsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

function SortControls({ sortBy, sortOrder, onChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <select
        className="rounded border border-gray-300 px-2 py-1 text-sm"
        value={`${sortBy}:${sortOrder}`}
        onChange={(e) => {
          const [newSortBy, newSortOrder] = e.target.value.split(':');
          onChange(newSortBy, newSortOrder as 'asc' | 'desc');
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
  );
}

interface ResultsHeaderProps {
  total: number;
  paginationMode: PaginationMode;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onPaginationModeChange: (mode: PaginationMode) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

function ResultsHeader({
  total,
  paginationMode,
  sortBy,
  sortOrder,
  onPaginationModeChange,
  onSortChange,
}: ResultsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900">Search Results</h2>
        {total > 0 && (
          <span className="text-sm text-gray-500">
            ({total.toLocaleString()} cards found)
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <PaginationModeSelector
          mode={paginationMode}
          onChange={onPaginationModeChange}
        />
        <SortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
}

interface InfiniteScrollResultsProps {
  cards: CardWithRelations[];
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  total: number;
  onLoadMore: () => Promise<void>;
  onCardClick: (card: CardWithRelations) => void;
  onRetry: () => void;
}

function InfiniteScrollResults({
  cards,
  hasMore,
  isLoading,
  error,
  total,
  onLoadMore,
  onCardClick,
  onRetry,
}: InfiniteScrollResultsProps) {
  return (
    <InfiniteScroll
      items={cards}
      hasMore={hasMore}
      isLoading={isLoading}
      loadMore={onLoadMore}
      renderItem={(card: CardWithRelations, _index: number) => (
        <CardDisplay
          key={card.id}
          card={card}
          onClick={onCardClick}
          className="cursor-pointer"
        />
      )}
      renderSkeleton={() => (
        <div className="animate-pulse rounded-lg border p-4">
          <div className="mb-2 h-32 w-full rounded bg-gray-200"></div>
          <div className="mb-1 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-3 w-1/2 rounded bg-gray-200"></div>
        </div>
      )}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      containerClassName="space-y-4"
      errorMessage={error || undefined}
      onRetry={onRetry}
      endMessage={
        <div className="py-8 text-center text-gray-500">
          <svg
            className="mx-auto mb-2 h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <p className="text-sm">
            You&apos;ve seen all {total.toLocaleString()} matching cards
          </p>
        </div>
      }
    />
  );
}

interface TraditionalPaginationResultsProps {
  cards: CardWithRelations[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCardClick: (card: CardWithRelations) => void;
  onRetry: () => void;
}

function TraditionalPaginationResults({
  cards,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onCardClick,
  onRetry,
}: TraditionalPaginationResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-lg border p-4">
            <div className="mb-2 h-32 w-full rounded bg-gray-200"></div>
            <div className="mb-1 h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-3 w-1/2 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4 text-red-600">
          <svg
            className="mx-auto mb-2 h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card: CardWithRelations) => (
          <CardDisplay
            key={card.id}
            card={card}
            onClick={onCardClick}
            className="cursor-pointer"
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            disabled={isLoading}
          />
        </div>
      )}
    </>
  );
}

interface NoResultsStateProps {
  onClearFilters: () => void;
}

function NoResultsState({ onClearFilters }: NoResultsStateProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="py-8">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No cards found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or filters.
          </p>
          <div className="mt-4">
            <Button onClick={onClearFilters} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface WelcomeMessageProps {
  onBrowseAll: () => void;
}

function WelcomeMessage({ onBrowseAll }: WelcomeMessageProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="py-8">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Welcome to the Card Database
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            Use the search bar above to find specific cards, or use the advanced
            filters to browse cards by faction, series, level, and more.
          </p>
          <div className="mt-4">
            <Button onClick={onBrowseAll} variant="default" className="mx-auto">
              Browse All Cards
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CardDetailModalProps {
  card: CardWithRelations;
  onClose: () => void;
}

function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{card.name}</CardTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <CardDisplay card={card} showFullDetails={true} />
        </CardContent>
      </Card>
    </div>
  );
}

interface ResultsSectionProps {
  paginationMode: PaginationMode;
  currentTotal: number;
  sortOptions: { sortBy: string; sortOrder: 'asc' | 'desc' };
  infiniteCards: CardWithRelations[];
  hasMore: boolean;
  infiniteLoading: boolean;
  infiniteError: string | null;
  infiniteTotal: number;
  traditionalCards: CardWithRelations[];
  traditionalLoading: boolean;
  traditionalError: string | null;
  currentPage: number;
  totalPages: number;
  showNoResults: boolean;
  onPaginationModeChange: (mode: PaginationMode) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onLoadMore: () => Promise<void>;
  onCardClick: (card: CardWithRelations) => void;
  onRetryInfinite: () => void;
  onPageChange: (page: number) => void;
  onRetryTraditional: () => void;
  onClearFilters: () => void;
}

function ResultsSection({
  paginationMode,
  currentTotal,
  sortOptions,
  infiniteCards,
  hasMore,
  infiniteLoading,
  infiniteError,
  infiniteTotal,
  traditionalCards,
  traditionalLoading,
  traditionalError,
  currentPage,
  totalPages,
  showNoResults,
  onPaginationModeChange,
  onSortChange,
  onLoadMore,
  onCardClick,
  onRetryInfinite,
  onPageChange,
  onRetryTraditional,
  onClearFilters,
}: ResultsSectionProps) {
  return (
    <div className="space-y-4">
      <ResultsHeader
        total={currentTotal}
        paginationMode={paginationMode}
        sortBy={sortOptions.sortBy}
        sortOrder={sortOptions.sortOrder}
        onPaginationModeChange={onPaginationModeChange}
        onSortChange={onSortChange}
      />

      {paginationMode === 'infinite' ? (
        <InfiniteScrollResults
          cards={infiniteCards}
          hasMore={hasMore}
          isLoading={infiniteLoading}
          error={infiniteError}
          total={infiniteTotal}
          onLoadMore={onLoadMore}
          onCardClick={onCardClick}
          onRetry={onRetryInfinite}
        />
      ) : (
        <TraditionalPaginationResults
          cards={traditionalCards}
          isLoading={traditionalLoading}
          error={traditionalError}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onCardClick={onCardClick}
          onRetry={onRetryTraditional}
        />
      )}

      {showNoResults && <NoResultsState onClearFilters={onClearFilters} />}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

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
