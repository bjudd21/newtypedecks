/**
 * Faction validation
 */

import { CARD_CONSTANTS, type CreateCardData } from '../../../../types/card';
import type { ValidationResult, CardFaction } from '../types';

/**
 * Validate faction attribute
 */
export function validateFaction(data: CreateCardData): ValidationResult {
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
