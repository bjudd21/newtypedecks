/**
 * Deck Versions API
 *
 * Handles version management for individual decks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: deckId } = await context.params;

    // Verify deck exists and user has access
    const deck = await prisma.deck.findUnique({
      where: {
        id: deckId,
        userId: session.user.id
      },
      select: { id: true, name: true }
    });

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found or access denied' },
        { status: 404 }
      );
    }

    // Get all versions for this deck
    const versions = await prisma.deckVersion.findMany({
      where: { deckId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        cards: {
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                set: true
              }
            }
          }
        },
        _count: {
          select: { cards: true }
        }
      },
      orderBy: { version: 'desc' }
    });

    // Calculate statistics for each version
    const versionsWithStats = versions.map(version => ({
      id: version.id,
      version: version.version,
      name: version.name,
      description: version.description,
      versionName: version.versionName,
      changeNote: version.changeNote,
      createdBy: version.creator,
      createdAt: version.createdAt,
      cardCount: version.cards.reduce((sum, vc) => sum + vc.quantity, 0),
      uniqueCards: version.cards.length,
      totalCost: version.cards.reduce((sum, vc) => sum + ((vc.card.cost || 0) * vc.quantity), 0),
      cards: version.cards.map(vc => ({
        id: vc.id,
        cardId: vc.cardId,
        quantity: vc.quantity,
        category: vc.category,
        card: vc.card
      }))
    }));

    return NextResponse.json({
      deck: {
        id: deck.id,
        name: deck.name
      },
      versions: versionsWithStats
    });
  } catch (error) {
    console.error('Get deck versions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: deckId } = await context.params;
    const { versionName, changeNote } = await request.json();

    // Verify deck exists and user has access
    const deck = await prisma.deck.findUnique({
      where: {
        id: deckId,
        userId: session.user.id
      },
      include: {
        cards: {
          include: {
            card: true
          }
        }
      }
    });

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found or access denied' },
        { status: 404 }
      );
    }

    // Get the next version number
    const lastVersion = await prisma.deckVersion.findFirst({
      where: { deckId },
      orderBy: { version: 'desc' },
      select: { version: true }
    });

    const nextVersion = (lastVersion?.version || 0) + 1;

    // Create new version with current deck state
    const newVersion = await prisma.deckVersion.create({
      data: {
        deckId,
        version: nextVersion,
        name: deck.name,
        description: deck.description,
        versionName: versionName?.trim() || null,
        changeNote: changeNote?.trim() || null,
        isPublic: deck.isPublic,
        createdBy: session.user.id,
        cards: {
          create: deck.cards.map(deckCard => ({
            cardId: deckCard.cardId,
            quantity: deckCard.quantity,
            category: deckCard.category
          }))
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        cards: {
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                set: true
              }
            }
          }
        }
      }
    });

    // Update deck's current version
    await prisma.deck.update({
      where: { id: deckId },
      data: {
        currentVersion: nextVersion,
        versionName: versionName?.trim() || null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      {
        message: 'Version created successfully',
        version: {
          id: newVersion.id,
          version: newVersion.version,
          name: newVersion.name,
          description: newVersion.description,
          versionName: newVersion.versionName,
          changeNote: newVersion.changeNote,
          createdBy: newVersion.creator,
          createdAt: newVersion.createdAt,
          cardCount: newVersion.cards.reduce((sum, vc) => sum + vc.quantity, 0),
          uniqueCards: newVersion.cards.length,
          cards: newVersion.cards
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create deck version error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}