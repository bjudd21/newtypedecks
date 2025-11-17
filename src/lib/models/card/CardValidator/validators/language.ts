/**
 * Language validation
 */

import { CARD_CONSTANTS, type CreateCardData, type CardLanguage } from '../../../../types/card';
import type { ValidationResult } from '../types';

/**
 * Validate language attribute
 */
export function validateLanguage(data: CreateCardData): ValidationResult {
  const errors: string[] = [];

  if (
    data.language &&
    !CARD_CONSTANTS.SUPPORTED_LANGUAGES.includes(
      data.language as CardLanguage
    )
  ) {
    errors.push(`Language "${data.language}" is not supported`);
  }

  return { errors, warnings: [] };
}
