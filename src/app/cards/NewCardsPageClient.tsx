'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CardGrid } from '@/components/card/CardGrid';
import { CardDetailOverlay } from '@/components/card/CardDetailOverlay';
import { Input, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type {
  CardWithRelations,
  CardSearchFilters,
  CardSearchOptions,
  CardSortField,
} from '@/lib/types/card';

export function NewCardsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cards, setCards] = useState<CardWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardWithRelations | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [_selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<CardSortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Initialize from URL params
  useEffect(() => {
    const search = searchParams.get('search');
    const advanced = searchParams.get('advanced');
    const help = searchParams.get('help');
    const view = searchParams.get('view');
    const random = searchParams.get('random');

    if (search) {
      setSearchQuery(search);
      handleSearch(search);
    } else if (random === 'true') {
      handleRandomCard();
    } else if (!advanced && !help && !view) {
      // Load initial cards
      handleSearch();
    }
  }, [searchParams]);

  const handleSearch = useCallback(
    async (query?: string) => {
      setLoading(true);
      try {
        const filters: CardSearchFilters = {};
        if (query || searchQuery) {
          filters.name = query || searchQuery;
        }

        const options: CardSearchOptions = {
          page: currentPage,
          limit: 20,
          sortBy,
          sortOrder,
          includeRelations: true,
        };

        const response = await fetch('/api/cards/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filters, options }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }

        const result = await response.json();
        setCards(result.cards);
        setTotalResults(result.total);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Error searching cards:', error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, currentPage, sortBy, sortOrder]
  );

  const handleRandomCard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cards/random');
      if (response.ok) {
        const randomCard = await response.json();
        setSelectedCard(randomCard);
      }
    } catch (error) {
      console.error('Error fetching random card:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCardClick = useCallback((card: CardWithRelations) => {
    setSelectedCard(card);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    handleSearch();
  };

  // Toggle color filter
  const toggleColorFilter = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Toggle type filter
  const toggleTypeFilter = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedColors([]);
    setSelectedTypes([]);
    setSelectedSets([]);
  };

  // Apply filters when they change
  useEffect(() => {
    if (selectedColors.length > 0 || selectedTypes.length > 0) {
      handleSearch();
    }
  }, [selectedColors, selectedTypes]);

  return (
    <div className="min-h-screen space-y-6">
      {/* Header with search */}
      <div className="flex items-center gap-4 rounded-lg border border-[#443a5c] bg-[#2d2640] p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#6b5a8a] to-[#8b7aaa] shadow-lg">
          <svg
            className="h-5 w-5 text-white"
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
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards by name, type, or ability..."
            className="flex-1 border-[#443a5c] bg-[#1a1625] text-white placeholder-gray-500 focus:border-[#6b5a8a] focus:ring-[#6b5a8a]/30"
          />
          <Button
            type="submit"
            className="bg-[#6b5a8a] px-6 text-white hover:bg-[#8b7aaa]"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      {/* Filters and controls */}
      <div className="space-y-3">
        {/* Main filter bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#443a5c] bg-[#2d2640] p-4">
          {/* Color filters */}
          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs font-medium text-gray-400">
              COLOR:
            </span>
            <button
              onClick={() => toggleColorFilter('blue')}
              className={cn(
                'h-7 w-7 cursor-pointer rounded-md bg-blue-600 shadow-md transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-[#6b5a8a]',
                selectedColors.includes('blue')
                  ? 'scale-110 ring-2 ring-[#6b5a8a] ring-offset-2 ring-offset-[#2d2640]'
                  : 'hover:scale-105 hover:ring-2 hover:ring-[#6b5a8a]/50'
              )}
              title="Filter by Blue"
              aria-pressed={selectedColors.includes('blue')}
            />
            <button
              onClick={() => toggleColorFilter('green')}
              className={cn(
                'h-7 w-7 cursor-pointer rounded-md bg-green-600 shadow-md transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-[#6b5a8a]',
                selectedColors.includes('green')
                  ? 'scale-110 ring-2 ring-[#6b5a8a] ring-offset-2 ring-offset-[#2d2640]'
                  : 'hover:scale-105 hover:ring-2 hover:ring-[#6b5a8a]/50'
              )}
              title="Filter by Green"
              aria-pressed={selectedColors.includes('green')}
            />
            <button
              onClick={() => toggleColorFilter('red')}
              className={cn(
                'h-7 w-7 cursor-pointer rounded-md bg-red-600 shadow-md transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-[#6b5a8a]',
                selectedColors.includes('red')
                  ? 'scale-110 ring-2 ring-[#6b5a8a] ring-offset-2 ring-offset-[#2d2640]'
                  : 'hover:scale-105 hover:ring-2 hover:ring-[#6b5a8a]/50'
              )}
              title="Filter by Red"
              aria-pressed={selectedColors.includes('red')}
            />
            <button
              onClick={() => toggleColorFilter('purple')}
              className={cn(
                'h-7 w-7 cursor-pointer rounded-md bg-purple-600 shadow-md transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-[#6b5a8a]',
                selectedColors.includes('purple')
                  ? 'scale-110 ring-2 ring-[#6b5a8a] ring-offset-2 ring-offset-[#2d2640]'
                  : 'hover:scale-105 hover:ring-2 hover:ring-[#6b5a8a]/50'
              )}
              title="Filter by Purple"
              aria-pressed={selectedColors.includes('purple')}
            />
            <button
              onClick={() => toggleColorFilter('white')}
              className={cn(
                'h-7 w-7 cursor-pointer rounded-md border border-gray-300 bg-white shadow-md transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-[#6b5a8a]',
                selectedColors.includes('white')
                  ? 'scale-110 ring-2 ring-[#6b5a8a] ring-offset-2 ring-offset-[#2d2640]'
                  : 'hover:scale-105 hover:ring-2 hover:ring-[#6b5a8a]/50'
              )}
              title="Filter by White"
              aria-pressed={selectedColors.includes('white')}
            />
            <button
              onClick={() => toggleColorFilter('colorless')}
              className={cn(
                'h-7 w-7 cursor-pointer rounded-md bg-gray-400 shadow-md transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-[#6b5a8a]',
                selectedColors.includes('colorless')
                  ? 'scale-110 ring-2 ring-[#6b5a8a] ring-offset-2 ring-offset-[#2d2640]'
                  : 'hover:scale-105 hover:ring-2 hover:ring-[#6b5a8a]/50'
              )}
              title="Filter by Colorless"
              aria-pressed={selectedColors.includes('colorless')}
            />
          </div>

          <div className="h-7 w-px bg-[#443a5c]" />

          {/* Type filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-gray-400">
              TYPE:
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleTypeFilter('Unit')}
              className={cn(
                'h-7 px-3 text-xs transition-all duration-300',
                selectedTypes.includes('Unit')
                  ? 'border-[#8b7aaa] bg-[#6b5a8a] text-white shadow-md'
                  : 'border-[#443a5c] bg-[#1a1625] text-white hover:border-[#6b5a8a] hover:bg-[#2d2640]'
              )}
            >
              Unit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleTypeFilter('Command')}
              className={cn(
                'h-7 px-3 text-xs transition-all duration-300',
                selectedTypes.includes('Command')
                  ? 'border-[#8b7aaa] bg-[#6b5a8a] text-white shadow-md'
                  : 'border-[#443a5c] bg-[#1a1625] text-white hover:border-[#6b5a8a] hover:bg-[#2d2640]'
              )}
            >
              Command
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleTypeFilter('Base')}
              className={cn(
                'h-7 px-3 text-xs transition-all duration-300',
                selectedTypes.includes('Base')
                  ? 'border-[#8b7aaa] bg-[#6b5a8a] text-white shadow-md'
                  : 'border-[#443a5c] bg-[#1a1625] text-white hover:border-[#6b5a8a] hover:bg-[#2d2640]'
              )}
            >
              Base
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleTypeFilter('Pilot')}
              className={cn(
                'h-7 px-3 text-xs transition-all duration-300',
                selectedTypes.includes('Pilot')
                  ? 'border-[#8b7aaa] bg-[#6b5a8a] text-white shadow-md'
                  : 'border-[#443a5c] bg-[#1a1625] text-white hover:border-[#6b5a8a] hover:bg-[#2d2640]'
              )}
            >
              Pilot
            </Button>
          </div>

          <div className="h-7 w-px bg-[#443a5c]" />

          {/* Quick actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-[#443a5c] bg-[#1a1625] px-3 text-xs text-white hover:border-[#6b5a8a] hover:bg-[#6b5a8a]"
              onClick={() => router.push('/cards?view=sets')}
            >
              📚 Sets
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-[#443a5c] bg-[#1a1625] px-3 text-xs text-white hover:border-[#6b5a8a] hover:bg-[#6b5a8a]"
              onClick={handleRandomCard}
            >
              🎲 Random
            </Button>
          </div>

          {/* View toggles */}
          <div className="ml-auto flex items-center gap-1 overflow-hidden rounded-md border border-[#443a5c]">
            <button
              className="bg-[#6b5a8a] p-2 transition-colors hover:bg-[#8b7aaa]"
              title="Grid view"
            >
              <svg
                className="h-4 w-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              className="bg-[#1a1625] p-2 transition-colors hover:bg-[#2d2640]"
              title="List view"
            >
              <svg
                className="h-4 w-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Active filters display */}
        {(selectedColors.length > 0 || selectedTypes.length > 0) && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#443a5c] bg-[#1a1625] p-3">
            <span className="text-xs font-medium text-gray-400">
              Active filters:
            </span>

            {/* Color filter badges */}
            {selectedColors.map((color) => (
              <Badge
                key={color}
                className="flex cursor-pointer items-center gap-1.5 bg-[#6b5a8a] px-2.5 py-1 text-white transition-colors duration-200 hover:bg-[#8b7aaa]"
                onClick={() => toggleColorFilter(color)}
              >
                <span className="capitalize">{color}</span>
                <span className="text-xs">✕</span>
              </Badge>
            ))}

            {/* Type filter badges */}
            {selectedTypes.map((type) => (
              <Badge
                key={type}
                className="flex cursor-pointer items-center gap-1.5 bg-[#6b5a8a] px-2.5 py-1 text-white transition-colors duration-200 hover:bg-[#8b7aaa]"
                onClick={() => toggleTypeFilter(type)}
              >
                {type}
                <span className="text-xs">✕</span>
              </Badge>
            ))}

            {/* Clear all button */}
            <button
              onClick={clearAllFilters}
              className="ml-auto text-xs font-medium text-[#8b7aaa] transition-colors duration-200 hover:text-[#a89ec7]"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Sort bar and results */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-gray-400">Sort by:</span>
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split(':');
                setSortBy(field as CardSortField);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="h-8 rounded-md border-[#443a5c] bg-[#2d2640] px-3 text-sm text-white focus:border-[#6b5a8a] focus:outline-none focus:ring-[#6b5a8a]/30"
            >
              <option value="name:asc">Name (A-Z)</option>
              <option value="cost:asc">Cost (Low to High)</option>
              <option value="level:asc">Level (Low to High)</option>
              <option value="attack:desc">Attack (High to Low)</option>
              <option value="createdAt:desc">Recently Added</option>
            </select>
          </div>

          {/* Results count */}
          {totalResults > 0 && (
            <div className="text-sm font-medium">
              <span className="text-white">{totalResults}</span>
              <span className="ml-1 text-gray-400">cards found</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg border border-[#443a5c] bg-[#2d2640] p-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="border-[#443a5c] bg-[#1a1625] text-white hover:border-[#6b5a8a] hover:bg-[#6b5a8a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Previous
            </Button>
            <div className="rounded-md border border-[#443a5c] bg-[#1a1625] px-4 py-1.5 text-sm">
              <span className="font-medium text-white">{currentPage}</span>
              <span className="mx-1 text-gray-400">/</span>
              <span className="text-gray-400">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || loading}
              className="border-[#443a5c] bg-[#1a1625] text-white hover:border-[#6b5a8a] hover:bg-[#6b5a8a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next →
            </Button>
          </div>

          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* Card Grid */}
      <div className="pb-6">
        <CardGrid
          cards={cards}
          onCardClick={handleCardClick}
          loading={loading}
        />
      </div>

      {/* Bottom navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-[#443a5c] bg-[#2d2640] p-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
            className="border-[#443a5c] bg-[#1a1625] text-white hover:border-[#6b5a8a] hover:bg-[#6b5a8a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Previous
          </Button>
          <div className="rounded-md border border-[#443a5c] bg-[#1a1625] px-4 py-1.5 text-sm">
            <span className="font-medium text-white">{currentPage}</span>
            <span className="mx-1 text-gray-400">/</span>
            <span className="text-gray-400">{totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages || loading}
            className="border-[#443a5c] bg-[#1a1625] text-white hover:border-[#6b5a8a] hover:bg-[#6b5a8a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next →
          </Button>
        </div>
      )}

      {/* Card Detail Overlay */}
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
