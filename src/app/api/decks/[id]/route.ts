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

    // Check permissions - must be owner or deck must be public
    if (!deck.isPublic && (!session?.user || deck.userId !== session.user.id)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Calculate statistics
    const totalCards = deck.cards.reduce((sum, dc) => sum + dc.quantity, 0);
    const uniqueCards = deck.cards.length;
    const totalCost = deck.cards.reduce(
      (sum, dc) => sum + (dc.card.cost || 0) * dc.quantity,
      0
    );
    const averageCost = totalCards > 0 ? totalCost / totalCards : 0;

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
      statistics: {
        totalCards,
        uniqueCards,
        totalCost,
        averageCost: Math.round(averageCost * 100) / 100,
        colors: [
          ...new Set(deck.cards.map((dc) => dc.card.faction).filter(Boolean)),
        ],
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

    const { name, description, isPublic, cards } = await request.json();

    // Check if deck exists and user owns it
    const existingDeck = await prisma.deck.findUnique({
      where: { id },
      select: { userId: true, name: true },
    });

    if (!existingDeck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    if (existingDeck.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
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

      const cardIds = cards
        .map((c: unknown) => {
          const cardObj = c as Record<string, unknown>;
          return (
            cardObj.cardId ||
            (cardObj.card as Record<string, unknown> | undefined)?.id
          );
        })
        .filter(Boolean);
      const existingCards = await prisma.card.findMany({
        where: { id: { in: cardIds as string[] } },
        select: { id: true },
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
        // Get current deck with cards for version creation
        const currentDeck = await tx.deck.findUnique({
          where: { id },
          include: {
            cards: true,
          },
        });

        if (!currentDeck) {
          throw new Error('Deck not found');
        }

        // Get the next version number
        const lastVersion = await tx.deckVersion.findFirst({
          where: { deckId: id },
          orderBy: { version: 'desc' },
          select: { version: true },
        });

        const nextVersion = (lastVersion?.version || 0) + 1;

        // Create version snapshot of current state (before update)
        if (currentDeck.cards.length > 0) {
          await tx.deckVersion.create({
            data: {
              deckId: id,
              version: nextVersion,
              name: currentDeck.name,
              description: currentDeck.description,
              versionName: `Version ${nextVersion}`,
              changeNote: 'Automatic version created before deck update',
              isPublic: currentDeck.isPublic,
              createdBy: session.user.id,
              cards: {
                create: currentDeck.cards.map((deckCard) => ({
                  cardId: deckCard.cardId,
                  quantity: deckCard.quantity,
                  category: deckCard.category,
                })),
              },
            },
          });

          // Update deck's version tracking
          await tx.deck.update({
            where: { id },
            data: {
              currentVersion: nextVersion,
              updatedAt: new Date(),
            },
          });
        }

        // Delete existing cards
        await tx.deckCard.deleteMany({
          where: { deckId: id },
        });

        // Add new cards
        await tx.deckCard.createMany({
          data: cards.map((card: unknown) => {
            const cardObj = card as Record<string, unknown>;
            return {
              deckId: id,
              cardId: (cardObj.cardId ||
                (cardObj.card as Record<string, unknown> | undefined)
                  ?.id) as string,
              quantity: Math.max(
                1,
                Math.min(4, parseInt(String(cardObj.quantity || 1)))
              ),
              category: (cardObj.category as string) || 'main',
            };
          }),
        });

        // Fetch updated deck with new cards
        const finalDeck = await tx.deck.findUnique({
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
          },
        });

        return finalDeck;
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

    // Check if deck exists and user owns it
    const existingDeck = await prisma.deck.findUnique({
      where: { id },
      select: { userId: true, name: true },
    });

    if (!existingDeck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    if (existingDeck.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Delete the deck (cascade will handle deck cards)
    await prisma.deck.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Deck deleted successfully',
      deckName: existingDeck.name,
    });
  } catch (error) {
    console.error('Delete deck error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
