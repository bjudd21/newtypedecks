/**
 * Current deck stats display component
 */

import React from 'react';

interface CurrentDeckStatsProps {
  deckName: string;
  cardCount: number;
  deckDescription?: string;
}

export const CurrentDeckStats: React.FC<CurrentDeckStatsProps> = ({
  deckName,
  cardCount,
  deckDescription,
}) => {
  return (
    <div className="bg-accent rounded-lg p-3">
      <div className="mb-2 text-sm font-medium text-gray-900">
        Current Deck:
      </div>
      <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm">
        <div>
          <strong>{deckName}</strong>
        </div>
        <div>{cardCount} cards</div>
        {deckDescription && (
          <div className="col-span-2 text-xs">{deckDescription}</div>
        )}
      </div>
    </div>
  );
};
