/**
 * Validation Scoring
 */

import type { ValidationResult } from './types';

/**
 * Calculate overall validation score
 */
export function calculateValidationScore(results: ValidationResult[]): number {
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
