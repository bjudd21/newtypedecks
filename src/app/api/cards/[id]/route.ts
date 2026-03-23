// Individual card API endpoints
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CardService } from '@/lib/services/cardService';
import { requireAdmin } from '@/middleware/adminAuth';
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/cards/[id]?gameSlug=... - Get a specific card by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const { id } = await params;

    // Get card by ID using CardService
    const card = await CardService.getCardById(id, true);

    if (!card || card.gameId !== gameId) {
      return NextResponse.json(
        {
          error: 'Card not found',
          message: `No card found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(card, { status: 200 });
  } catch (error) {
    console.error('Cards API GET by ID error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch card',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/cards/[id]?gameSlug=... - Update a specific card (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    // Check admin authentication
    const authError = await requireAdmin();
    if (authError) {
      return authError;
    }

    const { id } = await params;
    const body = await request.json();

    // Check if card exists and belongs to the requested game
    const existingCard = await CardService.getCardById(id, false);
    if (!existingCard || existingCard.gameId !== gameId) {
      return NextResponse.json(
        {
          error: 'Card not found',
          message: `No card found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    // Update card using CardService
    const updatedCard = await CardService.updateCard({ id, ...body });

    // Invalidate card search cache so updated data appears immediately
    revalidateTag('cards', {});

    return NextResponse.json(
      {
        message: 'Card updated successfully',
        card: updatedCard,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cards API PUT error:', error);

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

    // Handle unique constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          error: 'Duplicate card',
          message: 'A card with the same set and number already exists',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update card',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/cards/[id]?gameSlug=... - Delete a specific card (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    // Check admin authentication
    const authError = await requireAdmin();
    if (authError) {
      return authError;
    }

    const { id } = await params;

    // Check if card exists and belongs to the requested game
    const existingCard = await CardService.getCardById(id, false);
    if (!existingCard || existingCard.gameId !== gameId) {
      return NextResponse.json(
        {
          error: 'Card not found',
          message: `No card found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    // Delete card using CardService
    const success = await CardService.deleteCard(id);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Failed to delete card',
          message: 'Card could not be deleted due to database constraints',
        },
        { status: 409 }
      );
    }

    // Invalidate card search cache so deleted card disappears immediately
    revalidateTag('cards', {});

    return NextResponse.json(
      {
        message: 'Card deleted successfully',
        id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cards API DELETE error:', error);

    // Handle foreign key constraint errors
    if (
      error instanceof Error &&
      error.message.includes('Foreign key constraint')
    ) {
      return NextResponse.json(
        {
          error: 'Cannot delete card',
          message: 'Card is referenced by other records and cannot be deleted',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to delete card',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
