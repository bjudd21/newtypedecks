/**
 * Validation Suggestions Generator
 */

import type { DeckValidationSummary } from './types';

/**
 * Get suggestions for improving deck
 */
export function generateSuggestions(
  validationSummary: DeckValidationSummary
): string[] {
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
