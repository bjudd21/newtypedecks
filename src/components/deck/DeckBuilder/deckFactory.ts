/**
 * Deck Factory Utility
 * Helper functions for creating new deck instances
 */

import { defaultCategoriesFromCardTypes } from '@/lib/types/deck';
import type { Prisma } from '@prisma/client';

export const createNewDeck = (
  isAuthenticated: boolean,
  userId?: string,
  cardTypes?: string[]
) => ({
  id: `temp-${Date.now()}`,
  name: 'New Deck',
  description: '',
  isPublic: false,
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
    ? (defaultCategoriesFromCardTypes(cardTypes) as unknown as Prisma.JsonValue)
    : null,
  createdAt: new Date(),
  updatedAt: new Date(),
  cards: [],
});
