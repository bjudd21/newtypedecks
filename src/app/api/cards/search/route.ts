/**
 * Card Search API Route
 *
 * POST /api/cards/search
 * Handles card search requests with comprehensive filtering and pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import { CardService } from '@/lib/services/cardService';
import type {
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '@/lib/types/card';

// Helper functions for filter sanitization

function sanitizeTextFilters(filters: unknown): Partial<CardSearchFilters> {
  const f = filters as Record<string, unknown>;
  return {
    name: typeof f.name === 'string' ? f.name.trim() : undefined,
    pilot: typeof f.pilot === 'string' ? f.pilot.trim() : undefined,
    model: typeof f.model === 'string' ? f.model.trim() : undefined,
  };
}

function sanitizeIdFilters(filters: unknown): Partial<CardSearchFilters> {
  const f = filters as Record<string, unknown>;
  return {
    typeId: typeof f.typeId === 'string' ? f.typeId : undefined,
    rarityId: typeof f.rarityId === 'string' ? f.rarityId : undefined,
    setId: typeof f.setId === 'string' ? f.setId : undefined,
  };
}

function sanitizeCategoricalFilters(
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

function sanitizeBooleanFilters(filters: unknown): Partial<CardSearchFilters> {
  const f = filters as Record<string, unknown>;
  return {
    isFoil: typeof f.isFoil === 'boolean' ? f.isFoil : undefined,
    isPromo: typeof f.isPromo === 'boolean' ? f.isPromo : undefined,
    isAlternate: typeof f.isAlternate === 'boolean' ? f.isAlternate : undefined,
  };
}

function sanitizeArrayFilters(filters: unknown): Partial<CardSearchFilters> {
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

function sanitizeNumericRangeFilters(
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

function sanitizeSearchOptions(options: unknown): CardSearchOptions {
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

function validateRanges(filters: CardSearchFilters): NextResponse | null {
  const ranges = [
    { min: filters.levelMin, max: filters.levelMax, field: 'level' },
    { min: filters.costMin, max: filters.costMax, field: 'cost' },
    {
      min: filters.clashPointsMin,
      max: filters.clashPointsMax,
      field: 'clashPoints',
    },
    { min: filters.priceMin, max: filters.priceMax, field: 'price' },
    {
      min: filters.hitPointsMin,
      max: filters.hitPointsMax,
      field: 'hitPoints',
    },
    {
      min: filters.attackPointsMin,
      max: filters.attackPointsMax,
      field: 'attackPoints',
    },
  ];

  for (const range of ranges) {
    if (
      range.min !== undefined &&
      range.max !== undefined &&
      range.min > range.max
    ) {
      return NextResponse.json(
        {
          error: 'Invalid range',
          message: `${range.field}Min cannot be greater than ${range.field}Max`,
          field: range.field,
        },
        { status: 400 }
      );
    }
  }

  return null;
}

function buildSearchMetadata(
  filters: CardSearchFilters,
  options: CardSearchOptions
) {
  return {
    hasFilters: Object.values(filters).some(
      (value) =>
        value !== undefined &&
        value !== null &&
        (Array.isArray(value) ? value.length > 0 : true)
    ),
    appliedFilters: Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    searchOptions: options,
    timestamp: new Date().toISOString(),
  };
}

function handleSearchError(error: unknown): NextResponse {
  console.error('Card search API error:', error);

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: 'Invalid JSON', message: 'Request body must be valid JSON' },
      { status: 400 }
    );
  }

  if (error instanceof Error && error.message.includes('Validation failed')) {
    return NextResponse.json(
      { error: 'Validation error', message: error.message },
      { status: 400 }
    );
  }

  if (error instanceof Error && error.message.includes('connect')) {
    return NextResponse.json(
      { error: 'Database error', message: 'Unable to connect to database' },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters = {}, options = {} } = body;

    // Sanitize all filters using helper functions
    const sanitizedFilters: CardSearchFilters = {
      ...sanitizeTextFilters(filters),
      ...sanitizeIdFilters(filters),
      ...sanitizeCategoricalFilters(filters),
      ...sanitizeBooleanFilters(filters),
      ...sanitizeArrayFilters(filters),
      ...sanitizeNumericRangeFilters(filters),
    };

    // Sanitize search options
    const sanitizedOptions = sanitizeSearchOptions(options);

    // Validate range filters
    const rangeError = validateRanges(sanitizedFilters);
    if (rangeError) return rangeError;

    // Execute search using CardService
    const result: CardSearchResult = await CardService.searchCards(
      sanitizedFilters,
      sanitizedOptions
    );

    // Build and return response with metadata
    const response = {
      ...result,
      searchMeta: buildSearchMetadata(sanitizedFilters, sanitizedOptions),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleSearchError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters for basic GET support
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('limit') || '20'))
    );
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as
      | 'asc'
      | 'desc';

    // Basic filters from query params
    const filters: CardSearchFilters = {};
    const search = searchParams.get('search')?.trim();
    if (search) {
      filters.name = search;
    }

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
    ] as const;
    type ValidSortField = (typeof validSortFields)[number];
    const options: CardSearchOptions = {
      page,
      limit,
      sortBy: validSortFields.includes(sortBy as ValidSortField)
        ? (sortBy as ValidSortField)
        : 'name',
      sortOrder,
      includeRelations: true,
    };

    // Execute search using CardService
    const result: CardSearchResult = await CardService.searchCards(
      filters,
      options
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Card search GET API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
