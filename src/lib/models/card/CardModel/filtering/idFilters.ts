/**
 * ID-based filter matching
 */

import type { CardWithRelations, CardSearchFilters } from '../../../../types/card';

/**
 * Check if card matches exact field filters
 */
export function matchesExactFilters(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (!matchesCoreIdFilters(card, filters)) return false;
  if (!matchesAttributeFilters(card, filters)) return false;
  if (!matchesIdentifierFilters(card, filters)) return false;
  return true;
}

/**
 * Check if card matches core ID filters (type, rarity, set)
 */
export function matchesCoreIdFilters(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (filters.typeId && card.typeId !== filters.typeId) return false;
  if (filters.rarityId && card.rarityId !== filters.rarityId)
    return false;
  if (filters.setId && card.setId !== filters.setId) return false;
  return true;
}

/**
 * Check if card matches attribute filters (faction, series, nation)
 */
export function matchesAttributeFilters(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (filters.faction && card.faction !== filters.faction) return false;
  if (filters.series && card.series !== filters.series) return false;
  if (filters.nation && card.nation !== filters.nation) return false;
  return true;
}

/**
 * Check if card matches identifier filters (pilot, model, language)
 */
export function matchesIdentifierFilters(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (filters.pilot && card.pilot !== filters.pilot) return false;
  if (filters.model && card.model !== filters.model) return false;
  if (filters.language && card.language !== filters.language)
    return false;
  return true;
}
