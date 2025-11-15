/**
 * MTG Arena Format Export
 */

import type { ExportableDeck, ExportOptions } from '../types';
import { sortCards } from '../utils';

/**
 * Export to MTG Arena format (for compatibility with other deck builders)
 */
export function exportToMTGAFormat(
  deck: ExportableDeck,
  options: ExportOptions
): string {
  let output = 'Deck\n';

  const sortedCards = sortCards(deck.cards, options);

  for (const deckCard of sortedCards) {
    // MTG Arena format: "4 Lightning Bolt (M11) 114"
    output += `${deckCard.quantity} ${deckCard.card.name}`;

    if (deckCard.card.set?.code && deckCard.card.setNumber) {
      output += ` (${deckCard.card.set.code}) ${deckCard.card.setNumber}`;
    }

    output += '\n';
  }

  return output;
}
