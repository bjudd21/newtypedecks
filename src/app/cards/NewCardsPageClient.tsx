'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CardGrid } from '@/components/card/CardGrid';
import { CardDetailOverlay } from '@/components/card/CardDetailOverlay';
import { Input, Button, Select, Badge } from '@/components/ui';
import type { CardWithRelations, CardSearchFilters, CardSearchOptions } from '@/lib/types/card';

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
  const [sortBy, setSortBy] = useState('name');
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
    <div className="space-y-6">
      {/* Header with search */}
      <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards..."
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Button type="submit" variant="cyber" disabled={loading}>
            Search
          </Button>
        </form>
      </div>

      {/* Filters and controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center gap-4">
          {/* View mode toggles */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">Cards</Button>
            <Button variant="outline" size="sm" className="text-xs">Images</Button>
          </div>

          {/* Quick filters */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/cards?advanced=true')}
            >
              Advanced
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/cards?help=syntax')}
            >
              Syntax
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/cards?view=sets')}
            >
              Sets
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRandomCard}
            >
              Random
            </Button>
          </div>
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">sorted by:</span>
          <Select
            value={`${sortBy}:${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split(':');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="bg-gray-700 border-gray-600 text-white text-sm"
          >
            <option value="name:asc">Name</option>
            <option value="cost:asc">Cost</option>
            <option value="level:asc">Level</option>
            <option value="attack:desc">Attack</option>
            <option value="createdAt:desc">Recently Added</option>
          </Select>

          {/* Auto checkbox */}
          <label className="flex items-center gap-1 text-sm text-gray-400">
            <input type="checkbox" className="rounded" />
            Auto
          </label>
        </div>
      </div>

      {/* Results count */}
      {totalResults > 0 && (
        <div className="text-sm text-gray-400">
          {totalResults} cards where the name includes "{searchQuery || 'all'}"
        </div>
      )}

      {/* Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
            >
              ◂ Previous
            </Button>
            <span className="px-3 py-1 text-sm text-gray-400">
              {currentPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next ▸
            </Button>
          </div>

          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* Card Grid */}
      <CardGrid
        cards={cards}
        onCardClick={handleCardClick}
        loading={loading}
      />

      {/* Bottom navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
          >
            ◂ Previous
          </Button>
          <span className="px-3 py-1 text-sm text-gray-400">
            {currentPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next ▸
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