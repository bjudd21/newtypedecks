/**
 * Deck Validation Service
 *
 * Validates deck composition against Gundam Card Game rules
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

export class DeckValidationService {
  private static instance: DeckValidationService;

  // Standard Gundam Card Game rules
  private static readonly VALIDATION_RULES: ValidationRule[] = [
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
    for (const rule of DeckValidationService.VALIDATION_RULES) {
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
    const score = this.calculateValidationScore(results);

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
        return this.validateMinDeckSize(rule, cards);
      case 'deck-size-max':
        return this.validateMaxDeckSize(rule, cards);
      case 'card-limit':
        return this.validateCardLimit(rule, cards);
      case 'legendary-limit':
        return this.validateLegendaryLimit(rule, cards);
      case 'cost-distribution':
        return this.validateCostDistribution(rule, cards);
      case 'faction-consistency':
        return this.validateFactionConsistency(rule, cards);
      case 'unit-ratio':
        return this.validateUnitRatio(rule, cards);
      case 'level-distribution':
        return this.validateLevelDistribution(rule, cards);
      default:
        return {
          rule,
          isValid: true,
          message: 'Unknown rule',
        };
    }
  }

  /**
   * Minimum deck size validation
   */
  private validateMinDeckSize(
    rule: ValidationRule,
    cards: DeckCard[]
  ): ValidationResult {
    const totalCards = cards.reduce(
      (sum, deckCard) => sum + deckCard.quantity,
      0
    );
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
  private validateMaxDeckSize(
    rule: ValidationRule,
    cards: DeckCard[]
  ): ValidationResult {
    const totalCards = cards.reduce(
      (sum, deckCard) => sum + deckCard.quantity,
      0
    );
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

  /**
   * Card copy limit validation
   */
  private validateCardLimit(
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
  private validateLegendaryLimit(
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

  /**
   * Cost curve distribution validation
   */
  private validateCostDistribution(
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

  /**
   * Faction consistency validation
   */
  private validateFactionConsistency(
    rule: ValidationRule,
    cards: DeckCard[]
  ): ValidationResult {
    const factionCounts: Record<string, number> = {};
    let totalCards = 0;

    for (const deckCard of cards) {
      const faction = deckCard.card.faction || 'Neutral';
      factionCounts[faction] =
        (factionCounts[faction] || 0) + deckCard.quantity;
      totalCards += deckCard.quantity;
    }

    const factions = Object.keys(factionCounts);
    const primaryFactions = factions
      .map((faction) => ({
        faction,
        count: factionCounts[faction],
        percent: (factionCounts[faction] / totalCards) * 100,
      }))
      .filter((f) => f.percent >= 20)
      .sort((a, b) => b.count - a.count);

    const isFocused =
      primaryFactions.length <= 2 || primaryFactions[0].percent >= 60;

    return {
      rule,
      isValid: isFocused,
      message: isFocused
        ? `Good faction focus (${primaryFactions.map((f) => `${f.faction}: ${f.percent.toFixed(1)}%`).join(', ')})`
        : 'Consider focusing on fewer factions for better synergy',
      details: isFocused
        ? undefined
        : `Current factions: ${Object.entries(factionCounts)
            .map(([f, c]) => `${f} (${c})`)
            .join(', ')}`,
    };
  }

  /**
   * Unit to non-unit ratio validation
   */
  private validateUnitRatio(
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

  /**
   * Level distribution validation
   */
  private validateLevelDistribution(
    rule: ValidationRule,
    cards: DeckCard[]
  ): ValidationResult {
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
    const isBalanced =
      hasMultipleLevels && hasLowLevelCards >= totalCards * 0.3;

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

  /**
   * Calculate overall validation score
   */
  private calculateValidationScore(results: ValidationResult[]): number {
    let score = 100;

    for (const result of results) {
      if (!result.isValid) {
        switch (result.rule.severity) {
          case 'error':
            score -= 25; // Major deduction for errors
            break;
          case 'warning':
            score -= 10; // Moderate deduction for warnings
            break;
          case 'info':
            score -= 5; // Minor deduction for info
            break;
        }
      }
    }

    return Math.max(0, score);
  }

  /**
   * Get suggestions for improving deck
   */
  getSuggestions(validationSummary: DeckValidationSummary): string[] {
    const suggestions: string[] = [];

    // Add suggestions based on validation results
    for (const error of validationSummary.errors) {
      if (error.details) {
        suggestions.push(`🚨 ${error.details}`);
      }
    }

    for (const warning of validationSummary.warnings) {
      if (warning.details) {
        suggestions.push(`⚠️ ${warning.details}`);
      }
    }

    // Add general suggestions based on score
    if (validationSummary.score >= 90) {
      suggestions.push(
        '✅ Excellent deck structure! Your deck follows all major rules.'
      );
    } else if (validationSummary.score >= 70) {
      suggestions.push(
        '👍 Good deck structure with room for minor improvements.'
      );
    } else if (validationSummary.score >= 50) {
      suggestions.push(
        '📝 Deck needs some adjustments to improve consistency.'
      );
    } else {
      suggestions.push(
        '🔧 Deck needs significant improvements to meet tournament standards.'
      );
    }

    return suggestions;
  }
}

// Export singleton instance
export const deckValidator = DeckValidationService.getInstance();
