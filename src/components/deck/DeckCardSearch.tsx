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
      className={`hover:bg-accent hover:border-primary/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left transition-colors ${isDragging ? 'scale-95 transform opacity-50' : ''} ${ownedQuantity > 0 ? 'border-green-500/30 bg-green-900/20' : ''} `}
    >
      {/* Card Image Placeholder */}
      <div className="bg-muted relative h-16 w-12 flex-shrink-0 overflow-hidden rounded">
        {(card.imageUrlSmall ?? card.imageUrl) ? (
          <Image
            src={(card.imageUrlSmall ?? card.imageUrl)!}
            alt={card.name}
            fill
            loading="lazy"
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground/70 text-xs">IMG</span>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="min-w-0 flex-1">
        <div className="text-foreground truncate text-sm font-medium">
          {card.name}
        </div>

        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
          {card.type && (
            <span className="bg-muted rounded px-2 py-0.5">
              {card.type.name}
            </span>
          )}

          {card.rarity && (
            <span className="bg-muted rounded px-2 py-0.5">
              {card.rarity.name}
            </span>
          )}

          {card.cost !== null && card.cost !== undefined && (
            <span className="text-primary font-medium">Cost: {card.cost}</span>
          )}
        </div>

        <div className="text-muted-foreground/70 mt-1 text-xs">
          {card.set?.name} #{card.setNumber}
          {card.faction && ` • ${card.faction}`}
          {card.pilot && ` • ${card.pilot}`}
          {ownedQuantity > 0 && (
            <span className="ml-2 inline-flex items-center rounded bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-300">
              Owned: {ownedQuantity}
            </span>
          )}
        </div>
      </div>

      {/* Add Button Indicator */}
      <div className="flex-shrink-0">
        <div className="text-primary bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
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
          <h4 className="text-muted-foreground mb-3 text-sm font-medium">
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
