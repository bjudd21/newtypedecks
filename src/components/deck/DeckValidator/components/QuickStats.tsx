/**
 * Quick stats component
 */

import React from 'react';
import type { DeckCard } from '../types';

interface QuickStatsProps {
  cards: DeckCard[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({ cards }) => {
  return (
    <div className="border-t border-[#443a5c] pt-3">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-400">Total Cards:</span>
          <span className="ml-1 font-semibold text-[#a89ec7]">
            {cards.reduce((sum, card) => sum + card.quantity, 0)}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Unique Cards:</span>
          <span className="ml-1 font-semibold text-[#a89ec7]">
            {cards.length}
          </span>
        </div>
      </div>
    </div>
  );
};
