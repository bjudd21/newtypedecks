/**
 * useCollectionQuantities Hook
 * Manages fetching and storing collection quantities for deck cards
 */

import { useState, useEffect } from 'react';
import { useCollection } from '@/hooks';
import type { Deck, DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckWithCards extends Deck {
  cards: (DeckCard & { card: CardWithRelations })[];
}

export const useCollectionQuantities = (
  isAuthenticated: boolean,
  currentDeck: DeckWithCards | null
) => {
  const { getCardQuantities } = useCollection();
  const [collectionQuantities, setCollectionQuantities] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (isAuthenticated && currentDeck && currentDeck.cards.length > 0) {
      const cardIds = currentDeck.cards.map(
        (deckCard: DeckCard & { card: CardWithRelations }) => deckCard.card.id
      );
      getCardQuantities(cardIds).then((quantities) => {
        setCollectionQuantities(quantities);
      });
    } else {
      setCollectionQuantities({});
    }
  }, [currentDeck, isAuthenticated, getCardQuantities]);

  return collectionQuantities;
};
