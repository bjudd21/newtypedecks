/**
 * Public deck browser component - main orchestrator
 */

'use client';

import React from 'react';
import { usePublicDecks } from './hooks/usePublicDecks';
import { FilterPanel } from './components/FilterPanel';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { ErrorDisplay } from './components/ErrorDisplay';
import { DeckCard } from './components/DeckCard';
import { Pagination } from './components/Pagination';
import type { PublicDeckBrowserProps } from './types';

export const PublicDeckBrowser: React.FC<PublicDeckBrowserProps> = ({
  className,
}) => {
  const {
    decks,
    isLoading,
    error,
    pagination,
    filters,
    handleFilterChange,
    handlePageChange,
    handleViewDeck,
    handleLikeDeck,
    handleCopyDeck,
    handleCompareDeck,
  } = usePublicDecks();

  return (
    <div className={className}>
      {/* Filters */}
      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

      {/* Error Display */}
      {error && <ErrorDisplay error={error} />}

      {/* Loading State */}
      {isLoading && <LoadingState />}

      {/* Deck Grid */}
      {!isLoading && (
        <>
          {decks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {decks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onViewDeck={handleViewDeck}
                  onCopyDeck={handleCopyDeck}
                  onLikeDeck={handleLikeDeck}
                  onCompareDeck={handleCompareDeck}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default PublicDeckBrowser;
