/**
 * Faction validation
 */

import type { CreateCardData } from '../../../../types/card';
import type { ValidationResult } from '../types';

/**
 * Validate faction attribute
 * Faction values are game-specific free-text; only check non-empty string.
 */
export function validateFaction(data: CreateCardData): ValidationResult {
  const errors: string[] = [];

  if (data.faction !== undefined && data.faction !== null) {
    if (typeof data.faction !== 'string' || data.faction.trim().length === 0) {
      errors.push('Faction must be a non-empty string when provided');
    }
  }

  return { errors, warnings: [] };
}
