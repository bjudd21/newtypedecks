/**
 * Unit Ratio Validator
 */

import type { DeckCard, ValidationRule, ValidationResult } from '../types';

/**
 * Unit to non-unit ratio validation
 */
export function validateUnitRatio(
  rule: ValidationRule,
  cards: DeckCard[]
): ValidationResult {
  let unitCount = 0;
  let totalCount = 0;

  for (const deckCard of cards) {
    totalCount += deckCard.quantity;
    if (deckCard.card.type?.name?.toLowerCase().includes('unit')) {
      unitCount += deckCard.quantity;
    }
  }

  const unitPercent = totalCount > 0 ? (unitCount / totalCount) * 100 : 0;
  const isBalanced = unitPercent >= 60 && unitPercent <= 80;

  return {
    rule,
    isValid: isBalanced,
    message: isBalanced
      ? `Good unit ratio (${unitPercent.toFixed(1)}% units)`
      : `Unit ratio: ${unitPercent.toFixed(1)}% (recommended: 60-80%)`,
    details: isBalanced
      ? undefined
      : 'Units provide board presence, support cards provide utility',
  };
}
