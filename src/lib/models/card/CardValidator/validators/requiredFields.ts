/**
 * Required fields validation
 */

import { CARD_VALIDATION_SCHEMAS, type CreateCardData } from '../../../../types/card';
import type { ValidationResult } from '../types';

/**
 * Validate required fields
 */
export function validateRequiredFields(data: CreateCardData): ValidationResult {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Card name is required');
  } else if (data.name.length > CARD_VALIDATION_SCHEMAS.name.maxLength) {
    errors.push(
      `Card name must be ${CARD_VALIDATION_SCHEMAS.name.maxLength} characters or less`
    );
  } else if (!CARD_VALIDATION_SCHEMAS.name.pattern.test(data.name)) {
    errors.push('Card name contains invalid characters');
  }

  if (!data.typeId) errors.push('Card type is required');
  if (!data.rarityId) errors.push('Card rarity is required');
  if (!data.setId) errors.push('Card set is required');
  if (!data.setNumber?.trim()) errors.push('Set number is required');
  if (!data.imageUrl?.trim()) errors.push('Image URL is required');

  return { errors, warnings: [] };
}
