/**
 * JSON Export Format
 */

import type { ExportableDeck, ExportOptions, DeckCard } from '../types';
import { sortCards } from '../utils';

/**
 * Read a string field from a card's gameAttributes JSONB.
 * Returns undefined if absent or not a string.
 */
function getGameAttr(
  attrs: DeckCard['card']['gameAttributes'],
  field: string
): string | undefined {
  if (!attrs || typeof attrs !== 'object' || Array.isArray(attrs))
    return undefined;
  const value = (attrs as Record<string, unknown>)[field];
  return typeof value === 'string' ? value : undefined;
}

/**
 * Export to JSON format
 */
export function exportToJSON(
  deck: ExportableDeck,
  options: ExportOptions
): string {
  const exportData = {
    name: deck.name,
    description: deck.description,
    createdAt: deck.createdAt.toISOString(),
    format: options.gameName ?? 'Card Game',
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
      faction: getGameAttr(deckCard.card.gameAttributes, 'faction'),
      pilot: getGameAttr(deckCard.card.gameAttributes, 'pilot'),
      model: getGameAttr(deckCard.card.gameAttributes, 'model'),
    })),
  };

  return JSON.stringify(exportData, null, 2);
}
