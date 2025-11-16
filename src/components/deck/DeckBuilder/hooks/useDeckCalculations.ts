/**
 * Custom hook for deck statistics calculations
 */

import { useMemo } from 'react';
import {
  calculateDeckStats,
  groupCardsByType,
} from '@/lib/utils/deckCalculations';
import type { Deck } from '@prisma/client';
import type { DeckCard as PrismaDeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

// Local DeckCard type matching deckCalculations.ts
interface DeckCard {
  card: CardWithRelations;
  quantity: number;
  cardId: string;
  category: string | null;
}

interface DeckWithCards extends Deck {
  cards: (PrismaDeckCard & { card: CardWithRelations })[];
}

interface UseDeckCalculationsOptions {
  currentDeck: DeckWithCards | null;
}

export function useDeckCalculations({ currentDeck }: UseDeckCalculationsOptions) {
  // Calculate deck statistics
  const stats = useMemo(() => {
    if (!currentDeck) {
      return { totalCards: 0, uniqueCards: 0, totalCost: 0 };
    }
    return calculateDeckStats(currentDeck.cards);
  }, [currentDeck]);

  // Group cards by type
  const cardsByType = useMemo(() => {
    if (!currentDeck) {
      return {};
    }
    // groupCardsByType expects the deck card format from deckCalculations.ts
    // but we need to return the format expected by DeckContentPanel
    return groupCardsByType(currentDeck.cards as unknown as DeckCard[]) as unknown as Record<string, (PrismaDeckCard & { card: CardWithRelations })[]>;
  }, [currentDeck]);

  return {
    totalCards: stats.totalCards,
    uniqueCards: stats.uniqueCards,
    totalCost: stats.totalCost,
    cardsByType,
  };
}
