/**
 * Series validation
 */

import type { CreateCardData } from '../../../../types/card';
import type { ValidationResult } from '../types';

/**
 * Validate series attribute
 * Series values are game-specific free-text; only check non-empty string.
 */
export function validateSeries(data: CreateCardData): ValidationResult {
  const errors: string[] = [];

  if (data.series !== undefined && data.series !== null) {
    if (typeof data.series !== 'string' || data.series.trim().length === 0) {
      errors.push('Series must be a non-empty string when provided');
    }
  }

  return { errors, warnings: [] };
}
