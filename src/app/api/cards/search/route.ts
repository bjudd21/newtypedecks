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
import {
  sanitizeAllFilters,
  sanitizeSearchOptions,
  validateRanges,
  buildSearchMetadata,
  handleSearchError,
} from './helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters = {}, options = {} } = body;

    // Sanitize all filters using helper functions
    const sanitizedFilters: CardSearchFilters = sanitizeAllFilters(filters);

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
