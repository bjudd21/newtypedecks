/**
 * Card preview component for deck display
 */

import React from 'react';
import Image from 'next/image';
import type { PublicDeck } from '../types';

interface CardPreviewProps {
  cardPreview: PublicDeck['cardPreview'];
}

export const CardPreview: React.FC<CardPreviewProps> = ({ cardPreview }) => {
  if (cardPreview.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <p className="text-muted-foreground mb-2 text-xs">Preview:</p>
      <div className="flex space-x-1 overflow-x-auto">
        {cardPreview.map((cardEntry, index) => (
          <div key={index} className="flex-shrink-0">
            {cardEntry.card.imageUrl ? (
              <Image
                src={cardEntry.card.imageUrl}
                alt={cardEntry.card.name}
                width={48}
                height={64}
                loading="lazy"
                sizes="48px"
                className="h-16 w-12 rounded border object-cover"
              />
            ) : (
              <div className="flex h-16 w-12 items-center justify-center rounded border bg-gray-200">
                <span className="text-muted-foreground/70 text-xs">
                  {cardEntry.quantity}x
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
