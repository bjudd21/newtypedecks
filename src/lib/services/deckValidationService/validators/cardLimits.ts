/**
 * Card Limit Validators
 */

import type { DeckCard, ValidationRule, ValidationResult } from '../types';

/**
 * Card copy limit validation
 */
export function validateCardLimit(
  rule: ValidationRule,
  cards: DeckCard[]
): ValidationResult {
  const violations: string[] = [];

  for (const deckCard of cards) {
    if (deckCard.quantity > 4) {
      violations.push(`${deckCard.card.name} (${deckCard.quantity} copies)`);
    }
  }

  const isValid = violations.length === 0;

  return {
    rule,
    isValid,
    message: isValid
      ? 'All cards within copy limits'
      : `${violations.length} card(s) exceed copy limit`,
    details: isValid
      ? undefined
      : `Cards with too many copies: ${violations.join(', ')}`,
    affectedCards: isValid
      ? undefined
      : cards.filter((c) => c.quantity > 4).map((c) => c.card.id),
  };
}

/**
 * Legendary card limit validation
 */
export function validateLegendaryLimit(
  rule: ValidationRule,
  cards: DeckCard[]
): ValidationResult {
  const violations: string[] = [];

  for (const deckCard of cards) {
    // Check if card is legendary (assuming rarity name contains 'legendary')
    const isLegendary = deckCard.card.rarity?.name
      ?.toLowerCase()
      .includes('legendary');
    if (isLegendary && deckCard.quantity > 1) {
      violations.push(`${deckCard.card.name} (${deckCard.quantity} copies)`);
    }
  }

  const isValid = violations.length === 0;

  return {
    rule,
    isValid,
    message: isValid
      ? 'All legendary cards within limits'
      : `${violations.length} legendary card(s) exceed limit`,
    details: isValid
      ? undefined
      : `Legendary cards with multiple copies: ${violations.join(', ')}`,
    affectedCards: isValid
      ? undefined
      : cards
          .filter(
            (c) =>
              c.card.rarity?.name?.toLowerCase().includes('legendary') &&
              c.quantity > 1
          )
          .map((c) => c.card.id),
  };
}
