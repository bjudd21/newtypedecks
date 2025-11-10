'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CardGrid } from '@/components/card/CardGrid';
import { CardDetailOverlay } from '@/components/card/CardDetailOverlay';
import { Input, Button, Badge } from '@/components/ui';
import type { CardWithRelations, CardSearchFilters, CardSearchOptions, CardSortField } from '@/lib/types/card';

export function NewCardsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cards, setCards] = useState<CardWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardWithRelations | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
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

  const handleSearch = useCallback(async (query?: string) => {
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
  }, [searchQuery, currentPage, sortBy, sortOrder]);

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

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header with search */}
      <div className="flex items-center gap-4 p-4 bg-[#2d2640] rounded-lg border border-[#443a5c]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6b5a8a] to-[#8b7aaa] flex items-center justify-center flex-shrink-0 shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards by name, type, or ability..."
            className="flex-1 bg-[#1a1625] border-[#443a5c] text-white placeholder-gray-500 focus:border-[#6b5a8a] focus:ring-[#6b5a8a]/30"
          />
          <Button
            type="submit"
            className="bg-[#6b5a8a] hover:bg-[#8b7aaa] text-white px-6"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      {/* Filters and controls */}
      <div className="space-y-3">
        {/* Main filter bar */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-[#2d2640] rounded-lg border border-[#443a5c]">
          {/* Color filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-1">COLOR:</span>
            <button className="w-7 h-7 rounded-md bg-blue-600 hover:ring-2 ring-[#6b5a8a] transition-all shadow-md" title="Blue" />
            <button className="w-7 h-7 rounded-md bg-green-600 hover:ring-2 ring-[#6b5a8a] transition-all shadow-md" title="Green" />
            <button className="w-7 h-7 rounded-md bg-red-600 hover:ring-2 ring-[#6b5a8a] transition-all shadow-md" title="Red" />
            <button className="w-7 h-7 rounded-md bg-purple-600 hover:ring-2 ring-[#6b5a8a] transition-all shadow-md" title="Purple" />
            <button className="w-7 h-7 rounded-md bg-white hover:ring-2 ring-[#6b5a8a] transition-all shadow-md" title="White" />
            <button className="w-7 h-7 rounded-md bg-yellow-600 hover:ring-2 ring-[#6b5a8a] transition-all shadow-md" title="Yellow" />
            <button className="w-7 h-7 rounded-md bg-gray-400 hover:ring-2 ring-[#6b5a8a] transition-all shadow-md" title="Colorless" />
          </div>

          <div className="h-7 w-px bg-[#443a5c]" />

          {/* Type filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 font-medium mr-1">TYPE:</span>
            <Button variant="outline" size="sm" className="text-xs h-7 px-3 bg-[#1a1625] border-[#443a5c] hover:bg-[#6b5a8a] hover:border-[#6b5a8a] text-white">Unit</Button>
            <Button variant="outline" size="sm" className="text-xs h-7 px-3 bg-[#1a1625] border-[#443a5c] hover:bg-[#6b5a8a] hover:border-[#6b5a8a] text-white">Command</Button>
            <Button variant="outline" size="sm" className="text-xs h-7 px-3 bg-[#1a1625] border-[#443a5c] hover:bg-[#6b5a8a] hover:border-[#6b5a8a] text-white">Base</Button>
            <Button variant="outline" size="sm" className="text-xs h-7 px-3 bg-[#1a1625] border-[#443a5c] hover:bg-[#6b5a8a] hover:border-[#6b5a8a] text-white">Pilot</Button>
          </div>

          <div className="h-7 w-px bg-[#443a5c]" />

          {/* Quick actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-3 bg-[#1a1625] border-[#443a5c] hover:bg-[#6b5a8a] hover:border-[#6b5a8a] text-white"
              onClick={() => router.push('/cards?view=sets')}
            >
              📚 Sets
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-3 bg-[#1a1625] border-[#443a5c] hover:bg-[#6b5a8a] hover:border-[#6b5a8a] text-white"
              onClick={handleRandomCard}
            >
              🎲 Random
            </Button>
          </div>

          {/* View toggles */}
          <div className="ml-auto flex items-center gap-1 border border-[#443a5c] rounded-md overflow-hidden">
            <button className="p-2 bg-[#6b5a8a] hover:bg-[#8b7aaa] transition-colors" title="Grid view">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button className="p-2 bg-[#1a1625] hover:bg-[#2d2640] transition-colors" title="List view">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sort bar and results */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-400 font-medium">Sort by:</span>
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split(':');
                setSortBy(field as CardSortField);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="bg-[#2d2640] border-[#443a5c] text-white text-sm h-8 px-3 rounded-md focus:border-[#6b5a8a] focus:ring-[#6b5a8a]/30 focus:outline-none"
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
              <span className="text-gray-400 ml-1">cards found</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#2d2640] p-3 rounded-lg border border-[#443a5c]">
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="bg-[#1a1625] border-[#443a5c] hover:bg-[#6b5a8a] hover:border-[#6b5a8a] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </Button>
            <div className="px-4 py-1.5 text-sm bg-[#1a1625] border border-[#443a5c] rounded-md">
              <span className="text-white font-medium">{currentPage}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-gray-400">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || loading}
              className="bg-[#1a1625] border-[#443a5c] hover:bg-[#6b5a8a] hover:border-[#6b5a8a] text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="flex items-center justify-center gap-2 bg-[#2d2640] p-3 rounded-lg border border-[#443a5c]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
            className="bg-[#1a1625] border-[#443a5c] hover:bg-[#6b5a8a] hover:border-[#6b5a8a] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </Button>
          <div className="px-4 py-1.5 text-sm bg-[#1a1625] border border-[#443a5c] rounded-md">
            <span className="text-white font-medium">{currentPage}</span>
            <span className="text-gray-400 mx-1">/</span>
            <span className="text-gray-400">{totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || loading}
            className="bg-[#1a1625] border-[#443a5c] hover:bg-[#6b5a8a] hover:border-[#6b5a8a] text-white disabled:opacity-50 disabled:cursor-not-allowed"
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