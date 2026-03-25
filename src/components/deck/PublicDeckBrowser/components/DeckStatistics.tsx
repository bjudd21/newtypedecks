/**
 * Deck statistics display component
 */

import React from 'react';

interface DeckStatisticsProps {
  totalCards: number;
  uniqueCards: number;
  averageCost: number;
}

export const DeckStatistics: React.FC<DeckStatisticsProps> = ({
  totalCards,
  uniqueCards,
  averageCost,
}) => {
  return (
    <div className="mb-4 grid grid-cols-3 gap-2 text-center">
      <div>
        <div className="font-semibold text-blue-600">{totalCards}</div>
        <div className="text-muted-foreground text-xs">Cards</div>
      </div>
      <div>
        <div className="font-semibold text-green-600">{uniqueCards}</div>
        <div className="text-muted-foreground text-xs">Unique</div>
      </div>
      <div>
        <div className="font-semibold text-purple-600">{averageCost}</div>
        <div className="text-muted-foreground text-xs">Avg Cost</div>
      </div>
    </div>
  );
};
