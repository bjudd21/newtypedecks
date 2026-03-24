/**
 * CardsPageContent - Main component orchestrator
 */

'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { CardSearch } from '@/components/card/CardSearch';
import {
  ResultsSection,
  WelcomeMessage,
  CardDetailModal,
} from '../CardsPageComponents';
import { usePaginationState } from './hooks/usePaginationState';
import { useDualPagination } from './hooks/useDualPagination';
import { useCardsHandlers } from './hooks/useCardsHandlers';
import { useComputedValues } from './hooks/useComputedValues';

export function CardsPageContent() {
  const game = useGame();

  // State management
  const {
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
  } = usePaginationState();

  // Dual pagination (infinite + traditional)
  const {
    infiniteCards,
    hasMore,
    infiniteLoading,
    infiniteError,
    infiniteTotal,
    loadMore,
    resetInfinite,
    retryInfinite,
    loadTraditionalPage,
  } = useDualPagination({
    activeFilters,
    gameSlug: game.slug,
    sortOptions,
    setTraditionalCards,
    setTraditionalLoading,
    setTraditionalError,
    setTotalPages,
    setTotalResults,
    setCurrentPage,
    traditionalLoading,
  });

  // Event handlers
  const {
    handleFiltersChange,
    handleCardClick,
    handleSortChange,
    handleSearch,
    handlePageChange,
    handlePaginationModeChange,
    handleClearFilters,
  } = useCardsHandlers({
    paginationMode,
    setActiveFilters,
    setSelectedCard,
    setSortOptions,
    setCurrentPage,
    setPaginationMode,
    resetInfinite,
    loadTraditionalPage,
    activeFilters,
  });

  // Computed values
  const {
    currentCards: _currentCards,
    currentLoading: _currentLoading,
    currentTotal,
    showResults,
    showNoResults,
    showWelcome,
  } = useComputedValues({
    paginationMode,
    infiniteCards,
    infiniteLoading,
    infiniteError: infiniteError as Error | null,
    infiniteTotal,
    traditionalCards,
    traditionalLoading,
    traditionalError,
    totalResults,
    activeFilters,
  });

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
