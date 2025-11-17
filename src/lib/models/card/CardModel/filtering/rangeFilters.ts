/**
 * Numeric range filter matching
 */

import type { CardWithRelations, CardSearchFilters } from '../../../../types/card';

/**
 * Check if card matches level range filter
 */
export function matchesLevelRangeFilter(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (
    filters.levelMin !== undefined &&
    (card.level || 0) < filters.levelMin
  )
    return false;
  if (
    filters.levelMax !== undefined &&
    (card.level || 0) > filters.levelMax
  )
    return false;
  return true;
}

/**
 * Check if card matches cost range filter
 */
export function matchesCostRangeFilter(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (
    filters.costMin !== undefined &&
    (card.cost || 0) < filters.costMin
  )
    return false;
  if (
    filters.costMax !== undefined &&
    (card.cost || 0) > filters.costMax
  )
    return false;
  return true;
}

/**
 * Check if card matches clash points range filter
 */
export function matchesClashPointsRangeFilter(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (
    filters.clashPointsMin !== undefined &&
    (card.clashPoints || 0) < filters.clashPointsMin
  )
    return false;
  if (
    filters.clashPointsMax !== undefined &&
    (card.clashPoints || 0) > filters.clashPointsMax
  )
    return false;
  return true;
}

/**
 * Check if card matches price range filter
 */
export function matchesPriceRangeFilter(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (
    filters.priceMin !== undefined &&
    (card.price || 0) < filters.priceMin
  )
    return false;
  if (
    filters.priceMax !== undefined &&
    (card.price || 0) > filters.priceMax
  )
    return false;
  return true;
}

/**
 * Check if card matches hit points range filter
 */
export function matchesHitPointsRangeFilter(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (
    filters.hitPointsMin !== undefined &&
    (card.hitPoints || 0) < filters.hitPointsMin
  )
    return false;
  if (
    filters.hitPointsMax !== undefined &&
    (card.hitPoints || 0) > filters.hitPointsMax
  )
    return false;
  return true;
}

/**
 * Check if card matches attack points range filter
 */
export function matchesAttackPointsRangeFilter(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (
    filters.attackPointsMin !== undefined &&
    (card.attackPoints || 0) < filters.attackPointsMin
  )
    return false;
  if (
    filters.attackPointsMax !== undefined &&
    (card.attackPoints || 0) > filters.attackPointsMax
  )
    return false;
  return true;
}
