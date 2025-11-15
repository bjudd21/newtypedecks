/**
 * Deck Size Validators
 */

import type { DeckCard, ValidationRule, ValidationResult } from '../types';

/**
 * Calculate total cards in deck
 */
function getTotalCards(cards: DeckCard[]): number {
  return cards.reduce((sum, deckCard) => sum + deckCard.quantity, 0);
}

/**
 * Minimum deck size validation
 */
export function validateMinDeckSize(
  rule: ValidationRule,
  cards: DeckCard[]
): ValidationResult {
  const totalCards = getTotalCards(cards);
  const isValid = totalCards >= 50;

  return {
    rule,
    isValid,
    message: isValid
      ? `Deck size: ${totalCards} cards (valid)`
      : `Deck size: ${totalCards} cards (minimum 50 required)`,
    details: isValid
      ? undefined
      : `Add ${50 - totalCards} more cards to reach minimum deck size`,
  };
}

/**
 * Maximum deck size validation (warning)
 */
export function validateMaxDeckSize(
  rule: ValidationRule,
  cards: DeckCard[]
): ValidationResult {
  const totalCards = getTotalCards(cards);
  const isValid = totalCards <= 60;

  return {
    rule,
    isValid,
    message: isValid
      ? `Deck size: ${totalCards} cards (recommended)`
      : `Deck size: ${totalCards} cards (consider reducing to 60 or fewer)`,
    details: isValid
      ? undefined
      : `Large decks can reduce consistency. Consider removing ${totalCards - 60} cards.`,
  };
}
