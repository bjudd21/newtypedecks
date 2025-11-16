/**
 * Deck Calculations Utility
 * Helper functions for calculating deck statistics
 */

import type { CardWithRelations } from '@/lib/types/card';

interface DeckCard {
  card: CardWithRelations;
  quantity: number;
  cardId: string;
  category: string | null;
}

export function calculateDeckStats(cards: DeckCard[]) {
  const totalCards = cards.reduce((sum, deckCard) => sum + deckCard.quantity, 0);
  const uniqueCards = cards.length;
  const totalCost = cards.reduce(
    (sum, deckCard) => sum + (deckCard.card.cost ?? 0) * deckCard.quantity,
    0
  );

  return { totalCards, uniqueCards, totalCost };
}

export function groupCardsByType(cards: DeckCard[]) {
  return cards.reduce(
    (acc, deckCard) => {
      const type = deckCard.card.type?.name || 'Unknown';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(deckCard);
      return acc;
    },
    {} as Record<string, DeckCard[]>
  );
}
