/**
 * Zone Validation
 *
 * Validates that each deck zone satisfies its per-zone size constraints.
 * Auto-managed zones (e.g. DON!! deck) are skipped — they don't require card selection.
 * Zones without minSize/maxSize constraints are always valid.
 */

import type { DeckCard, ValidationRule, ValidationResult } from '../types';
import type { DeckRules } from '@/lib/types/game';

export function validateZoneCounts(
  rule: ValidationRule,
  cards: DeckCard[],
  deckRules?: DeckRules
): ValidationResult {
  const zones = deckRules?.zones;

  if (!zones || zones.length === 0) {
    return { rule, isValid: true, message: 'No zone constraints defined' };
  }

  // Check if any zone actually has size constraints to validate
  const constrainedZones = zones.filter(
    (z) =>
      !z.autoManaged && (z.minSize !== undefined || z.maxSize !== undefined)
  );

  if (constrainedZones.length === 0) {
    return {
      rule,
      isValid: true,
      message: 'No per-zone size constraints defined',
    };
  }

  const violations: string[] = [];

  for (const zone of constrainedZones) {
    const count = cards
      .filter((c) => (c.category ?? 'main') === zone.key)
      .reduce((sum, c) => sum + c.quantity, 0);

    if (zone.minSize !== undefined && count < zone.minSize) {
      violations.push(
        `${zone.label}: ${count} card${count !== 1 ? 's' : ''} (need at least ${zone.minSize})`
      );
    } else if (zone.maxSize !== undefined && count > zone.maxSize) {
      violations.push(
        `${zone.label}: ${count} card${count !== 1 ? 's' : ''} (maximum is ${zone.maxSize})`
      );
    }
  }

  const isValid = violations.length === 0;

  return {
    rule,
    isValid,
    message: isValid
      ? 'All zone constraints satisfied'
      : `Zone violation${violations.length > 1 ? 's' : ''}: ${violations.join('; ')}`,
    details: isValid ? undefined : violations.join('\n'),
  };
}
