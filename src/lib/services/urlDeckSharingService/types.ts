/**
 * URL Deck Sharing types
 */

import { CardWithRelations } from '@/lib/types/card';

export interface ShareableDeck {
  id: string;
  name: string;
  description?: string;
  cards: Array<{
    cardId: string;
    card: CardWithRelations;
    quantity: number;
    category: string;
  }>;
  createdAt: Date;
  format?: string;
}

export interface EncodedDeckData {
  name: string;
  description?: string;
  cards: Array<{
    id: string;
    quantity: number;
    category: string;
  }>;
  format?: string;
  timestamp: number;
}
