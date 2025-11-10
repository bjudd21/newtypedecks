'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import CardSearch from '@/components/card/CardSearch';
import { CardWithRelations } from '@/lib/types/card';
import { useCollection } from '@/hooks';

interface DragData {
  cardId: string;
  cardName: string;
  action: 'move' | 'copy';
}

interface SearchResultCardProps {
  card: CardWithRelations;
  onClick: () => void;
  ownedQuantity?: number;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  card,
  onClick,
  ownedQuantity = 0,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    const dragData: DragData = {
      cardId: card.id,
      cardName: card.name,
      action: 'copy',
    };

    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={`
        flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:border-blue-300 hover:bg-gray-50
        ${isDragging ? 'scale-95 transform opacity-50' : ''}
        ${ownedQuantity > 0 ? 'border-green-300 bg-green-50' : ''}
      `}
    >
      {/* Card Image Placeholder */}
      <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-200">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-gray-500">IMG</span>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-gray-900">
          {card.name}
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
          {card.type && (
            <span className="rounded bg-gray-100 px-2 py-0.5">
              {card.type.name}
            </span>
          )}

          {card.rarity && (
            <span className="rounded bg-gray-100 px-2 py-0.5">
              {card.rarity.name}
            </span>
          )}

          {card.cost !== null && card.cost !== undefined && (
            <span className="font-medium text-blue-600">Cost: {card.cost}</span>
          )}
        </div>

        <div className="mt-1 text-xs text-gray-500">
          {card.set?.name} #{card.setNumber}
          {card.faction && ` • ${card.faction}`}
          {card.pilot && ` • ${card.pilot}`}
          {ownedQuantity > 0 && (
            <span className="ml-2 inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              Owned: {ownedQuantity}
            </span>
          )}
        </div>
      </div>

      {/* Add Button Indicator */}
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface DeckCardSearchProps {
  onCardSelect: (card: CardWithRelations) => void;
  onSearchResults?: (cards: CardWithRelations[]) => void;
  placeholder?: string;
  showFilters?: boolean;
  limit?: number;
  className?: string;
}

export const DeckCardSearch: React.FC<DeckCardSearchProps> = ({
  onCardSelect,
  onSearchResults,
  placeholder = 'Search cards to add to deck...',
  showFilters = false,
  limit = 10,
  className,
}) => {
  const [searchResults, setSearchResults] = useState<CardWithRelations[]>([]);
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>(
    {}
  );
  const { getCardQuantities } = useCollection();

  // Fetch collection quantities when search results change
  useEffect(() => {
    if (searchResults.length > 0) {
      const cardIds = searchResults.map((card) => card.id);
      getCardQuantities(cardIds).then((quantities) => {
        setCardQuantities(quantities);
      });
    } else {
      setCardQuantities({});
    }
  }, [searchResults, getCardQuantities]);

  // Handle search results from CardSearch component
  const handleSearchResults = useCallback(
    (cards: CardWithRelations[]) => {
      const limitedCards = cards.slice(0, limit);
      setSearchResults(limitedCards);
      // Pass results to parent for drag-and-drop functionality
      onSearchResults?.(limitedCards);
    },
    [limit, onSearchResults]
  );

  // Handle card selection from results
  const handleCardClick = useCallback(
    (card: CardWithRelations) => {
      onCardSelect(card);
      // Clear search results after selection for better UX
      setSearchResults([]);
    },
    [onCardSelect]
  );

  return (
    <div className={className}>
      <CardSearch
        onResults={handleSearchResults}
        placeholder={placeholder}
        showAdvancedFilters={showFilters}
        maxSuggestions={8}
      />

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            Search Results ({searchResults.length} cards)
          </h4>

          <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto">
            {searchResults.map((card) => (
              <SearchResultCard
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card)}
                ownedQuantity={cardQuantities[card.id] || 0}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckCardSearch;
