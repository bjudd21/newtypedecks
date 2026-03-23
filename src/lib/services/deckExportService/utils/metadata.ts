/**
 * Deck Metadata Utilities
 */

import type { ExportableDeck } from '../types';

/**
 * Enrich deck with calculated metadata
 */
export function enrichDeckWithMetadata(deck: ExportableDeck): ExportableDeck {
  const totalCards = deck.cards.reduce((sum, card) => sum + card.quantity, 0);
  const uniqueCards = deck.cards.length;
  const totalCost = deck.cards.reduce(
    (sum, deckCard) => sum + (deckCard.card.cost || 0) * deckCard.quantity,
    0
  );

  const factions = Array.from(
    new Set(
      deck.cards
        .map((deckCard) => {
          const attrs = deckCard.card.gameAttributes;
          if (!attrs || typeof attrs !== 'object' || Array.isArray(attrs))
            return undefined;
          const value = (attrs as Record<string, unknown>).faction;
          return typeof value === 'string' ? value : undefined;
        })
        .filter((faction): faction is string => Boolean(faction))
    )
  );

  const sets = Array.from(
    new Set(
      deck.cards
        .map((deckCard) => deckCard.card.set?.name)
        .filter((setName): setName is string => Boolean(setName))
    )
  );

  return {
    ...deck,
    metadata: {
      totalCards,
      uniqueCards,
      totalCost,
      factions,
      sets,
    },
  };
}
