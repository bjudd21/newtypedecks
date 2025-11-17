/**
 * Set number validation
 */

import type { CreateCardData } from '../../../../types/card';
import { CARD_VALIDATION_SCHEMAS } from '../../../../types/card';
import type { ValidationResult } from '../types';

/**
 * Validate set number format
 */
export function validateSetNumber(data: CreateCardData): ValidationResult {
  const errors: string[] = [];

  if (
    data.setNumber &&
    !CARD_VALIDATION_SCHEMAS.setNumber.pattern.test(data.setNumber)
  ) {
    errors.push('Set number must be in format "ABC-123"');
  }

  return { errors, warnings: [] };
}
