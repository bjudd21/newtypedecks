/**
 * Type Definitions for Deck Export/Import Service
 */

import type { CardWithRelations } from '@/lib/types/card';

export interface DeckCard {
  card: CardWithRelations;
  quantity: number;
  category?: string;
}

export interface ExportableDeck {
  name: string;
  description?: string;
  cards: DeckCard[];
  createdAt: Date;
  format?: string;
  metadata?: {
    totalCards: number;
    uniqueCards: number;
    totalCost: number;
    factions: string[];
    sets: string[];
  };
}

export interface ExportOptions {
  format: 'json' | 'text' | 'csv' | 'mtga' | 'cockatrice';
  includeMetadata?: boolean;
  includeStats?: boolean;
  groupByType?: boolean;
  sortBy?: 'name' | 'cost' | 'type' | 'quantity';
  sortOrder?: 'asc' | 'desc';
}

export interface ImportResult {
  success: boolean;
  deck?: ExportableDeck;
  errors: string[];
  warnings: string[];
}
