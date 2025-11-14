// Individual card API endpoints
import { NextRequest, NextResponse } from 'next/server';
import { CardService } from '@/lib/services/cardService';
import { requireAdmin } from '@/middleware/adminAuth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/cards/[id] - Get a specific card by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate ID format (UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          error: 'Invalid card ID',
          message: 'Card ID must be a valid UUID',
        },
        { status: 400 }
      );
    }

    // Get card by ID using CardService
    const card = await CardService.getCardById(id, true);

    if (!card) {
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

// PUT /api/cards/[id] - Update a specific card (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authentication
    const authError = await requireAdmin();
    if (authError) {
      return authError;
    }

    const { id } = await params;
    const body = await request.json();

    // Validate ID format (UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          error: 'Invalid card ID',
          message: 'Card ID must be a valid UUID',
        },
        { status: 400 }
      );
    }

    // Check if card exists first
    const existingCard = await CardService.getCardById(id, false);
    if (!existingCard) {
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

// DELETE /api/cards/[id] - Delete a specific card (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authentication
    const authError = await requireAdmin();
    if (authError) {
      return authError;
    }

    const { id } = await params;

    // Validate ID format (UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          error: 'Invalid card ID',
          message: 'Card ID must be a valid UUID',
        },
        { status: 400 }
      );
    }

    // Check if card exists first
    const existingCard = await CardService.getCardById(id, false);
    if (!existingCard) {
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
