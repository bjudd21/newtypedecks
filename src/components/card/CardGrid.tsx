'use client';

import React from 'react';
import Image from 'next/image';
import { CardWithRelations } from '@/lib/types/card';

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
      className="group relative cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
      onClick={handleClick}
    >
      {/* Card Image Container */}
      <div className="relative aspect-[5/7] overflow-hidden rounded-lg border-2 border-[#443a5c] bg-[#1a1625] shadow-lg transition-all hover:border-[#6b5a8a] hover:shadow-2xl hover:shadow-[#6b5a8a]/40">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2a1f3d] to-[#1a1625]">
            <div className="p-4 text-center">
              <svg
                className="mx-auto mb-2 h-10 w-10 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="line-clamp-2 text-xs font-medium text-gray-500">
                {card.name}
              </p>
            </div>
          </div>
        )}

        {/* Hover overlay with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#6b5a8a]/0 to-[#6b5a8a]/0 transition-all duration-300 group-hover:from-[#6b5a8a]/20 group-hover:to-transparent/5" />

        {/* Stats badges - top right */}
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          {card.cost !== undefined && (
            <div className="rounded-md border border-[#443a5c] bg-[#1a1625]/90 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
              {card.cost}
            </div>
          )}
          {card.level !== undefined && (
            <div className="rounded-md bg-[#6b5a8a]/90 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
              Lv {card.level}
            </div>
          )}
        </div>

        {/* Rarity indicator - top left */}
        {card.rarity && (
          <div className="absolute left-2 top-2">
            <div
              className={`h-2.5 w-2.5 rounded-full shadow-lg ${
                card.rarity.name?.toLowerCase().includes('secret')
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : card.rarity.name?.toLowerCase().includes('ultra')
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : card.rarity.name?.toLowerCase().includes('super')
                      ? 'bg-red-500'
                      : card.rarity.name?.toLowerCase().includes('rare')
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
              }`}
              title={card.rarity.name}
            />
          </div>
        )}
      </div>

      {/* Card ID/Number at bottom */}
      <div className="mt-2 text-center">
        <p className="font-mono text-xs tracking-tight text-gray-500">
          {card.setNumber || card.id}
        </p>
      </div>
    </div>
  );
};

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onCardClick,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <div
        className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 ${className}`}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[5/7] rounded-lg border-2 border-[#443a5c] bg-[#2d2640]" />
            <div className="mx-auto mt-2 h-3 w-3/4 rounded bg-[#2d2640]" />
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">
        <svg
          className="mx-auto mb-4 h-16 w-16 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-lg">No cards found</p>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 ${className}`}
    >
      {cards.map((card) => (
        <GridCard key={card.id} card={card} onClick={onCardClick} />
      ))}
    </div>
  );
};

export default CardGrid;
