/**
 * Validation Rules Definitions
 */

import type { ValidationRule } from './types';

/**
 * Standard Gundam Card Game validation rules
 */
export const VALIDATION_RULES: ValidationRule[] = [
  {
    id: 'deck-size-min',
    name: 'Minimum Deck Size',
    description: 'Deck must contain at least 50 cards',
    category: 'structure',
    severity: 'error',
  },
  {
    id: 'deck-size-max',
    name: 'Maximum Deck Size',
    description: 'Deck should not exceed 60 cards for optimal play',
    category: 'structure',
    severity: 'warning',
  },
  {
    id: 'card-limit',
    name: 'Card Copy Limit',
    description: 'Maximum 4 copies of any single card',
    category: 'content',
    severity: 'error',
  },
  {
    id: 'legendary-limit',
    name: 'Legendary Card Limit',
    description: 'Maximum 1 copy of legendary cards',
    category: 'content',
    severity: 'error',
  },
  {
    id: 'cost-distribution',
    name: 'Cost Curve Distribution',
    description: 'Deck should have a balanced cost curve',
    category: 'balance',
    severity: 'info',
  },
  {
    id: 'faction-consistency',
    name: 'Faction Consistency',
    description: 'Consider focusing on 1-2 main factions for synergy',
    category: 'balance',
    severity: 'info',
  },
  {
    id: 'unit-ratio',
    name: 'Unit to Non-Unit Ratio',
    description: 'Recommended 60-70% units, 30-40% support cards',
    category: 'balance',
    severity: 'info',
  },
  {
    id: 'level-distribution',
    name: 'Level Distribution',
    description: 'Deck should have cards across multiple levels',
    category: 'balance',
    severity: 'warning',
  },
];
