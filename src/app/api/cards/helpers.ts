/**
 * Helper functions for cards API route
 */

import type { CardSearchFilters, CardSearchOptions } from '@/lib/types';

/**
 * Valid sort fields for card search
 */
export const VALID_SORT_FIELDS = [
  'name',
  'level',
  'cost',
  'clashPoints',
  'price',
  'hitPoints',
  'attackPoints',
  'setNumber',
  'createdAt',
] as const;

export type ValidSortField = (typeof VALID_SORT_FIELDS)[number];

/**
 * Parse pagination parameters from URL search params
 */
export function parsePaginationParams(searchParams: URLSearchParams): {
  page: number;
  limit: number;
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') || '20'))
  );
  return { page, limit };
}

/**
 * Parse sorting parameters from URL search params
 */
export function parseSortParams(searchParams: URLSearchParams): {
  sortBy: ValidSortField;
  sortOrder: 'asc' | 'desc';
} {
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

  return {
    sortBy: VALID_SORT_FIELDS.includes(sortBy as ValidSortField)
      ? (sortBy as ValidSortField)
      : 'name',
    sortOrder,
  };
}

/**
 * Parse a string filter parameter
 */
function parseStringFilter(
  searchParams: URLSearchParams,
  param: string
): string | undefined {
  const value = searchParams.get(param)?.trim();
  return value || undefined;
}

/**
 * Parse a numeric filter parameter
 */
function parseNumericFilter(
  searchParams: URLSearchParams,
  param: string
): number | undefined {
  const value = searchParams.get(param);
  if (value && !isNaN(Number(value))) {
    return parseInt(value);
  }
  return undefined;
}

/**
 * Parse filter parameters from URL search params
 */
export function parseFilterParams(
  searchParams: URLSearchParams
): CardSearchFilters {
  const filters: CardSearchFilters = {};

  // Text filter
  const search = parseStringFilter(searchParams, 'search');
  if (search) {
    filters.name = search;
  }

  // Category filters
  filters.typeId = parseStringFilter(searchParams, 'type');
  filters.rarityId = parseStringFilter(searchParams, 'rarity');
  filters.setId = parseStringFilter(searchParams, 'set');
  filters.faction = parseStringFilter(searchParams, 'faction');
  filters.series = parseStringFilter(searchParams, 'series');

  // Numeric filters
  filters.levelMin = parseNumericFilter(searchParams, 'levelMin');
  filters.levelMax = parseNumericFilter(searchParams, 'levelMax');
  filters.costMin = parseNumericFilter(searchParams, 'costMin');
  filters.costMax = parseNumericFilter(searchParams, 'costMax');

  return filters;
}

/**
 * Build search options from parsed parameters
 */
export function buildSearchOptions(
  page: number,
  limit: number,
  sortBy: ValidSortField,
  sortOrder: 'asc' | 'desc'
): CardSearchOptions {
  return {
    page,
    limit,
    sortBy,
    sortOrder,
    includeRelations: true,
  };
}

/**
 * Format API response with pagination and filters
 */
export function formatCardsResponse(
  result: {
    cards: unknown[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  searchParams: URLSearchParams,
  filters: CardSearchFilters
) {
  const search = searchParams.get('search')?.trim();
  const type = searchParams.get('type')?.trim();
  const rarity = searchParams.get('rarity')?.trim();
  const set = searchParams.get('set')?.trim();
  const faction = searchParams.get('faction')?.trim();
  const series = searchParams.get('series')?.trim();

  return {
    cards: result.cards,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
      hasNext: result.page < result.totalPages,
      hasPrev: result.page > 1,
    },
    filters: {
      search: search || undefined,
      type: type || undefined,
      rarity: rarity || undefined,
      set: set || undefined,
      faction: faction || undefined,
      series: series || undefined,
      levelMin: filters.levelMin,
      levelMax: filters.levelMax,
      costMin: filters.costMin,
      costMax: filters.costMax,
    },
  };
}
