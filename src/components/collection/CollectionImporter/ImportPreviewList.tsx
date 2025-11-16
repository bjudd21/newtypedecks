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
      <div className="mb-2 text-sm font-medium text-gray-400">
        Preview (first 5 cards)
      </div>
      <div className="rounded border border-[#443a5c] bg-[#1a1625] p-3">
        {cards.map((card, index) => (
          <div key={index} className="flex items-center gap-4 py-1 text-sm">
            <span className="w-8 text-center font-mono">{card.quantity}x</span>
            <span className="flex-1 text-white">{card.cardName}</span>
            {card.setName && (
              <span className="text-xs text-gray-400">({card.setName})</span>
            )}
          </div>
        ))}
        <div className="mt-2 text-xs text-gray-400">
          Ready to import {cards.length} card types
        </div>
      </div>
    </div>
  );
};
