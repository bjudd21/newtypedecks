/**
 * Array fields validation
 */

import type { CreateCardData } from '../../../../types/card';
import { CARD_VALIDATION_SCHEMAS } from '../../../../types/card';
import type { ValidationResult } from '../types';

/**
 * Validate array fields (keywords and tags)
 */
export function validateArrayFields(data: CreateCardData): ValidationResult {
  const errors: string[] = [];

  if (
    data.keywords &&
    data.keywords.length > CARD_VALIDATION_SCHEMAS.keywords.maxItems
  ) {
    errors.push(
      `Maximum ${CARD_VALIDATION_SCHEMAS.keywords.maxItems} keywords allowed`
    );
  }

  if (data.keywords) {
    for (const keyword of data.keywords) {
      if (keyword.length > CARD_VALIDATION_SCHEMAS.keywords.maxLength) {
        errors.push(
          `Each keyword must be ${CARD_VALIDATION_SCHEMAS.keywords.maxLength} characters or less`
        );
        break;
      }
    }
  }

  if (data.tags && data.tags.length > CARD_VALIDATION_SCHEMAS.tags.maxItems) {
    errors.push(
      `Maximum ${CARD_VALIDATION_SCHEMAS.tags.maxItems} tags allowed`
    );
  }

  if (data.tags) {
    for (const tag of data.tags) {
      if (tag.length > CARD_VALIDATION_SCHEMAS.tags.maxLength) {
        errors.push(
          `Each tag must be ${CARD_VALIDATION_SCHEMAS.tags.maxLength} characters or less`
        );
        break;
      }
    }
  }

  return { errors, warnings: [] };
}
