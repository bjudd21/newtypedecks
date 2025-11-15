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
   * Validate a complete deck
   */
  validateDeck(cards: DeckCard[]): DeckValidationSummary {
    const results: ValidationResult[] = [];

    // Run all validation rules
    for (const rule of VALIDATION_RULES) {
      const result = this.validateRule(rule, cards);
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
    cards: DeckCard[]
  ): ValidationResult {
    switch (rule.id) {
      case 'deck-size-min':
        return validateMinDeckSize(rule, cards);
      case 'deck-size-max':
        return validateMaxDeckSize(rule, cards);
      case 'card-limit':
        return validateCardLimit(rule, cards);
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
