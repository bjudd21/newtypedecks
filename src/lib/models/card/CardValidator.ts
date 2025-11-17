/**
 * Card Validation Utilities
 * Validates card creation and update data
 */

import type {
  CreateCardData,
  UpdateCardData,
  CardValidationResult,
  CardLanguage,
} from '../../types/card';
import { CARD_CONSTANTS, CARD_VALIDATION_SCHEMAS } from '../../types/card';

type CardFaction = (typeof CARD_CONSTANTS.SUPPORTED_FACTIONS)[number];
type CardSeries = (typeof CARD_CONSTANTS.SUPPORTED_SERIES)[number];

export class CardValidator {
  /**
   * Validate required fields
   */
  private static validateRequiredFields(data: CreateCardData): {
    errors: string[];
    warnings: string[];
  } {
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

  /**
   * Validate set number format
   */
  private static validateSetNumber(data: CreateCardData): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];

    if (
      data.setNumber &&
      !CARD_VALIDATION_SCHEMAS.setNumber.pattern.test(data.setNumber)
    ) {
      errors.push('Set number must be in format "ABC-123"');
    }

    return { errors, warnings: [] };
  }

  /**
   * Validate a single numeric field is within valid range
   */
  private static validateNumericField(
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
  private static validateNumericFields(data: CreateCardData): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];

    const fieldValidations = [
      this.validateNumericField(data.level, 'Level', CARD_CONSTANTS.MAX_LEVEL),
      this.validateNumericField(data.cost, 'Cost', CARD_CONSTANTS.MAX_COST),
      this.validateNumericField(
        data.clashPoints,
        'Clash Points',
        CARD_CONSTANTS.MAX_CLASH_POINTS
      ),
      this.validateNumericField(data.price, 'Price', CARD_CONSTANTS.MAX_PRICE),
      this.validateNumericField(
        data.hitPoints,
        'Hit Points',
        CARD_CONSTANTS.MAX_HIT_POINTS
      ),
      this.validateNumericField(
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

  /**
   * Validate text field lengths
   */
  private static validateTextFieldLengths(data: CreateCardData): {
    errors: string[];
    warnings: string[];
  } {
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

  /**
   * Validate array fields (keywords and tags)
   */
  private static validateArrayFields(data: CreateCardData): {
    errors: string[];
    warnings: string[];
  } {
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

  /**
   * Validate faction attribute
   */
  private static validateFaction(data: CreateCardData): {
    errors: string[];
    warnings: string[];
  } {
    const warnings: string[] = [];

    if (
      data.faction &&
      !CARD_CONSTANTS.SUPPORTED_FACTIONS.includes(data.faction as CardFaction)
    ) {
      warnings.push(
        `Faction "${data.faction}" is not in the standard faction list`
      );
    }

    return { errors: [], warnings };
  }

  /**
   * Validate series attribute
   */
  private static validateSeries(data: CreateCardData): {
    errors: string[];
    warnings: string[];
  } {
    const warnings: string[] = [];

    if (
      data.series &&
      !CARD_CONSTANTS.SUPPORTED_SERIES.includes(data.series as CardSeries)
    ) {
      warnings.push(
        `Series "${data.series}" is not in the standard series list`
      );
    }

    return { errors: [], warnings };
  }

  /**
   * Validate language attribute
   */
  private static validateLanguage(data: CreateCardData): {
    errors: string[];
    warnings: string[];
  } {
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

  /**
   * Validate abilities JSON structure
   */
  private static validateAbilitiesJson(data: CreateCardData): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];

    if (data.abilities) {
      try {
        const abilities = JSON.parse(data.abilities);
        if (!Array.isArray(abilities)) {
          errors.push('Abilities must be a valid JSON array');
        } else {
          for (const ability of abilities) {
            if (!ability.name || !ability.description || !ability.type) {
              errors.push(
                'Each ability must have name, description, and type fields'
              );
              break;
            }
          }
        }
      } catch {
        errors.push('Abilities must be valid JSON');
      }
    }

    return { errors, warnings: [] };
  }

  /**
   * Validate card creation data
   */
  static validateCreateData(data: CreateCardData): CardValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Aggregate all validation results
    const validations = [
      this.validateRequiredFields(data),
      this.validateSetNumber(data),
      this.validateNumericFields(data),
      this.validateTextFieldLengths(data),
      this.validateArrayFields(data),
      this.validateFaction(data),
      this.validateSeries(data),
      this.validateLanguage(data),
      this.validateAbilitiesJson(data),
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
