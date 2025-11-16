/**
 * TypeScript type definitions for CollectionManager
 */

import type {
  Card as CardType,
  CollectionStatistics as CollectionStats,
  CollectionPagination as CollectionPaginationType,
} from '@/lib/types';

export interface CollectionCard {
  cardId: string;
  card: CardType;
  quantity: number;
  condition: string;
  addedAt: Date | string;
  updatedAt: Date | string;
}

export interface CollectionData {
  userId: string;
  cards: CollectionCard[];
  statistics: CollectionStats;
  pagination?: CollectionPaginationType;
}

export interface CollectionFilters {
  search: string;
  rarity: string;
  type: string;
  faction: string;
  page: number;
  limit: number;
}

export interface CollectionManagerProps {
  className?: string;
}

export type { CollectionStats, CollectionPaginationType };
