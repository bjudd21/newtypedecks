/**
 * Deck Factory Utility
 * Helper functions for creating new deck instances
 */

import { defaultCategoriesFromCardTypes } from '@/lib/types/deck';
import type { Deck, DeckCard, Prisma } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

type DeckWithCards = Deck & {
  cards: (DeckCard & { card: CardWithRelations })[];
};

export const createNewDeck = (
  isAuthenticated: boolean,
  userId?: string,
  cardTypes?: string[]
): DeckWithCards =>
  // Cast required: this is a local temp object before the deck is persisted.
  // The Deck schema has a legacy `isPublic` column pending migration; visibility is the source of truth.
  ({
    id: `temp-${Date.now()}`,
    name: 'New Deck',
    description: '',
    userId: isAuthenticated ? userId || 'authenticated' : 'anonymous',
    gameId: null,
    visibility: 'DRAFT' as const,
    ruleset: 'COMPETITIVE' as const,
    deckCode: null,
    viewCount: 0,
    likeCount: 0,
    currentVersion: 1,
    versionName: null,
    isTemplate: false,
    templateSource: null,
    categories: cardTypes
      ? (defaultCategoriesFromCardTypes(
          cardTypes
        ) as unknown as Prisma.JsonValue)
      : null,
    createdAt: new Date(),
    updatedAt: new Date(),
    cards: [],
  }) as unknown as DeckWithCards;
