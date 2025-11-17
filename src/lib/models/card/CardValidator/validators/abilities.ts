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
