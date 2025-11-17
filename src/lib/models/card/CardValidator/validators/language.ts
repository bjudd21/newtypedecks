/**
 * Language validation
 */

import type { CreateCardData, CardLanguage } from '../../../../types/card';
import { CARD_CONSTANTS } from '../../../../types/card';
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
