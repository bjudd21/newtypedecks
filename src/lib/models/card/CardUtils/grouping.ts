/**
 * Card grouping utilities
 */

import type { CardWithRelations } from '../../../types/card';

/**
 * Group cards by a specified field
 */
export function groupCardsByField(
  cards: CardWithRelations[],
  field: keyof CardWithRelations
): Record<string, CardWithRelations[]> {
  const groups: Record<string, CardWithRelations[]> = {};

  for (const card of cards) {
    const value = String(card[field] || 'Unknown');
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(card);
  }

  return groups;
}
