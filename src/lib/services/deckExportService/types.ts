/**
 * Type Definitions for Deck Export/Import Service
 */

import type { CardWithRelations } from '@/lib/types/card';
import type { CardSchemaCustomField } from '@/lib/types/game';

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
  /** Game name for export attribution (e.g. from game.name) */
  gameName?: string;
  /** Game-specific custom fields — drives dynamic CSV columns and JSON keys. */
  customFields?: CardSchemaCustomField[];
}

export interface ImportResult {
  success: boolean;
  deck?: ExportableDeck;
  errors: string[];
  warnings: string[];
}
