/**
 * Type definitions for AnonymousDeckBuilder component
 */

import type { CardWithRelations } from '@/lib/types/card';
import type { DeckCard } from '@prisma/client';

export interface AnonymousDeckBuilderProps {
  className?: string;
}

export interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

export interface DeckStats {
  totalCards: number;
  uniqueCards: number;
  totalCost: number;
}

export interface CardsByType {
  [type: string]: DeckCardWithCard[];
}

export interface ShareableDeck {
  id: string;
  name: string;
  description?: string;
  format?: string;
  createdAt: Date;
  cards: Array<{
    cardId: string;
    card: CardWithRelations;
    quantity: number;
    category: string;
  }>;
}

export interface ExportableDeck {
  cards: Array<{
    card: CardWithRelations;
    quantity: number;
    category: string | null;
  }>;
}

export type ExportFormat = 'json' | 'text' | 'csv' | 'mtga';
export type SaveStatus = 'saved' | 'saving' | 'error' | 'offline';
