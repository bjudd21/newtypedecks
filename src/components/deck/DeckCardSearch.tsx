'use client';

import React, { useState, useCallback } from 'react';
import CardSearch from '@/components/card/CardSearch';
import { CardWithRelations } from '@/lib/types/card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface DragData {
  cardId: string;
  cardName: string;
  action: 'move' | 'copy';
}

interface SearchResultCardProps {
  card: CardWithRelations;
  onClick: () => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ card, onClick }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    const dragData: DragData = {
      cardId: card.id,
      cardName: card.name,
      action: 'copy'
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
        flex items-center gap-3 p-3 text-left border rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors cursor-pointer
        ${isDragging ? 'opacity-50 transform scale-95' : ''}
      `}
    >
      {/* Card Image Placeholder */}
      <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <span className="text-xs text-gray-500">IMG</span>
        )}
      </div>

      {/* Card Details */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 truncate">
          {card.name}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
          {card.type && (
            <span className="bg-gray-100 px-2 py-0.5 rounded">
              {card.type.name}
            </span>
          )}

          {card.rarity && (
            <span className="bg-gray-100 px-2 py-0.5 rounded">
              {card.rarity.name}
            </span>
          )}

          {card.cost !== null && card.cost !== undefined && (
            <span className="text-blue-600 font-medium">
              Cost: {card.cost}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {card.set?.name} #{card.setNumber}
          {card.faction && ` • ${card.faction}`}
          {card.pilot && ` • ${card.pilot}`}
        </div>
      </div>

      {/* Add Button Indicator */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
  placeholder = "Search cards to add to deck...",
  showFilters = false,
  limit = 10,
  className
}) => {
  const [searchResults, setSearchResults] = useState<CardWithRelations[]>([]);

  // Handle search results from CardSearch component
  const handleSearchResults = useCallback((cards: CardWithRelations[]) => {
    const limitedCards = cards.slice(0, limit);
    setSearchResults(limitedCards);
    // Pass results to parent for drag-and-drop functionality
    onSearchResults?.(limitedCards);
  }, [limit, onSearchResults]);

  // Handle card selection from results
  const handleCardClick = useCallback((card: CardWithRelations) => {
    onCardSelect(card);
    // Clear search results after selection for better UX
    setSearchResults([]);
  }, [onCardSelect]);

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
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Search Results ({searchResults.length} cards)
          </h4>

          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {searchResults.map((card) => (
              <SearchResultCard
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckCardSearch;