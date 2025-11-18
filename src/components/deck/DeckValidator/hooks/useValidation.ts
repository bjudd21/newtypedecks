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
import type { DeckCard } from '../types';

interface UseValidationOptions {
  cards: DeckCard[];
  onlyErrors: boolean;
}

export function useValidation({ cards, onlyErrors }: UseValidationOptions) {
  // Calculate validation results
  const validationSummary: DeckValidationSummary = useMemo(() => {
    return deckValidator.validateDeck(cards);
  }, [cards]);

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
