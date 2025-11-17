/**
 * Card tag generation utilities
 */

import type { CardWithRelations } from '../../../types/card';

/**
 * Generate card tags based on attributes
 */
export function generateCardTags(card: CardWithRelations): string[] {
  const tags: string[] = [];

  // Add type-based tags
  if (card.type?.name) tags.push(card.type.name);
  if (card.type?.category) tags.push(card.type.category);

  // Add rarity tag
  if (card.rarity?.name) tags.push(card.rarity.name);

  // Add faction tag
  if (card.faction) tags.push(card.faction);

  // Add series tag
  if (card.series) tags.push(card.series);

  // Add nation tag
  if (card.nation) tags.push(card.nation);

  // Add special tags based on attributes
  if (card.isFoil) tags.push('Foil');
  if (card.isPromo) tags.push('Promo');
  if (card.isAlternate) tags.push('Alternate Art');

  // Add power level tags
  const powerLevel =
    (card.clashPoints || 0) +
    (card.attackPoints || 0) +
    (card.hitPoints || 0);
  if (powerLevel >= 1000) tags.push('High Power');
  else if (powerLevel >= 500) tags.push('Medium Power');
  else tags.push('Low Power');

  return Array.from(new Set(tags)); // Remove duplicates
}
