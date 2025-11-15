/**
 * Filter Sanitization Functions
 *
 * Utilities for sanitizing and validating card search filters
 */

import type { CardSearchFilters, CardSearchOptions } from '@/lib/types/card';

export function sanitizeTextFilters(
  filters: unknown
): Partial<CardSearchFilters> {
  const f = filters as Record<string, unknown>;
  return {
    name: typeof f.name === 'string' ? f.name.trim() : undefined,
    pilot: typeof f.pilot === 'string' ? f.pilot.trim() : undefined,
    model: typeof f.model === 'string' ? f.model.trim() : undefined,
  };
}

export function sanitizeIdFilters(
  filters: unknown
): Partial<CardSearchFilters> {
  const f = filters as Record<string, unknown>;
  return {
    typeId: typeof f.typeId === 'string' ? f.typeId : undefined,
    rarityId: typeof f.rarityId === 'string' ? f.rarityId : undefined,
    setId: typeof f.setId === 'string' ? f.setId : undefined,
  };
}

export function sanitizeCategoricalFilters(
  filters: unknown
): Partial<CardSearchFilters> {
  const f = filters as Record<string, unknown>;
  return {
    faction: typeof f.faction === 'string' ? f.faction : undefined,
    series: typeof f.series === 'string' ? f.series : undefined,
    nation: typeof f.nation === 'string' ? f.nation : undefined,
    language: typeof f.language === 'string' ? f.language : undefined,
  };
}

export function sanitizeBooleanFilters(
  filters: unknown
): Partial<CardSearchFilters> {
  const f = filters as Record<string, unknown>;
  return {
    isFoil: typeof f.isFoil === 'boolean' ? f.isFoil : undefined,
    isPromo: typeof f.isPromo === 'boolean' ? f.isPromo : undefined,
    isAlternate: typeof f.isAlternate === 'boolean' ? f.isAlternate : undefined,
  };
}

export function sanitizeArrayFilters(
  filters: unknown
): Partial<CardSearchFilters> {
  const f = filters as Record<string, unknown>;
  return {
    keywords: Array.isArray(f.keywords)
      ? f.keywords.filter((k: unknown) => typeof k === 'string')
      : undefined,
    tags: Array.isArray(f.tags)
      ? f.tags.filter((t: unknown) => typeof t === 'string')
      : undefined,
  };
}

export function sanitizeNumericRangeFilters(
  filters: unknown
): Partial<CardSearchFilters> {
  const f = filters as Record<string, unknown>;
  const isValidNumber = (val: unknown): val is number =>
    typeof val === 'number' && val >= 0;

  return {
    levelMin: isValidNumber(f.levelMin) ? f.levelMin : undefined,
    levelMax: isValidNumber(f.levelMax) ? f.levelMax : undefined,
    costMin: isValidNumber(f.costMin) ? f.costMin : undefined,
    costMax: isValidNumber(f.costMax) ? f.costMax : undefined,
    clashPointsMin: isValidNumber(f.clashPointsMin)
      ? f.clashPointsMin
      : undefined,
    clashPointsMax: isValidNumber(f.clashPointsMax)
      ? f.clashPointsMax
      : undefined,
    priceMin: isValidNumber(f.priceMin) ? f.priceMin : undefined,
    priceMax: isValidNumber(f.priceMax) ? f.priceMax : undefined,
    hitPointsMin: isValidNumber(f.hitPointsMin) ? f.hitPointsMin : undefined,
    hitPointsMax: isValidNumber(f.hitPointsMax) ? f.hitPointsMax : undefined,
    attackPointsMin: isValidNumber(f.attackPointsMin)
      ? f.attackPointsMin
      : undefined,
    attackPointsMax: isValidNumber(f.attackPointsMax)
      ? f.attackPointsMax
      : undefined,
  };
}

export function sanitizeSearchOptions(options: unknown): CardSearchOptions {
  const o = options as Record<string, unknown>;
  const validSortFields = [
    'name',
    'level',
    'cost',
    'clashPoints',
    'price',
    'hitPoints',
    'attackPoints',
    'setNumber',
    'createdAt',
  ];

  return {
    page: typeof o.page === 'number' && o.page > 0 ? Math.floor(o.page) : 1,
    limit:
      typeof o.limit === 'number' && o.limit > 0 && o.limit <= 100
        ? Math.floor(o.limit)
        : 20,
    sortBy: validSortFields.includes(o.sortBy as string)
      ? (o.sortBy as CardSearchOptions['sortBy'])
      : 'name',
    sortOrder: ['asc', 'desc'].includes(o.sortOrder as string)
      ? (o.sortOrder as 'asc' | 'desc')
      : 'asc',
    includeRelations:
      typeof o.includeRelations === 'boolean' ? o.includeRelations : true,
  };
}

export function sanitizeAllFilters(filters: unknown): CardSearchFilters {
  return {
    ...sanitizeTextFilters(filters),
    ...sanitizeIdFilters(filters),
    ...sanitizeCategoricalFilters(filters),
    ...sanitizeBooleanFilters(filters),
    ...sanitizeArrayFilters(filters),
    ...sanitizeNumericRangeFilters(filters),
  };
}
