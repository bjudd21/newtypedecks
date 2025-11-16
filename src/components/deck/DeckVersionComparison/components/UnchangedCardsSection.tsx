/**
 * Unchanged cards section with collapsible details
 */

import React from 'react';
import { CardChangeItem } from './CardChangeItem';
import type { CardChange } from '../types';

interface UnchangedCardsSectionProps {
  unchangedCards: CardChange[];
}

export const UnchangedCardsSection: React.FC<UnchangedCardsSectionProps> = ({
  unchangedCards,
}) => {
  if (unchangedCards.length === 0) {
    return null;
  }

  return (
    <details>
      <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
        🔹 Unchanged Cards ({unchangedCards.length}) - Click to expand
      </summary>
      <div className="mt-2 space-y-2">
        {unchangedCards.map((change) => (
          <CardChangeItem key={change.cardId} change={change} imageSize={32} />
        ))}
      </div>
    </details>
  );
};
