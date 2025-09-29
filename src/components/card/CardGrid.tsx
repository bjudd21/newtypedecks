'use client';

import React from 'react';
import { CardWithRelations } from '@/lib/types/card';
import { Badge } from '@/components/ui';

interface CardGridProps {
  cards: CardWithRelations[];
  onCardClick: (card: CardWithRelations) => void;
  loading?: boolean;
  className?: string;
}

interface GridCardProps {
  card: CardWithRelations;
  onClick: (card: CardWithRelations) => void;
}

const GridCard: React.FC<GridCardProps> = ({ card, onClick }) => {
  const handleClick = () => {
    onClick(card);
  };

  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors border border-gray-600"
      onClick={handleClick}
    >
      {/* Card Image */}
      <div className="aspect-[5/7] relative bg-gray-900">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Rarity indicator */}
        {card.rarity && (
          <div className="absolute top-2 right-2">
            <Badge
              className={`text-xs px-2 py-1 ${
                card.rarity.toLowerCase() === 'rare' ? 'bg-yellow-600' :
                card.rarity.toLowerCase() === 'super rare' ? 'bg-red-600' :
                card.rarity.toLowerCase() === 'ultra rare' ? 'bg-purple-600' :
                'bg-gray-600'
              }`}
            >
              {card.rarity}
            </Badge>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3">
        <h3 className="text-white text-sm font-medium mb-1 line-clamp-2">
          {card.name}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-400">
          {card.type && (
            <span className="truncate">{card.type}</span>
          )}

          {(card.cost !== undefined || card.level !== undefined) && (
            <div className="flex items-center gap-2">
              {card.cost !== undefined && (
                <span className="bg-gray-700 px-1 py-0.5 rounded">
                  {card.cost}
                </span>
              )}
              {card.level !== undefined && (
                <span className="bg-blue-700 px-1 py-0.5 rounded">
                  Lv.{card.level}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Set info */}
        {card.series && (
          <div className="mt-1 text-xs text-gray-500 truncate">
            {card.series}
          </div>
        )}
      </div>
    </div>
  );
};

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onCardClick,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden animate-pulse border border-gray-600"
          >
            <div className="aspect-[5/7] bg-gray-700" />
            <div className="p-3">
              <div className="h-4 bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No cards found</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {cards.map((card) => (
        <GridCard
          key={card.id}
          card={card}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default CardGrid;