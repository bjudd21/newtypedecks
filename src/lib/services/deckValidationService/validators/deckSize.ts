/**
 * Deck Size Validators
 */

import type { DeckCard, ValidationRule, ValidationResult } from '../types';
import type { DeckRules } from '@/lib/types/game';

// Fallback defaults for when no game config is provided
const DEFAULT_MIN_DECK_SIZE = 50;
const DEFAULT_MAX_DECK_SIZE = 60;

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
  cards: DeckCard[],
  deckRules?: DeckRules
): ValidationResult {
  const min = deckRules?.minDeckSize ?? DEFAULT_MIN_DECK_SIZE;
  const totalCards = getTotalCards(cards);
  const isValid = totalCards >= min;

  return {
    rule,
    isValid,
    message: isValid
      ? `Deck size: ${totalCards} cards (valid)`
      : `Deck size: ${totalCards} cards (minimum ${min} required)`,
    details: isValid
      ? undefined
      : `Add ${min - totalCards} more cards to reach minimum deck size`,
  };
}

/**
 * Maximum deck size validation (warning)
 */
export function validateMaxDeckSize(
  rule: ValidationRule,
  cards: DeckCard[],
  deckRules?: DeckRules
): ValidationResult {
  const max = deckRules?.maxDeckSize ?? DEFAULT_MAX_DECK_SIZE;
  const totalCards = getTotalCards(cards);
  const isValid = totalCards <= max;

  return {
    rule,
    isValid,
    message: isValid
      ? `Deck size: ${totalCards} cards (recommended)`
      : `Deck size: ${totalCards} cards (consider reducing to ${max} or fewer)`,
    details: isValid
      ? undefined
      : `Large decks can reduce consistency. Consider removing ${totalCards - max} cards.`,
  };
}
