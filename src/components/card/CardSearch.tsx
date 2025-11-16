/**
 * CardSearch component - Specialized search for cards with real-time suggestions
 *
 * This component wraps the generic Search component and provides card-specific
 * functionality including real-time API suggestions and advanced filtering.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, SearchSuggestion } from '@/components/ui/Search';
import { CardWithRelations, CardSearchFilters } from '@/lib/types/card';
import { cn } from '@/lib/utils';
import { useReferenceData, AdvancedFiltersPanel } from './CardSearch/';

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

export const CardSearch: React.FC<CardSearchProps> = ({
  onResults,
  onFiltersChange,
  onSearch,
  className,
  placeholder = 'Search cards by name, pilot, or model...',
  initialValue = '',
  showAdvancedFilters = true,
  maxSuggestions = 8,
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<CardSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Use reference data hook for filter options
  const { referenceData, isLoading: isLoadingReference } = useReferenceData();

  // Fetch card suggestions based on search input
  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/cards/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filters: {
              name: query,
            },
            options: {
              page: 1,
              limit: maxSuggestions,
              sortBy: 'name',
              sortOrder: 'asc',
              includeRelations: true,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const cardSuggestions: SearchSuggestion[] = data.cards.map(
            (card: CardWithRelations) => ({
              id: card.id,
              label: card.name,
              value: card.name,
              category: card.type?.name || 'Card',
            })
          );

          setSuggestions(cardSuggestions);
        }
      } catch (error) {
        console.error('Failed to fetch card suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [maxSuggestions]
  );

  // Perform full search
  const performSearch = useCallback(
    async (query: string, searchFilters: CardSearchFilters = {}) => {
      if (!onResults) return;

      try {
        setIsLoading(true);

        const searchQuery: CardSearchFilters = {
          ...searchFilters,
        };

        // If there's a text query, search across name, pilot, and model
        if (query.trim()) {
          searchQuery.name = query.trim();
        }

        const response = await fetch('/api/cards/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filters: searchQuery,
            options: {
              page: 1,
              limit: 50,
              sortBy: 'name',
              sortOrder: 'asc',
              includeRelations: true,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          onResults(data.cards);
        }
      } catch (error) {
        console.error('Failed to perform card search:', error);
        onResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [onResults]
  );

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    fetchSuggestions(value);
  };

  // Handle search execution
  const handleSearch = (value: string) => {
    performSearch(value, filters);
    onSearch?.();
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchValue(suggestion.value);
    performSearch(suggestion.value, filters);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof CardSearchFilters, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }

    // Re-run search with new filters
    performSearch(searchValue, newFilters);
    onSearch?.();
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    if (onFiltersChange) {
      onFiltersChange({});
    }
    performSearch(searchValue, {});
    onSearch?.();
  };

  // Effect to perform initial search if there's an initial value
  useEffect(() => {
    if (initialValue) {
      performSearch(initialValue, filters);
    }
  }, [initialValue, filters, performSearch]);

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
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
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
        <div className="mt-2 text-sm text-gray-500">Searching...</div>
      )}
    </div>
  );
};

export default CardSearch;
