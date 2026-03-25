/**
 * CardSearchComponent - Main component orchestrator
 */

'use client';

import React from 'react';
import { Search } from '@/components/ui/Search';
import { cn } from '@/lib/utils';
import { useReferenceData, AdvancedFiltersPanel } from './';
import { useCardSearchState } from './hooks/useCardSearchState';
import { useCardSearchHandlers } from './hooks/useCardSearchHandlers';
import { useInitialValueEffect } from './hooks/useInitialValueEffect';
import type { CardWithRelations, CardSearchFilters } from '@/lib/types/card';

export interface CardSearchProps {
  onResults?: (cards: CardWithRelations[]) => void;
  onFiltersChange?: (filters: CardSearchFilters) => void;
  onSearch?: () => void;
  className?: string;
  placeholder?: string;
  initialValue?: string;
  showAdvancedFilters?: boolean;
  maxSuggestions?: number;
}

export const CardSearchComponent: React.FC<CardSearchProps> = ({
  onResults,
  onFiltersChange,
  onSearch,
  className,
  placeholder = 'Search cards by name, pilot, or model...',
  initialValue = '',
  showAdvancedFilters = true,
  maxSuggestions = 8,
}) => {
  // State management
  const {
    searchValue,
    setSearchValue,
    suggestions,
    setSuggestions,
    isLoading,
    setIsLoading,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
  } = useCardSearchState(initialValue);

  // Use reference data hook for filter options
  const { referenceData, isLoading: isLoadingReference } = useReferenceData();

  // Event handlers
  const {
    handleSearchChange,
    handleSearch,
    handleSuggestionSelect,
    handleFilterChange,
    clearFilters,
    performSearch,
  } = useCardSearchHandlers({
    searchValue,
    filters,
    maxSuggestions,
    setSearchValue,
    setSuggestions,
    setIsLoading,
    setFilters,
    onResults,
    onFiltersChange,
    onSearch,
  });

  // Initial value effect
  useInitialValueEffect({
    initialValue,
    filters,
    performSearch,
  });

  return (
    <div className={cn('card-search', className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Main search input */}
        <div className="flex-1">
          <Search
            value={searchValue}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            suggestions={suggestions}
            onSuggestionSelect={handleSuggestionSelect}
            placeholder={placeholder}
            disabled={isLoading}
            showSuggestions={true}
            maxSuggestions={maxSuggestions}
            debounceMs={300}
          />
        </div>

        {/* Filter toggle button */}
        {showAdvancedFilters && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors',
              showFilters
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-border bg-card text-muted-foreground hover:bg-accent'
            )}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
              />
            </svg>
            Filters
            {Object.keys(filters).length > 0 && (
              <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Advanced filters panel */}
      {showAdvancedFilters && showFilters && (
        <AdvancedFiltersPanel
          filters={filters}
          referenceData={referenceData}
          isLoadingReference={isLoadingReference}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-muted-foreground/70 mt-2 text-sm">
          Searching...
        </div>
      )}
    </div>
  );
};

export default CardSearchComponent;
