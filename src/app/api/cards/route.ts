// Cards API endpoints
import { NextRequest, NextResponse } from 'next/server';
import { CardService } from '@/lib/services/cardService';
import type { CardSearchFilters, CardSearchOptions } from '@/lib/types';

// GET /api/cards - Get all cards with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    // Parse sorting parameters
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

    // Parse filter parameters
    const filters: CardSearchFilters = {};

    // Text filters
    const search = searchParams.get('search')?.trim();
    if (search) {
      filters.name = search; // Simple name search for GET endpoint
    }

    // Category filters
    const type = searchParams.get('type')?.trim();
    if (type) filters.typeId = type;

    const rarity = searchParams.get('rarity')?.trim();
    if (rarity) filters.rarityId = rarity;

    const set = searchParams.get('set')?.trim();
    if (set) filters.setId = set;

    const faction = searchParams.get('faction')?.trim();
    if (faction) filters.faction = faction;

    const series = searchParams.get('series')?.trim();
    if (series) filters.series = series;

    // Numeric filters
    const levelMin = searchParams.get('levelMin');
    if (levelMin && !isNaN(Number(levelMin))) {
      filters.levelMin = parseInt(levelMin);
    }

    const levelMax = searchParams.get('levelMax');
    if (levelMax && !isNaN(Number(levelMax))) {
      filters.levelMax = parseInt(levelMax);
    }

    const costMin = searchParams.get('costMin');
    if (costMin && !isNaN(Number(costMin))) {
      filters.costMin = parseInt(costMin);
    }

    const costMax = searchParams.get('costMax');
    if (costMax && !isNaN(Number(costMax))) {
      filters.costMax = parseInt(costMax);
    }

    // Build search options
    const validSortFields = ['name', 'level', 'cost', 'clashPoints', 'price', 'hitPoints', 'attackPoints', 'setNumber', 'createdAt'] as const;
    const options: CardSearchOptions = {
      page,
      limit,
      sortBy: validSortFields.includes(sortBy as any) ? sortBy as any : 'name',
      sortOrder,
      includeRelations: true,
    };

    // Execute search using CardService
    const result = await CardService.searchCards(filters, options);

    // Format response to match expected API structure
    const response = {
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

    return NextResponse.json(response, { status: 200 });
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

// POST /api/cards - Create a new card (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Add authentication and authorization checks for admin users
    // For now, allow card creation without authentication (development only)

    // Create card using CardService
    const card = await CardService.createCard(body);

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
