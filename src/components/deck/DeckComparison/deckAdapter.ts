/**
 * Adapts a ComparableDeck to the DeckVersion interface
 * expected by calculateChanges() in DeckVersionComparison/utils.ts
 */

import type {
  DeckVersion,
  DeckCard as VersionDeckCard,
} from '../DeckVersionComparison/types';
import type { ComparableDeck } from './types';

export function deckToDeckVersion(deck: ComparableDeck): DeckVersion {
  const cardCount = deck.cards.reduce((sum, c) => sum + c.quantity, 0);
  const totalCost = deck.cards.reduce(
    (sum, c) => sum + (c.card.cost ?? 0) * c.quantity,
    0
  );

  return {
    id: deck.id,
    version: 0,
    name: deck.name,
    createdAt: deck.createdAt,
    cardCount,
    uniqueCards: deck.cards.length,
    totalCost,
    cards: deck.cards.map(
      (dc): VersionDeckCard => ({
        id: dc.cardId,
        cardId: dc.cardId,
        quantity: dc.quantity,
        category: dc.category,
        card: {
          id: dc.card.id,
          name: dc.card.name,
          cost: dc.card.cost ?? undefined,
          type: dc.card.type ?? { name: 'Unknown' },
          rarity: dc.card.rarity ?? { name: 'Unknown' },
          imageUrl: dc.card.imageUrlSmall ?? dc.card.imageUrl ?? '',
        },
      })
    ),
  };
}
