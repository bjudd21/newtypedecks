'use client';
/**
 * Hook for deck validation logic
 */

import { useMemo } from 'react';
import {
  deckValidator,
  type DeckValidationSummary,
  type ValidationResult,
} from '@/lib/services/deckValidationService';
import { useGame } from '@/contexts/GameContext';
import type { DeckCard } from '../types';

interface UseValidationOptions {
  cards: DeckCard[];
  onlyErrors: boolean;
}

export function useValidation({ cards, onlyErrors }: UseValidationOptions) {
  const game = useGame();

  // Calculate validation results using game-specific deck rules
  const validationSummary: DeckValidationSummary = useMemo(() => {
    return deckValidator.validateDeck(cards, game.config.deckRules);
  }, [cards, game.config.deckRules]);

  const suggestions = useMemo(() => {
    return deckValidator.getSuggestions(validationSummary);
  }, [validationSummary]);

  // Filter results based on props
  const displayResults = useMemo(() => {
    let results: ValidationResult[] = [];

    if (onlyErrors) {
      results = validationSummary.errors;
    } else {
      results = [
        ...validationSummary.errors,
        ...validationSummary.warnings,
        ...validationSummary.info,
      ];
    }

    return results;
  }, [validationSummary, onlyErrors]);

  return {
    validationSummary,
    suggestions,
    displayResults,
  };
}
