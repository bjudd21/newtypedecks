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
      <div className="border-border bg-background hover:border-primary hover:shadow-primary/30 relative aspect-[5/7] overflow-hidden rounded-lg border-2 shadow-lg transition-all hover:shadow-2xl">
        {(card.imageUrlSmall ?? card.imageUrl) ? (
          <Image
            src={(card.imageUrlSmall ?? card.imageUrl)!}
            alt={card.name}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 23vw, 18vw"
          />
        ) : (
          <div className="from-card to-background flex h-full w-full items-center justify-center bg-gradient-to-br">
            <div className="p-4 text-center">
              <svg
                className="text-muted-foreground mx-auto mb-2 h-10 w-10"
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
              <p className="text-muted-foreground/70 line-clamp-2 text-xs font-medium">
                {card.name}
              </p>
            </div>
          </div>
        )}

        {/* Hover overlay with subtle gradient */}
        <div className="from-primary/0 to-primary/0 group-hover:from-primary/20 absolute inset-0 bg-gradient-to-t transition-all duration-300 group-hover:to-transparent/5" />

        {/* Stats badges - top right */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {card.cost !== undefined && (
            <div className="border-border bg-background/90 text-foreground rounded-md border px-2 py-0.5 text-xs font-bold backdrop-blur-sm">
              {card.cost}
            </div>
          )}
          {card.level !== undefined && (
            <div className="bg-primary/80/90 text-foreground rounded-md px-2 py-0.5 text-xs font-bold backdrop-blur-sm">
              Lv {card.level}
            </div>
          )}
        </div>

        {/* Rarity indicator - top left */}
        {card.rarity && (
          <div className="absolute top-2 left-2">
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
                        : 'bg-accent0'
              }`}
              title={card.rarity.name}
            />
          </div>
        )}
      </div>

      {/* Card ID/Number at bottom */}
      <div className="mt-2 text-center">
        <p className="text-muted-foreground/70 font-mono text-xs tracking-tight">
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
            <div className="border-border bg-card aspect-[5/7] rounded-lg border-2" />
            <div className="bg-card mx-auto mt-2 h-3 w-3/4 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-muted-foreground py-16 text-center">
        <svg
          className="text-muted-foreground mx-auto mb-4 h-16 w-16"
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
        <p className="text-muted-foreground/70 mt-2 text-sm">
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
