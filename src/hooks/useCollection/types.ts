/**
 * Type definitions for collection hooks
 */

import type { CardWithRelations } from '@/lib/types/card';

export interface CollectionCard {
  cardId: string;
  card: CardWithRelations;
  quantity: number;
  condition: string;
  addedAt: Date | string;
  updatedAt: Date | string;
}

export interface Collection {
  userId: string;
  cards: CollectionCard[];
  statistics: {
    totalCards: number;
    uniqueCards: number;
    completionPercentage: number;
    totalValue: number;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CollectionOptions {
  page?: number;
  limit?: number;
  search?: string;
  rarity?: string;
  type?: string;
  faction?: string;
}
