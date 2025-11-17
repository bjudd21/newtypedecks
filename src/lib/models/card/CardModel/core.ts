/**
 * CardModel core methods
 * Basic getters and computed properties
 */

import type { CardWithRelations, CardAbility } from '../../../types/card';

/**
 * Get formatted card display name with set number
 */
export function getDisplayName(card: CardWithRelations): string {
  return `${card.name} (${card.set.code}-${card.setNumber})`;
}

/**
 * Get card power level for sorting and comparison
 */
export function getPowerLevel(card: CardWithRelations): number {
  return (
    (card.clashPoints || 0) +
    (card.attackPoints || 0) +
    (card.hitPoints || 0)
  );
}

/**
 * Get parsed abilities from JSON string
 */
export function getParsedAbilities(card: CardWithRelations): CardAbility[] {
  if (!card.abilities) return [];

  try {
    return JSON.parse(card.abilities) as CardAbility[];
  } catch {
    return [];
  }
}

/**
 * Get card rarity color for UI display
 */
export function getRarityColor(card: CardWithRelations): string {
  return card.rarity.color;
}
