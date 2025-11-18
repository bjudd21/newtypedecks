/**
 * Text-based filter matching
 */

import type {
  CardWithRelations,
  CardSearchFilters,
} from '../../../../types/card';

/**
 * Check if card matches text search filter
 */
export function matchesTextFilter(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (
    filters.name &&
    !card.name.toLowerCase().includes(filters.name.toLowerCase())
  ) {
    return false;
  }
  return true;
}

/**
 * Check if card matches boolean flag filters
 */
export function matchesBooleanFilters(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (filters.isFoil !== undefined && card.isFoil !== filters.isFoil)
    return false;
  if (filters.isPromo !== undefined && card.isPromo !== filters.isPromo)
    return false;
  if (
    filters.isAlternate !== undefined &&
    card.isAlternate !== filters.isAlternate
  )
    return false;
  return true;
}
