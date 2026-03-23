/**
 * Level Distribution Validator
 */

import type { DeckCard, ValidationRule, ValidationResult } from '../types';

/**
 * Level distribution validation
 */
export function validateLevelDistribution(
  rule: ValidationRule,
  cards: DeckCard[]
): ValidationResult {
  // Skip when this game doesn't use levels (e.g. One Piece TCG)
  const hasLevelData = cards.some((dc) => dc.card.level != null);
  if (!hasLevelData) {
    return {
      rule,
      isValid: true,
      message: 'Level distribution not applicable for this game',
    };
  }

  const levelCounts: Record<number, number> = {};
  let totalCards = 0;

  for (const deckCard of cards) {
    const level = deckCard.card.level || 0;
    levelCounts[level] = (levelCounts[level] || 0) + deckCard.quantity;
    totalCards += deckCard.quantity;
  }

  const levels = Object.keys(levelCounts).map(Number).sort();
  const hasMultipleLevels = levels.length >= 3;
  const hasLowLevelCards = levelCounts[0] || levelCounts[1] || 0;
  const isBalanced = hasMultipleLevels && hasLowLevelCards >= totalCards * 0.3;

  const distribution = levels
    .map(
      (level) =>
        `Level ${level}: ${((levelCounts[level] / totalCards) * 100).toFixed(1)}%`
    )
    .join(', ');

  return {
    rule,
    isValid: isBalanced,
    message: isBalanced
      ? `Good level distribution (${distribution})`
      : `Level distribution needs balancing (${distribution})`,
    details: isBalanced
      ? undefined
      : 'Include cards from multiple levels, with enough low-level cards for early game',
  };
}
