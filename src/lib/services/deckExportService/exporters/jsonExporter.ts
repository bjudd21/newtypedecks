/**
 * JSON Export Format
 */

import type { ExportableDeck, ExportOptions, DeckCard } from '../types';
import type { CardSchemaCustomField } from '@/lib/types/game';
import { sortCards } from '../utils';

/**
 * Read a field from a card's gameAttributes JSONB.
 * Returns undefined if absent.
 */
function getGameAttr(
  attrs: DeckCard['card']['gameAttributes'],
  field: string
): string | undefined {
  if (!attrs || typeof attrs !== 'object' || Array.isArray(attrs))
    return undefined;
  const value = (attrs as Record<string, unknown>)[field];
  return value != null ? String(value) : undefined;
}

/**
 * Build game-specific attribute entries from customFields.
 */
function buildGameAttrs(
  attrs: DeckCard['card']['gameAttributes'],
  customFields: CardSchemaCustomField[]
): Record<string, string | undefined> {
  return Object.fromEntries(
    customFields.map((f) => [f.key, getGameAttr(attrs, f.key)])
  );
}

/**
 * Export to JSON format
 */
export function exportToJSON(
  deck: ExportableDeck,
  options: ExportOptions
): string {
  const customFields = options.customFields ?? [];
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
      ...buildGameAttrs(deckCard.card.gameAttributes, customFields),
    })),
  };

  return JSON.stringify(exportData, null, 2);
}
