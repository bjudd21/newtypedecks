// Cards API endpoints
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CardService } from '@/lib/services/cardService';
import { requireAdmin } from '@/middleware/adminAuth';
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};
import {
  parsePaginationParams,
  parseSortParams,
  parseFilterParams,
  buildSearchOptions,
  formatCardsResponse,
} from './helpers';

// GET /api/cards?gameSlug=... - Get all cards with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const { searchParams } = new URL(request.url);

    // Parse all parameters using helper functions
    const { page, limit } = parsePaginationParams(searchParams);
    const { sortBy, sortOrder } = parseSortParams(searchParams);
    const filters = parseFilterParams(searchParams);

    // Scope to the resolved game
    filters.gameId = gameId;

    // Build search options
    const options = buildSearchOptions(page, limit, sortBy, sortOrder);

    // Execute search using CardService
    const result = await CardService.searchCards(filters, options);

    // Format response to match expected API structure
    const response = formatCardsResponse(result, searchParams, filters);

    return NextResponse.json(response, { status: 200, headers: CACHE_HEADERS });
  } catch (error) {
    console.error('Cards API GET error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch cards',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/cards?gameSlug=... - Create a new card (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authError = await requireAdmin();
    if (authError) {
      return authError;
    }

    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const body = await request.json();

    // Create card using CardService, scoped to the resolved game
    const card = await CardService.createCard({ ...body, gameId });

    // Invalidate card search cache so new card appears immediately
    revalidateTag('cards', {});

    return NextResponse.json(
      {
        message: 'Card created successfully',
        card,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Cards API POST error:', error);

    // Handle validation errors
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json(
        {
          error: 'Invalid card data',
          message: error.message,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          error: 'Card already exists',
          message: 'A card with the same set and number already exists',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create card',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
