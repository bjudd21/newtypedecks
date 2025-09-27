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

// Reference data interfaces
interface ReferenceData {
  types: Array<{ id: string; name: string; description?: string }>;
  rarities: Array<{ id: string; name: string; color: string; description?: string }>;
  sets: Array<{ id: string; name: string; code: string; releaseDate: string; description?: string }>;
}

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
  const [referenceData, setReferenceData] = useState<ReferenceData>({ types: [], rarities: [], sets: [] });
  const [isLoadingReference, setIsLoadingReference] = useState(false);

  // Fetch reference data for filter dropdowns
  const fetchReferenceData = useCallback(async () => {
    try {
      setIsLoadingReference(true);
      const response = await fetch('/api/reference');

      if (response.ok) {
        const data = await response.json();
        setReferenceData({
          types: data.types || [],
          rarities: data.rarities || [],
          sets: data.sets || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch reference data:', error);
    } finally {
      setIsLoadingReference(false);
    }
  }, []);

  // Fetch card suggestions based on search input
  const fetchSuggestions = useCallback(async (query: string) => {
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
        const cardSuggestions: SearchSuggestion[] = data.cards.map((card: CardWithRelations) => ({
          id: card.id,
          label: card.name,
          value: card.name,
          category: card.type?.name || 'Card',
        }));

        setSuggestions(cardSuggestions);
      }
    } catch (error) {
      console.error('Failed to fetch card suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [maxSuggestions]);

  // Perform full search
  const performSearch = useCallback(async (query: string, searchFilters: CardSearchFilters = {}) => {
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
  }, [onResults]);

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
  const handleFilterChange = (key: keyof CardSearchFilters, value: any) => {
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

  // Effect to fetch reference data on component mount
  useEffect(() => {
    fetchReferenceData();
  }, [fetchReferenceData]);

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
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
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
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          {isLoadingReference && (
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Loading filter options...
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Card Type filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Type
              </label>
              <select
                value={filters.typeId || ''}
                onChange={(e) => handleFilterChange('typeId', e.target.value || undefined)}
                className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoadingReference}
              >
                <option value="">All Types</option>
                {referenceData.types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Rarity filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rarity
              </label>
              <select
                value={filters.rarityId || ''}
                onChange={(e) => handleFilterChange('rarityId', e.target.value || undefined)}
                className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoadingReference}
              >
                <option value="">All Rarities</option>
                {referenceData.rarities.map((rarity) => (
                  <option key={rarity.id} value={rarity.id}>
                    {rarity.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Set filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set
              </label>
              <select
                value={filters.setId || ''}
                onChange={(e) => handleFilterChange('setId', e.target.value || undefined)}
                className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoadingReference}
              >
                <option value="">All Sets</option>
                {referenceData.sets.map((set) => (
                  <option key={set.id} value={set.id}>
                    {set.name} ({set.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Faction filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faction
              </label>
              <select
                value={filters.faction || ''}
                onChange={(e) => handleFilterChange('faction', e.target.value || undefined)}
                className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Factions</option>
                <option value="Earth Federation">Earth Federation</option>
                <option value="Zeon">Zeon</option>
                <option value="AEUG">AEUG</option>
                <option value="Titans">Titans</option>
                <option value="Celestial Being">Celestial Being</option>
                <option value="A-Laws">A-Laws</option>
              </select>
            </div>

            {/* Series filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Series
              </label>
              <select
                value={filters.series || ''}
                onChange={(e) => handleFilterChange('series', e.target.value || undefined)}
                className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Series</option>
                <option value="UC">Universal Century</option>
                <option value="CE">Cosmic Era</option>
                <option value="AD">Anno Domini</option>
                <option value="AG">Advanced Generation</option>
                <option value="PD">Post Disaster</option>
              </select>
            </div>

            {/* Level range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Min"
                  value={filters.levelMin || ''}
                  onChange={(e) => handleFilterChange('levelMin', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Max"
                  value={filters.levelMax || ''}
                  onChange={(e) => handleFilterChange('levelMax', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Cost range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="20"
                  placeholder="Min"
                  value={filters.costMin || ''}
                  onChange={(e) => handleFilterChange('costMin', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="number"
                  min="0"
                  max="20"
                  placeholder="Max"
                  value={filters.costMax || ''}
                  onChange={(e) => handleFilterChange('costMax', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Special card types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Types
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isFoil || false}
                    onChange={(e) => handleFilterChange('isFoil', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Foil Cards</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isPromo || false}
                    onChange={(e) => handleFilterChange('isPromo', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Promo Cards</span>
                </label>
              </div>
            </div>
          </div>

          {/* Clear filters button */}
          {Object.keys(filters).length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="mt-2 text-sm text-gray-500">
          Searching...
        </div>
      )}
    </div>
  );
};

export default CardSearch;