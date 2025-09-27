/**
 * Individual Deck API
 *
 * Handles operations on specific user decks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

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
        deckCards: {
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                faction: true,
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      );
    }

    // Check permissions - must be owner or deck must be public
    if (!deck.isPublic && (!session?.user || deck.userId !== session.user.id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Calculate statistics
    const totalCards = deck.deckCards.reduce((sum, dc) => sum + dc.quantity, 0);
    const uniqueCards = deck.deckCards.length;
    const totalCost = deck.deckCards.reduce((sum, dc) => sum + ((dc.card.cost || 0) * dc.quantity), 0);
    const averageCost = totalCards > 0 ? totalCost / totalCards : 0;

    const deckWithStats = {
      id: deck.id,
      name: deck.name,
      description: deck.description,
      format: deck.format,
      isPublic: deck.isPublic,
      userId: deck.userId,
      user: deck.user,
      cards: deck.deckCards.map(dc => ({
        cardId: dc.cardId,
        card: dc.card,
        quantity: dc.quantity,
        category: dc.category || 'main'
      })),
      statistics: {
        totalCards,
        uniqueCards,
        totalCost,
        averageCost: Math.round(averageCost * 100) / 100,
        colors: [...new Set(deck.deckCards.map(dc => dc.card.faction?.name).filter(Boolean))],
      },
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

    const { name, description, format, isPublic, cards } = await request.json();

    // Check if deck exists and user owns it
    const existingDeck = await prisma.deck.findUnique({
      where: { id },
      select: { userId: true, name: true }
    });

    if (!existingDeck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      );
    }

    if (existingDeck.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Validate input
    if (name && (name.length < 1 || name.length > 100)) {
      return NextResponse.json(
        { error: 'Deck name must be between 1 and 100 characters' },
        { status: 400 }
      );
    }

    // If cards are being updated, validate them
    if (cards && Array.isArray(cards)) {
      if (cards.length === 0) {
        return NextResponse.json(
          { error: 'Deck must contain at least one card' },
          { status: 400 }
        );
      }

      const cardIds = cards.map((c: any) => c.cardId || c.card?.id).filter(Boolean);
      const existingCards = await prisma.card.findMany({
        where: { id: { in: cardIds } },
        select: { id: true }
      });

      if (existingCards.length !== new Set(cardIds).size) {
        return NextResponse.json(
          { error: 'Some cards in the deck do not exist' },
          { status: 400 }
        );
      }
    }

    // Update deck
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (format !== undefined) updateData.format = format;
    if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic);

    const updatedDeck = await prisma.deck.update({
      where: { id },
      data: updateData,
      include: {
        deckCards: {
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                faction: true,
              }
            }
          }
        }
      }
    });

    // If cards are being updated, replace all cards
    if (cards && Array.isArray(cards)) {
      // Delete existing cards
      await prisma.deckCard.deleteMany({
        where: { deckId: id }
      });

      // Add new cards
      await prisma.deckCard.createMany({
        data: cards.map((card: any) => ({
          deckId: id,
          cardId: card.cardId || card.card?.id,
          quantity: Math.max(1, Math.min(4, parseInt(card.quantity) || 1)),
          category: card.category || 'main'
        }))
      });

      // Fetch updated deck with new cards
      const finalDeck = await prisma.deck.findUnique({
        where: { id },
        include: {
          deckCards: {
            include: {
              card: {
                include: {
                  type: true,
                  rarity: true,
                  faction: true,
                }
              }
            }
          }
        }
      });

      return NextResponse.json({
        message: 'Deck updated successfully',
        deck: finalDeck
      });
    }

    return NextResponse.json({
      message: 'Deck updated successfully',
      deck: updatedDeck
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

    // Check if deck exists and user owns it
    const existingDeck = await prisma.deck.findUnique({
      where: { id },
      select: { userId: true, name: true }
    });

    if (!existingDeck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      );
    }

    if (existingDeck.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Delete the deck (cascade will handle deck cards)
    await prisma.deck.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Deck deleted successfully',
      deckName: existingDeck.name
    });
  } catch (error) {
    console.error('Delete deck error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
