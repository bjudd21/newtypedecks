/**
 * NewCardsPageContent - Main component orchestrator
 */

'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { CardGrid } from '@/components/card/CardGrid';
import { CardDetailOverlay } from '@/components/card/CardDetailOverlay';
import { SearchHeader } from '@/components/card/SearchHeader';
import { ActiveFiltersDisplay } from '@/components/card/ActiveFiltersDisplay';
import { PaginationBar } from '@/components/card/PaginationBar';
import { useCardsState } from './hooks/useCardsState';
import { useFilters } from './hooks/useFilters';
import { useCardHandlers } from './hooks/useCardHandlers';
import {
  useURLInitialization,
  useFilterEffects,
} from './hooks/useURLInitialization';
import { FilterToolbar } from './ui/FilterToolbar';
import { SortControls } from './ui/SortControls';
import { ViewToggle } from './ui/ViewToggle';

export function NewCardsPageContent() {
  const searchParams = useSearchParams();
  const game = useGame();

  // State management
  const {
    cards,
    setCards,
    loading,
    setLoading,
    selectedCard,
    setSelectedCard,
    searchQuery,
    setSearchQuery,
    totalResults,
    setTotalResults,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useCardsState();

  // Filter management
  const {
    selectedColors,
    selectedTypes,
    toggleColorFilter,
    toggleTypeFilter,
    clearAllFilters,
  } = useFilters();

  // Event handlers
  const {
    handleSearch,
    handleRandomCard,
    handleCardClick,
    handleSearchSubmit,
  } = useCardHandlers({
    searchQuery,
    gameSlug: game.slug,
    currentPage,
    sortBy,
    sortOrder,
    setLoading,
    setCards,
    setTotalResults,
    setTotalPages,
    setSelectedCard,
    setCurrentPage,
  });

  // URL initialization
  useURLInitialization({
    searchParams,
    setSearchQuery,
    handleSearch,
    handleRandomCard,
    selectedColors,
    selectedTypes,
  });

  // Filter effects
  useFilterEffects(selectedColors, selectedTypes, handleSearch);

  return (
    <div className="min-h-screen space-y-6">
      <SearchHeader
        searchQuery={searchQuery}
        loading={loading}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <FilterToolbar
            selectedColors={selectedColors}
            selectedTypes={selectedTypes}
            onToggleColor={toggleColorFilter}
            onToggleType={toggleTypeFilter}
            onRandomCard={handleRandomCard}
          />
          <ViewToggle />
        </div>

        <ActiveFiltersDisplay
          selectedColors={selectedColors}
          selectedTypes={selectedTypes}
          onToggleColor={toggleColorFilter}
          onToggleType={toggleTypeFilter}
          onClearAll={clearAllFilters}
        />

        <SortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
          }}
          totalResults={totalResults}
        />
      </div>

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPageChange={setCurrentPage}
      />

      <div className="pb-6">
        <CardGrid
          cards={cards}
          onCardClick={handleCardClick}
          loading={loading}
        />
      </div>

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPageChange={setCurrentPage}
      />

      {selectedCard && (
        <CardDetailOverlay
          card={selectedCard}
          isOpen={true}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
