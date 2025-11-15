/**
 * Individual Deck API
 *
 * Handles operations on specific user decks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';
import {
  checkDeckAccess,
  checkDeckOwnership,
  calculateDeckStatistics,
  validateDeckName,
  validateDeckCards,
  createDeckVersion,
  updateDeckCards,
} from './helpers';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Find the deck
    const deck = await prisma.deck.findUnique({
      where: { id },
      include: {
        cards: {
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    // Check permissions
    const { allowed } = await checkDeckAccess(id, session?.user?.id);
    if (!allowed) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Calculate statistics
    const statistics = calculateDeckStatistics(deck.cards);

    const deckWithStats = {
      id: deck.id,
      name: deck.name,
      description: deck.description,
      isPublic: deck.isPublic,
      userId: deck.userId,
      user: deck.user,
      cards: deck.cards.map((dc) => ({
        cardId: dc.cardId,
        card: dc.card,
        quantity: dc.quantity,
        category: dc.category || 'main',
      })),
      statistics,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
    };

    return NextResponse.json(deckWithStats);
  } catch (error) {
    console.error('Get deck error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { name, description, isPublic, cards } = await request.json();

    // Check ownership
    const { owned, deck } = await checkDeckOwnership(id, session.user.id);
    if (!owned || !deck) {
      return NextResponse.json(
        { error: 'Deck not found or access denied' },
        { status: 404 }
      );
    }

    // Validate input
    if (name) {
      const nameError = validateDeckName(name);
      if (nameError) {
        return NextResponse.json({ error: nameError }, { status: 400 });
      }
    }

    // If cards are being updated, validate them
    if (cards && Array.isArray(cards)) {
      const cardsError = await validateDeckCards(cards);
      if (cardsError) {
        return NextResponse.json({ error: cardsError }, { status: 400 });
      }
    }

    // Update deck metadata
    interface DeckUpdateData {
      name?: string;
      description?: string | null;
      isPublic?: boolean;
    }

    const updateData: DeckUpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic);

    const updatedDeck = await prisma.deck.update({
      where: { id },
      data: updateData,
      include: {
        cards: {
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
              },
            },
          },
        },
      },
    });

    // If cards are being updated, replace all cards and create version
    if (cards && Array.isArray(cards)) {
      const result = await prisma.$transaction(async (tx) => {
        await createDeckVersion(id, session.user.id, tx);
        return await updateDeckCards(id, cards, tx);
      });

      return NextResponse.json({
        message: 'Deck updated successfully',
        deck: result,
      });
    }

    return NextResponse.json({
      message: 'Deck updated successfully',
      deck: updatedDeck,
    });
  } catch (error) {
    console.error('Update deck error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check ownership
    const { owned, deck } = await checkDeckOwnership(id, session.user.id);
    if (!owned || !deck) {
      return NextResponse.json(
        { error: 'Deck not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the deck (cascade will handle deck cards)
    await prisma.deck.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Deck deleted successfully',
      deckName: deck.name,
    });
  } catch (error) {
    console.error('Delete deck error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
