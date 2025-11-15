/**
 * Deck Validation Types
 */

import type { CardWithRelations } from '@/lib/types/card';

export interface DeckCard {
  card: CardWithRelations;
  quantity: number;
  category?: string;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: 'structure' | 'content' | 'balance' | 'legality';
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  rule: ValidationRule;
  isValid: boolean;
  message: string;
  details?: string;
  affectedCards?: string[]; // Card IDs
}

export interface DeckValidationSummary {
  isValid: boolean;
  totalResults: number;
  errors: ValidationResult[];
  warnings: ValidationResult[];
  info: ValidationResult[];
  score: number; // 0-100, where 100 is perfectly valid
}
