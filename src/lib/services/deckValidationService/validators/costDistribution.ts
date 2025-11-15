/**
 * Cost Distribution Validator
 */

import type { DeckCard, ValidationRule, ValidationResult } from '../types';

/**
 * Cost curve distribution validation
 */
export function validateCostDistribution(
  rule: ValidationRule,
  cards: DeckCard[]
): ValidationResult {
  const costCounts: Record<number, number> = {};
  let totalCards = 0;

  for (const deckCard of cards) {
    const cost = deckCard.card.cost || 0;
    costCounts[cost] = (costCounts[cost] || 0) + deckCard.quantity;
    totalCards += deckCard.quantity;
  }

  // Analyze cost curve
  const lowCost =
    (costCounts[0] || 0) + (costCounts[1] || 0) + (costCounts[2] || 0);
  const midCost =
    (costCounts[3] || 0) + (costCounts[4] || 0) + (costCounts[5] || 0);
  const highCost = Object.entries(costCounts)
    .filter(([cost]) => parseInt(cost) >= 6)
    .reduce((sum, [, count]) => sum + count, 0);

  const lowPercent = (lowCost / totalCards) * 100;
  const midPercent = (midCost / totalCards) * 100;
  const highPercent = (highCost / totalCards) * 100;

  // Good distribution: 30-50% low, 30-50% mid, 10-30% high
  const isBalanced =
    lowPercent >= 30 &&
    lowPercent <= 50 &&
    midPercent >= 20 &&
    midPercent <= 50 &&
    highPercent >= 5 &&
    highPercent <= 30;

  return {
    rule,
    isValid: isBalanced,
    message: isBalanced
      ? `Balanced cost curve (Low: ${lowPercent.toFixed(1)}%, Mid: ${midPercent.toFixed(1)}%, High: ${highPercent.toFixed(1)}%)`
      : `Cost curve needs balancing (Low: ${lowPercent.toFixed(1)}%, Mid: ${midPercent.toFixed(1)}%, High: ${highPercent.toFixed(1)}%)`,
    details: isBalanced
      ? undefined
      : 'Recommended: 30-50% low cost (0-2), 20-50% mid cost (3-5), 5-30% high cost (6+)',
  };
}
