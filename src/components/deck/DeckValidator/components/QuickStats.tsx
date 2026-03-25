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
    <div className="border-border border-t pt-3">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Total Cards:</span>
          <span className="text-primary/80 ml-1 font-semibold">
            {cards.reduce((sum, card) => sum + card.quantity, 0)}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Unique Cards:</span>
          <span className="text-primary/80 ml-1 font-semibold">
            {cards.length}
          </span>
        </div>
      </div>
    </div>
  );
};
