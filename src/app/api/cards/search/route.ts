/**
 * Card Search API Route
 *
 * POST /api/cards/search
 * Handles card search requests with comprehensive filtering and pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import { CardService } from '@/lib/services/cardService';
import type { CardSearchFilters, CardSearchOptions, CardSearchResult } from '@/lib/types/card';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters = {}, options = {} } = body;

    // Validate and sanitize filters
    const sanitizedFilters: CardSearchFilters = {
      // Text filters
      name: typeof filters.name === 'string' ? filters.name.trim() : undefined,
      pilot: typeof filters.pilot === 'string' ? filters.pilot.trim() : undefined,
      model: typeof filters.model === 'string' ? filters.model.trim() : undefined,

      // ID filters
      typeId: typeof filters.typeId === 'string' ? filters.typeId : undefined,
      rarityId: typeof filters.rarityId === 'string' ? filters.rarityId : undefined,
      setId: typeof filters.setId === 'string' ? filters.setId : undefined,

      // Categorical filters
      faction: typeof filters.faction === 'string' ? filters.faction : undefined,
      series: typeof filters.series === 'string' ? filters.series : undefined,
      nation: typeof filters.nation === 'string' ? filters.nation : undefined,
      language: typeof filters.language === 'string' ? filters.language : undefined,

      // Boolean filters
      isFoil: typeof filters.isFoil === 'boolean' ? filters.isFoil : undefined,
      isPromo: typeof filters.isPromo === 'boolean' ? filters.isPromo : undefined,
      isAlternate: typeof filters.isAlternate === 'boolean' ? filters.isAlternate : undefined,

      // Array filters
      keywords: Array.isArray(filters.keywords) ? filters.keywords.filter((k: any) => typeof k === 'string') : undefined,
      tags: Array.isArray(filters.tags) ? filters.tags.filter((t: any) => typeof t === 'string') : undefined,

      // Numeric range filters with validation
      levelMin: typeof filters.levelMin === 'number' && filters.levelMin >= 0 ? filters.levelMin : undefined,
      levelMax: typeof filters.levelMax === 'number' && filters.levelMax >= 0 ? filters.levelMax : undefined,
      costMin: typeof filters.costMin === 'number' && filters.costMin >= 0 ? filters.costMin : undefined,
      costMax: typeof filters.costMax === 'number' && filters.costMax >= 0 ? filters.costMax : undefined,
      clashPointsMin: typeof filters.clashPointsMin === 'number' && filters.clashPointsMin >= 0 ? filters.clashPointsMin : undefined,
      clashPointsMax: typeof filters.clashPointsMax === 'number' && filters.clashPointsMax >= 0 ? filters.clashPointsMax : undefined,
      priceMin: typeof filters.priceMin === 'number' && filters.priceMin >= 0 ? filters.priceMin : undefined,
      priceMax: typeof filters.priceMax === 'number' && filters.priceMax >= 0 ? filters.priceMax : undefined,
      hitPointsMin: typeof filters.hitPointsMin === 'number' && filters.hitPointsMin >= 0 ? filters.hitPointsMin : undefined,
      hitPointsMax: typeof filters.hitPointsMax === 'number' && filters.hitPointsMax >= 0 ? filters.hitPointsMax : undefined,
      attackPointsMin: typeof filters.attackPointsMin === 'number' && filters.attackPointsMin >= 0 ? filters.attackPointsMin : undefined,
      attackPointsMax: typeof filters.attackPointsMax === 'number' && filters.attackPointsMax >= 0 ? filters.attackPointsMax : undefined,
    };

    // Validate and sanitize options
    const sanitizedOptions: CardSearchOptions = {
      page: typeof options.page === 'number' && options.page > 0 ? Math.floor(options.page) : 1,
      limit: typeof options.limit === 'number' && options.limit > 0 && options.limit <= 100
        ? Math.floor(options.limit) : 20,
      sortBy: ['name', 'level', 'cost', 'clashPoints', 'price', 'hitPoints', 'attackPoints', 'setNumber', 'createdAt']
        .includes(options.sortBy) ? options.sortBy : 'name',
      sortOrder: ['asc', 'desc'].includes(options.sortOrder) ? options.sortOrder : 'asc',
      includeRelations: typeof options.includeRelations === 'boolean' ? options.includeRelations : true,
    };

    // Validate range filters (min should not be greater than max)
    const rangeValidation = [
      { min: sanitizedFilters.levelMin, max: sanitizedFilters.levelMax, field: 'level' },
      { min: sanitizedFilters.costMin, max: sanitizedFilters.costMax, field: 'cost' },
      { min: sanitizedFilters.clashPointsMin, max: sanitizedFilters.clashPointsMax, field: 'clashPoints' },
      { min: sanitizedFilters.priceMin, max: sanitizedFilters.priceMax, field: 'price' },
      { min: sanitizedFilters.hitPointsMin, max: sanitizedFilters.hitPointsMax, field: 'hitPoints' },
      { min: sanitizedFilters.attackPointsMin, max: sanitizedFilters.attackPointsMax, field: 'attackPoints' },
    ];

    for (const range of rangeValidation) {
      if (range.min !== undefined && range.max !== undefined && range.min > range.max) {
        return NextResponse.json(
          {
            error: 'Invalid range',
            message: `${range.field}Min cannot be greater than ${range.field}Max`,
            field: range.field
          },
          { status: 400 }
        );
      }
    }

    // Execute search using CardService
    const result: CardSearchResult = await CardService.searchCards(sanitizedFilters, sanitizedOptions);

    // Add search metadata
    const response = {
      ...result,
      searchMeta: {
        hasFilters: Object.values(sanitizedFilters).some(value =>
          value !== undefined && value !== null &&
          (Array.isArray(value) ? value.length > 0 : true)
        ),
        appliedFilters: Object.entries(sanitizedFilters)
          .filter(([, value]) => value !== undefined && value !== null)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        searchOptions: sanitizedOptions,
        timestamp: new Date().toISOString(),
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Card search API error:', error);

    // Handle different types of errors
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

    // Database connection errors
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json(
        { error: 'Database error', message: 'Unable to connect to database' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters for basic GET support
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

    // Basic filters from query params
    const filters: CardSearchFilters = {};
    const search = searchParams.get('search')?.trim();
    if (search) {
      filters.name = search;
    }

    const options: CardSearchOptions = {
      page,
      limit,
      sortBy: ['name', 'level', 'cost', 'clashPoints', 'price', 'hitPoints', 'attackPoints', 'setNumber', 'createdAt']
        .includes(sortBy) ? sortBy as any : 'name',
      sortOrder,
      includeRelations: true,
    };

    // Execute search using CardService
    const result: CardSearchResult = await CardService.searchCards(filters, options);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Card search GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}