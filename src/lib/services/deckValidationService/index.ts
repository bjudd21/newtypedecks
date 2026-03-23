/**
 * Deck Validation Service
 *
 * Validates deck composition against Gundam Card Game rules
 */

import type {
  DeckCard,
  ValidationRule,
  ValidationResult,
  DeckValidationSummary,
} from './types';
import type { DeckRules } from '@/lib/types/game';
import { VALIDATION_RULES } from './rules';
import {
  validateMinDeckSize,
  validateMaxDeckSize,
  validateCardLimit,
  validateLegendaryLimit,
  validateCostDistribution,
  validateFactionConsistency,
  validateUnitRatio,
  validateLevelDistribution,
} from './validators';
import { calculateValidationScore } from './scoring';
import { generateSuggestions } from './suggestions';

export type {
  DeckCard,
  ValidationRule,
  ValidationResult,
  DeckValidationSummary,
};

export class DeckValidationService {
  private static instance: DeckValidationService;

  private constructor() {}

  public static getInstance(): DeckValidationService {
    if (!DeckValidationService.instance) {
      DeckValidationService.instance = new DeckValidationService();
    }
    return DeckValidationService.instance;
  }

  /**
   * Validate a complete deck against the provided rules (or Gundam defaults if omitted).
   */
  validateDeck(
    cards: DeckCard[],
    deckRules?: DeckRules
  ): DeckValidationSummary {
    const results: ValidationResult[] = [];

    // Run all validation rules
    for (const rule of VALIDATION_RULES) {
      const result = this.validateRule(rule, cards, deckRules);
      results.push(result);
    }

    // Categorize results
    const errors = results.filter(
      (r) => !r.isValid && r.rule.severity === 'error'
    );
    const warnings = results.filter(
      (r) => !r.isValid && r.rule.severity === 'warning'
    );
    const info = results.filter(
      (r) => !r.isValid && r.rule.severity === 'info'
    );

    // Calculate validation score
    const score = calculateValidationScore(results);

    return {
      isValid: errors.length === 0,
      totalResults: results.length,
      errors,
      warnings,
      info,
      score,
    };
  }

  /**
   * Validate a single rule
   */
  private validateRule(
    rule: ValidationRule,
    cards: DeckCard[],
    deckRules?: DeckRules
  ): ValidationResult {
    switch (rule.id) {
      case 'deck-size-min':
        return validateMinDeckSize(rule, cards, deckRules);
      case 'deck-size-max':
        return validateMaxDeckSize(rule, cards, deckRules);
      case 'card-limit':
        return validateCardLimit(rule, cards, deckRules);
      case 'legendary-limit':
        return validateLegendaryLimit(rule, cards);
      case 'cost-distribution':
        return validateCostDistribution(rule, cards);
      case 'faction-consistency':
        return validateFactionConsistency(rule, cards);
      case 'unit-ratio':
        return validateUnitRatio(rule, cards);
      case 'level-distribution':
        return validateLevelDistribution(rule, cards);
      default:
        return {
          rule,
          isValid: true,
          message: 'Unknown rule',
        };
    }
  }

  /**
   * Get suggestions for improving deck
   */
  getSuggestions(validationSummary: DeckValidationSummary): string[] {
    return generateSuggestions(validationSummary);
  }
}

// Export singleton instance
export const deckValidator = DeckValidationService.getInstance();
