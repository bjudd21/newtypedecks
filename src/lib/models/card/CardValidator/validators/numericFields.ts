/**
 * Numeric fields validation
 */

import { CARD_CONSTANTS, type CreateCardData } from '../../../../types/card';
import type { ValidationResult } from '../types';

/**
 * Validate a single numeric field is within valid range
 */
function validateNumericField(
  value: number | undefined,
  fieldName: string,
  maxValue: number
): string | null {
  if (value !== undefined && (value < 0 || value > maxValue)) {
    return `${fieldName} must be between 0 and ${maxValue}`;
  }
  return null;
}

/**
 * Validate numeric fields
 */
export function validateNumericFields(data: CreateCardData): ValidationResult {
  const errors: string[] = [];

  const fieldValidations = [
    validateNumericField(data.level, 'Level', CARD_CONSTANTS.MAX_LEVEL),
    validateNumericField(data.cost, 'Cost', CARD_CONSTANTS.MAX_COST),
    validateNumericField(
      data.clashPoints,
      'Clash Points',
      CARD_CONSTANTS.MAX_CLASH_POINTS
    ),
    validateNumericField(data.price, 'Price', CARD_CONSTANTS.MAX_PRICE),
    validateNumericField(
      data.hitPoints,
      'Hit Points',
      CARD_CONSTANTS.MAX_HIT_POINTS
    ),
    validateNumericField(
      data.attackPoints,
      'Attack Points',
      CARD_CONSTANTS.MAX_ATTACK_POINTS
    ),
  ];

  for (const error of fieldValidations) {
    if (error) errors.push(error);
  }

  return { errors, warnings: [] };
}
