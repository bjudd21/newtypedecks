/**
 * Text fields validation
 */

import {
  CARD_VALIDATION_SCHEMAS,
  type CreateCardData,
} from '../../../../types/card';
import type { ValidationResult } from '../types';

/**
 * Validate text field lengths
 */
export function validateTextFieldLengths(
  data: CreateCardData
): ValidationResult {
  const errors: string[] = [];

  if (
    data.description &&
    data.description.length > CARD_VALIDATION_SCHEMAS.description.maxLength
  ) {
    errors.push(
      `Description must be ${CARD_VALIDATION_SCHEMAS.description.maxLength} characters or less`
    );
  }

  if (
    data.officialText &&
    data.officialText.length > CARD_VALIDATION_SCHEMAS.officialText.maxLength
  ) {
    errors.push(
      `Official text must be ${CARD_VALIDATION_SCHEMAS.officialText.maxLength} characters or less`
    );
  }

  if (
    data.abilities &&
    data.abilities.length > CARD_VALIDATION_SCHEMAS.abilities.maxLength
  ) {
    errors.push(
      `Abilities must be ${CARD_VALIDATION_SCHEMAS.abilities.maxLength} characters or less`
    );
  }

  return { errors, warnings: [] };
}
