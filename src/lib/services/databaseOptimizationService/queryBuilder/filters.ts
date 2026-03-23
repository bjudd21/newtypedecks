/**
 * Query Filter Builders
 *
 * Game-specific fields (faction, series, nation, pilot, model, language) are
 * stored in the `gameAttributes` JSONB column — NOT as flat columns — for all
 * games. Flat columns with the same names are deprecated and must not be used
 * for new queries. See CLAUDE.md "Known Migration Gaps" for background.
 */

import type { CardSearchFilters } from '@/lib/types/card';

type RangeFilter = { gte?: number; lte?: number };

/**
 * Build a Prisma `gameAttributes` JSON-path filter for partial string matching.
 * Prisma requires the `path` + `string_contains` form for JSONB text search.
 */
function buildJsonbStringContains(
  field: string,
  value: string
): Record<string, unknown> {
  return {
    gameAttributes: {
      path: [field],
      string_contains: value,
    },
  };
}

/**
 * Build a Prisma `gameAttributes` JSON-path filter for exact matching.
 */
function buildJsonbEquals(
  field: string,
  value: string
): Record<string, unknown> {
  return {
    gameAttributes: {
      path: [field],
      equals: value,
    },
  };
}

export function buildWhereClause(
  filters: CardSearchFilters
): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  // Game scope — always set when provided
  if (filters.gameId) where.gameId = filters.gameId;

  // Text search filters (case-insensitive on flat columns)
  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' };
  }

  // Game-specific text fields live in gameAttributes JSONB.
  // Prisma's JSON path string_contains is case-sensitive; wrapping in AND
  // with a mode-insensitive workaround is not available for JSONB — callers
  // should lowercase the value if case-insensitive matching is needed.
  if (filters.pilot) {
    Object.assign(where, buildJsonbStringContains('pilot', filters.pilot));
  }
  if (filters.model) {
    Object.assign(where, buildJsonbStringContains('model', filters.model));
  }

  // Categorical filters (use indexes)
  if (filters.typeId) where.typeId = filters.typeId;
  if (filters.rarityId) where.rarityId = filters.rarityId;
  if (filters.setId) where.setId = filters.setId;

  // Game-specific categorical fields — exact match via JSONB path
  if (filters.faction) {
    Object.assign(where, buildJsonbEquals('faction', filters.faction));
  }
  if (filters.series) {
    Object.assign(where, buildJsonbEquals('series', filters.series));
  }
  if (filters.nation) {
    Object.assign(where, buildJsonbEquals('nation', filters.nation));
  }
  if (filters.language) {
    Object.assign(where, buildJsonbEquals('language', filters.language));
  }

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
