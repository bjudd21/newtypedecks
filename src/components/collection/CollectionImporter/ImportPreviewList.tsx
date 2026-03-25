/**
 * ImportPreviewList Component
 * Displays preview of cards to be imported
 */

import React from 'react';
import type { PreviewCard } from '@/lib/types';

interface ImportPreviewListProps {
  cards: PreviewCard[];
}

export const ImportPreviewList: React.FC<ImportPreviewListProps> = ({
  cards,
}) => {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="text-muted-foreground mb-2 text-sm font-medium">
        Preview (first 5 cards)
      </div>
      <div className="border-border bg-background rounded border p-3">
        {cards.map((card, index) => (
          <div key={index} className="flex items-center gap-4 py-1 text-sm">
            <span className="w-8 text-center font-mono">{card.quantity}x</span>
            <span className="flex-1 text-white">{card.cardName}</span>
            {card.setName && (
              <span className="text-muted-foreground text-xs">
                ({card.setName})
              </span>
            )}
          </div>
        ))}
        <div className="text-muted-foreground mt-2 text-xs">
          Ready to import {cards.length} card types
        </div>
      </div>
    </div>
  );
};
