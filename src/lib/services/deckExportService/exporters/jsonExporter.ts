/**
 * JSON Export Format
 */

import type { ExportableDeck, ExportOptions } from '../types';
import { sortCards } from '../utils';

/**
 * Export to JSON format
 */
export function exportToJSON(deck: ExportableDeck, options: ExportOptions): string {
  const exportData = {
    name: deck.name,
    description: deck.description,
    createdAt: deck.createdAt.toISOString(),
    format: 'Gundam Card Game',
    ...(options.includeMetadata && { metadata: deck.metadata }),
    cards: sortCards(deck.cards, options).map((deckCard) => ({
      id: deckCard.card.id,
      name: deckCard.card.name,
      quantity: deckCard.quantity,
      category: deckCard.category || 'main',
      set: deckCard.card.set?.name,
      setNumber: deckCard.card.setNumber,
      cost: deckCard.card.cost,
      type: deckCard.card.type?.name,
      rarity: deckCard.card.rarity?.name,
      faction: deckCard.card.faction,
      pilot: deckCard.card.pilot,
      model: deckCard.card.model,
    })),
  };

  return JSON.stringify(exportData, null, 2);
}
