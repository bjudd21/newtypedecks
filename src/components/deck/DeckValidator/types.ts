/**
 * TypeScript type definitions for DeckValidator
 */

import type { CardWithRelations } from '@/lib/types/card';

export interface DeckCard {
  card: CardWithRelations;
  quantity: number;
  category?: string;
}

export interface DeckValidatorProps {
  cards: DeckCard[];
  className?: string;
  showDetails?: boolean;
  onlyErrors?: boolean;
  ruleset?: 'COMPETITIVE' | 'CASUAL';
}

export interface SeverityDisplay {
  icon: string;
  color: string;
}
