/**
 * Series validation
 */

import { CARD_CONSTANTS, type CreateCardData } from '../../../../types/card';
import type { ValidationResult, CardSeries } from '../types';

/**
 * Validate series attribute
 */
export function validateSeries(data: CreateCardData): ValidationResult {
  const warnings: string[] = [];

  if (
    data.series &&
    !CARD_CONSTANTS.SUPPORTED_SERIES.includes(data.series as CardSeries)
  ) {
    warnings.push(`Series "${data.series}" is not in the standard series list`);
  }

  return { errors: [], warnings };
}
