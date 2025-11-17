/**
 * CardValidator exports
 * Main CardValidator class using modularized validators
 */

import type {
  CreateCardData,
  UpdateCardData,
  CardValidationResult,
} from '../../../types/card';

// Import all validators
import { validateRequiredFields } from './validators/requiredFields';
import { validateSetNumber } from './validators/setNumber';
import { validateNumericFields } from './validators/numericFields';
import { validateTextFieldLengths } from './validators/textFields';
import { validateArrayFields } from './validators/arrayFields';
import { validateFaction } from './validators/faction';
import { validateSeries } from './validators/series';
import { validateLanguage } from './validators/language';
import { validateAbilitiesJson } from './validators/abilities';

export class CardValidator {
  /**
   * Validate card creation data
   */
  static validateCreateData(data: CreateCardData): CardValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Aggregate all validation results
    const validations = [
      validateRequiredFields(data),
      validateSetNumber(data),
      validateNumericFields(data),
      validateTextFieldLengths(data),
      validateArrayFields(data),
      validateFaction(data),
      validateSeries(data),
      validateLanguage(data),
      validateAbilitiesJson(data),
    ];

    for (const validation of validations) {
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate card update data
   */
  static validateUpdateData(data: UpdateCardData): CardValidationResult {
    const errors: string[] = [];
    const _warnings: string[] = []; // Reserved for future validation warnings

    if (!data.id) {
      errors.push('Card ID is required for updates');
    }

    // Only validate fields that are being updated
    const createData = { ...data } as CreateCardData;

    // Skip validation for undefined fields
    Object.keys(createData).forEach((key) => {
      if (createData[key as keyof CreateCardData] === undefined) {
        delete createData[key as keyof CreateCardData];
      }
    });

    // If no fields to update, it's still valid
    if (Object.keys(createData).length === 0) {
      return { isValid: true, errors: [], warnings: [] };
    }

    const createValidation = CardValidator.validateCreateData(createData);

    return {
      isValid: createValidation.isValid,
      errors: createValidation.errors,
      warnings: createValidation.warnings,
    };
  }
}
