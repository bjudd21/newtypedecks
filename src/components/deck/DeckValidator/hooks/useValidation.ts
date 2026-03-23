'use client';
/**
 * Hook for deck validation logic
 */

import { useMemo } from 'react';
import {
  deckValidator,
  type DeckValidationSummary,
} from '@/lib/services/deckValidationService';
import { useGame } from '@/contexts/GameContext';
import type { DeckCard } from '../types';

interface UseValidationOptions {
  cards: DeckCard[];
  onlyErrors: boolean;
  ruleset?: 'COMPETITIVE' | 'CASUAL';
}

export function useValidation({
  cards,
  onlyErrors,
  ruleset = 'COMPETITIVE',
}: UseValidationOptions) {
  const game = useGame();

  // Calculate validation results using game-specific deck rules
  const rawSummary: DeckValidationSummary = useMemo(() => {
    return deckValidator.validateDeck(cards, game.config.deckRules);
  }, [cards, game.config.deckRules]);

  // In casual mode, downgrade all errors to warnings so nothing blocks saving
  const validationSummary: DeckValidationSummary = useMemo(() => {
    if (ruleset !== 'CASUAL' || rawSummary.errors.length === 0) {
      return rawSummary;
    }
    const demotedErrors = rawSummary.errors.map((r) => ({
      ...r,
      rule: { ...r.rule, severity: 'warning' as const },
    }));
    return {
      ...rawSummary,
      isValid: true,
      errors: [],
      warnings: [...demotedErrors, ...rawSummary.warnings],
    };
  }, [rawSummary, ruleset]);

  const suggestions = useMemo(() => {
    return deckValidator.getSuggestions(validationSummary);
  }, [validationSummary]);

  // Filter results based on props
  const displayResults = useMemo(() => {
    if (onlyErrors) {
      return validationSummary.errors;
    }
    return [
      ...validationSummary.errors,
      ...validationSummary.warnings,
      ...validationSummary.info,
    ];
  }, [validationSummary, onlyErrors]);

  return {
    validationSummary,
    suggestions,
    displayResults,
  };
}
