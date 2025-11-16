/**
 * Query Filter Builders
 */

import type { CardSearchFilters } from '@/lib/types/card';

type RangeFilter = { gte?: number; lte?: number };

export function buildWhereClause(
  filters: CardSearchFilters
): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  // Text search filters (case-insensitive)
  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' };
  }
  if (filters.pilot) {
    where.pilot = { contains: filters.pilot, mode: 'insensitive' };
  }
  if (filters.model) {
    where.model = { contains: filters.model, mode: 'insensitive' };
  }

  // Categorical filters (use indexes)
  if (filters.typeId) where.typeId = filters.typeId;
  if (filters.rarityId) where.rarityId = filters.rarityId;
  if (filters.setId) where.setId = filters.setId;
  if (filters.faction) where.faction = filters.faction;
  if (filters.series) where.series = filters.series;
  if (filters.nation) where.nation = filters.nation;
  if (filters.language) where.language = filters.language;

  // Boolean filters
  if (filters.isFoil !== undefined) where.isFoil = filters.isFoil;
  if (filters.isPromo !== undefined) where.isPromo = filters.isPromo;
  if (filters.isAlternate !== undefined)
    where.isAlternate = filters.isAlternate;

  // Range filters (use indexes)
  addRangeFilter(where, 'level', filters.levelMin, filters.levelMax);
  addRangeFilter(where, 'cost', filters.costMin, filters.costMax);
  addRangeFilter(
    where,
    'clashPoints',
    filters.clashPointsMin,
    filters.clashPointsMax
  );
  addRangeFilter(where, 'price', filters.priceMin, filters.priceMax);
  addRangeFilter(
    where,
    'hitPoints',
    filters.hitPointsMin,
    filters.hitPointsMax
  );
  addRangeFilter(
    where,
    'attackPoints',
    filters.attackPointsMin,
    filters.attackPointsMax
  );

  // Array filters
  if (filters.keywords && filters.keywords.length > 0) {
    where.keywords = { hasEvery: filters.keywords };
  }
  if (filters.tags && filters.tags.length > 0) {
    where.tags = { hasEvery: filters.tags };
  }

  return where;
}

function addRangeFilter(
  where: Record<string, unknown>,
  field: string,
  min: number | undefined,
  max: number | undefined
): void {
  if (min !== undefined || max !== undefined) {
    const range: RangeFilter = {};
    if (min !== undefined) range.gte = min;
    if (max !== undefined) range.lte = max;
    where[field] = range;
  }
}
