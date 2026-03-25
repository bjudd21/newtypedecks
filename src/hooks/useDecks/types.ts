/**
 * Type definitions for useDecks hook
 */

import type { CardWithRelations } from '@/lib/types/card';
import type { DeckVisibility } from '@prisma/client';

export interface DeckCard {
  cardId: string;
  card: CardWithRelations;
  quantity: number;
  category?: string;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  format?: string;
  visibility: DeckVisibility;
  deckCode?: string | null;
  cards: DeckCard[];
  cardCount?: number;
  uniqueCards?: number;
  totalCost?: number;
  colors?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CreateDeckData {
  name: string;
  description?: string;
  format?: string;
  visibility?: DeckVisibility;
  cards: DeckCard[];
}

export interface UpdateDeckData {
  name?: string;
  description?: string;
  format?: string;
  visibility?: DeckVisibility;
  cards?: DeckCard[];
}

export interface GetUserDecksOptions {
  page?: number;
  limit?: number;
  search?: string;
  format?: string;
}

export interface GetUserDecksResponse {
  decks: Deck[];
  pagination: Pagination;
}
