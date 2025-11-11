'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CardGrid } from '@/components/card/CardGrid';
import { CardDetailOverlay } from '@/components/card/CardDetailOverlay';
import { SearchHeader } from '@/components/card/SearchHeader';
import { ColorFilters } from '@/components/card/ColorFilters';
import { TypeFilters } from '@/components/card/TypeFilters';
import { ActiveFiltersDisplay } from '@/components/card/ActiveFiltersDisplay';
import { PaginationBar } from '@/components/card/PaginationBar';
import { Button } from '@/components/ui';
import type {
  CardWithRelations,
  CardSearchFilters,
  CardSearchOptions,
  CardSortField,
} from '@/lib/types/card';

async function fetchCards(
  filters: CardSearchFilters,
  options: CardSearchOptions
) {
  const response = await fetch('/api/cards/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filters, options }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }

  return response.json();
}

async function fetchRandomCard() {
  const response = await fetch('/api/cards/random');
  if (response.ok) {
    return response.json();
  }
  throw new Error('Failed to fetch random card');
}

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

        const result = await fetchCards(filters, options);
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
      const randomCard = await fetchRandomCard();
      setSelectedCard(randomCard);
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

  const toggleColorFilter = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setSelectedColors([]);
    setSelectedTypes([]);
    setSelectedSets([]);
  };

  // Initialize from URL params
  useEffect(() => {
    const search = searchParams.get('search');
    const random = searchParams.get('random');

    if (search) {
      setSearchQuery(search);
      handleSearch(search);
    } else if (random === 'true') {
      handleRandomCard();
    } else if (
      !searchParams.get('advanced') &&
      !searchParams.get('help') &&
      !searchParams.get('view')
    ) {
      handleSearch();
    }
  }, [searchParams]);

  // Apply filters when they change
  useEffect(() => {
    if (selectedColors.length > 0 || selectedTypes.length > 0) {
      handleSearch();
    }
  }, [selectedColors, selectedTypes]);

  return (
    <div className="min-h-screen space-y-6">
      <SearchHeader
        searchQuery={searchQuery}
        loading={loading}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#443a5c] bg-[#2d2640] p-4">
          <ColorFilters
            selectedColors={selectedColors}
            onToggleColor={toggleColorFilter}
          />

          <div className="h-7 w-px bg-[#443a5c]" />

          <TypeFilters
            selectedTypes={selectedTypes}
            onToggleType={toggleTypeFilter}
          />

          <div className="h-7 w-px bg-[#443a5c]" />

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

        <ActiveFiltersDisplay
          selectedColors={selectedColors}
          selectedTypes={selectedTypes}
          onToggleColor={toggleColorFilter}
          onToggleType={toggleTypeFilter}
          onClearAll={clearAllFilters}
        />

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
              className="h-8 rounded-md border-[#443a5c] bg-[#2d2640] px-3 text-sm text-white focus:border-[#6b5a8a] focus:ring-[#6b5a8a]/30 focus:outline-none"
            >
              <option value="name:asc">Name (A-Z)</option>
              <option value="cost:asc">Cost (Low to High)</option>
              <option value="level:asc">Level (Low to High)</option>
              <option value="attack:desc">Attack (High to Low)</option>
              <option value="createdAt:desc">Recently Added</option>
            </select>
          </div>

          {totalResults > 0 && (
            <div className="text-sm font-medium">
              <span className="text-white">{totalResults}</span>
              <span className="ml-1 text-gray-400">cards found</span>
            </div>
          )}
        </div>
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
