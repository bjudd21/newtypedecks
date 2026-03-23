import React from 'react';
import { ResultsHeader } from './ResultsHeader';
import { NoResultsState } from './NoResultsState';
import { InfiniteScrollResults } from './InfiniteScrollResults';
import { TraditionalPaginationResults } from './TraditionalPaginationResults';
import type { PaginationMode } from './types';
import type { CardWithRelations } from '@/lib/types/card';

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

export function ResultsSection({
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

      {showNoResults ? (
        <NoResultsState onClearFilters={onClearFilters} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
