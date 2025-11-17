/**
 * Abilities JSON validation
 */

import type { CreateCardData } from '../../../../types/card';
import type { ValidationResult } from '../types';

/**
 * Validate abilities JSON structure
 */
export function validateAbilitiesJson(data: CreateCardData): ValidationResult {
  const errors: string[] = [];

  if (!data.abilities) {
    return { errors, warnings: [] };
  }

  try {
    const abilities = JSON.parse(data.abilities);
    if (!Array.isArray(abilities)) {
      errors.push('Abilities must be a valid JSON array');
      return { errors, warnings: [] };
    }

    // Validate each ability
    const hasInvalidAbility = abilities.some(
      (ability) => !ability.name || !ability.description || !ability.type
    );
    if (hasInvalidAbility) {
      errors.push('Each ability must have name, description, and type fields');
    }
  } catch {
    errors.push('Abilities must be valid JSON');
  }

  return { errors, warnings: [] };
}
