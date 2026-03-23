/**
 * Card Search API Route
 *
 * POST /api/cards/search
 * Handles card search requests with comprehensive filtering and pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { CardService } from '@/lib/services/cardService';
import type {
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '@/lib/types/card';
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';
import {
  sanitizeAllFilters,
  sanitizeSearchOptions,
  validateRanges,
  buildSearchMetadata,
  handleSearchError,
} from './helpers';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};

const cachedCardSearch = unstable_cache(
  (filters: CardSearchFilters, options: CardSearchOptions) =>
    CardService.searchCards(filters, options),
  ['cards-search'],
  { tags: ['cards'], revalidate: 300 }
);

export async function POST(request: NextRequest) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const body = await request.json();
    const { filters = {}, options = {} } = body;

    // Sanitize all filters using helper functions
    const sanitizedFilters: CardSearchFilters = sanitizeAllFilters(filters);

    // Scope to the resolved game
    sanitizedFilters.gameId = gameId;

    // Sanitize search options
    const sanitizedOptions = sanitizeSearchOptions(options);

    // Validate range filters
    const rangeError = validateRanges(sanitizedFilters);
    if (rangeError) return rangeError;

    // Execute search — cached for 5 min, invalidated on card mutations
    const result: CardSearchResult = await cachedCardSearch(
      sanitizedFilters,
      sanitizedOptions
    );

    // Build and return response with metadata
    const response = {
      ...result,
      searchMeta: buildSearchMetadata(sanitizedFilters, sanitizedOptions),
    };

    return NextResponse.json(response, { status: 200, headers: CACHE_HEADERS });
  } catch (error) {
    return handleSearchError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

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

    // Scope to the resolved game
    filters.gameId = gameId;

    // Execute search — cached for 5 min, invalidated on card mutations
    const result: CardSearchResult = await cachedCardSearch(filters, options);

    return NextResponse.json(result, { status: 200, headers: CACHE_HEADERS });
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
