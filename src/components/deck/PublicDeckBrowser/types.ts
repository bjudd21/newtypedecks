/**
 * Type definitions for PublicDeckBrowser components
 */

import type { Rarity } from '@prisma/client';

export interface PublicDeck {
  id: string;
  name: string;
  description?: string;
  format: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
  statistics: {
    totalCards: number;
    uniqueCards: number;
    totalCost: number;
    averageCost: number;
    colors: string[];
  };
  cardPreview: Array<{
    card: {
      id: string;
      name: string;
      imageUrl?: string;
      rarity: Rarity;
    };
    quantity: number;
  }>;
}

export interface PublicDeckBrowserProps {
  className?: string;
}

export interface DeckFilters {
  search: string;
  sortBy: string;
  sortOrder: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
