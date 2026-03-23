'use client';
/**
 * Left panel: search bar + card grid results for proxy generator
 */

import React from 'react';
import Image from 'next/image';
import type { CardWithRelations } from '@/lib/types/card';
import { Button } from '@/components/ui/Button';

interface ProxySearchPanelProps {
  searchQuery: string;
  searchResults: CardWithRelations[];
  isSearching: boolean;
  hasSearched: boolean;
  currentPage: number;
  totalPages: number;
  onSearchQueryChange: (q: string) => void;
  onSearch: (q: string) => void;
  onAddCard: (card: CardWithRelations) => void;
  onAddCardMultiple: (card: CardWithRelations, qty: number) => void;
  onPageChange: (page: number) => void;
}

export function ProxySearchPanel({
  searchQuery,
  searchResults,
  isSearching,
  hasSearched,
  currentPage,
  totalPages,
  onSearchQueryChange,
  onSearch,
  onAddCard,
  onAddCardMultiple,
  onPageChange,
}: ProxySearchPanelProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch(searchQuery);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">Card Browser</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search cards by name..."
            className="flex-1 rounded-md border border-[#443a5c] bg-[#2d2640] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#8b7aaa] focus:outline-none"
          />
          <Button
            variant="primary"
            onClick={() => onSearch(searchQuery)}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {isSearching && (
        <div className="py-8 text-center text-sm text-gray-400">
          Searching...
        </div>
      )}

      {!isSearching && hasSearched && searchResults.length === 0 && (
        <div className="py-8 text-center text-sm text-gray-400">
          No cards found. Try a different search.
        </div>
      )}

      {!isSearching && !hasSearched && (
        <div className="py-8 text-center text-sm text-gray-500">
          Search for cards to add to your proxy sheet.
        </div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <>
          {/* Bulk add buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => searchResults.forEach((c) => onAddCard(c))}
            >
              Add 1× all
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                searchResults.forEach((c) => onAddCardMultiple(c, 3))
              }
            >
              Add 3× all
            </Button>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {searchResults.map((card) => (
              <button
                key={card.id}
                onClick={() => onAddCard(card)}
                title={`Add ${card.name}`}
                className="group relative flex flex-col items-center gap-1 rounded-md border border-transparent p-1 transition-colors hover:border-[#8b7aaa] hover:bg-[#2d2640]"
              >
                <div className="relative aspect-[5/7] w-full overflow-hidden rounded">
                  {(card.imageUrlSmall ?? card.imageUrl) ? (
                    <Image
                      src={(card.imageUrlSmall ?? card.imageUrl) as string}
                      alt={card.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#2d2640] text-xs text-gray-500">
                      No img
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-xl font-bold text-white">+</span>
                  </div>
                </div>
                <span className="line-clamp-1 w-full text-center text-xs text-gray-300">
                  {card.name}
                </span>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                ‹
              </Button>
              <span className="text-sm text-gray-400">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                ›
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
