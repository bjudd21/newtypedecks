/**
 * Individual Deck Version API
 *
 * Handles operations on specific deck versions (restore, delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

interface RouteContext {
  params: Promise<{ id: string; versionId: string }>;
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

    const { id: deckId, versionId } = await context.params;

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

    // Get specific version
    const version = await prisma.deckVersion.findUnique({
      where: {
        id: versionId,
        deckId: deckId
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
          },
          orderBy: [
            { category: 'asc' },
            { card: { name: 'asc' } }
          ]
        }
      }
    });

    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const versionWithStats = {
      id: version.id,
      version: version.version,
      name: version.name,
      description: version.description,
      versionName: version.versionName,
      changeNote: version.changeNote,
      isPublic: version.isPublic,
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
    };

    return NextResponse.json({
      deck: {
        id: deck.id,
        name: deck.name
      },
      version: versionWithStats
    });
  } catch (error) {
    console.error('Get deck version error:', error);
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

    const { id: deckId, versionId } = await context.params;
    const { action } = await request.json();

    if (action !== 'restore') {
      return NextResponse.json(
        { error: 'Invalid action. Only "restore" is supported.' },
        { status: 400 }
      );
    }

    // Verify deck exists and user has access
    const deck = await prisma.deck.findUnique({
      where: {
        id: deckId,
        userId: session.user.id
      }
    });

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found or access denied' },
        { status: 404 }
      );
    }

    // Get the version to restore
    const versionToRestore = await prisma.deckVersion.findUnique({
      where: {
        id: versionId,
        deckId: deckId
      },
      include: {
        cards: true
      }
    });

    if (!versionToRestore) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    // Perform restore in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // First, create a new version with current state (before restoration)
      const currentVersion = await tx.deckVersion.findFirst({
        where: { deckId },
        orderBy: { version: 'desc' }
      });

      const nextVersion = (currentVersion?.version || 0) + 1;

      // Save current state as "Before restoration" version
      const currentDeckCards = await tx.deckCard.findMany({
        where: { deckId }
      });

      await tx.deckVersion.create({
        data: {
          deckId,
          version: nextVersion,
          name: deck.name,
          description: deck.description,
          versionName: `Before restoring to v${versionToRestore.version}`,
          changeNote: `Automatic backup before restoring to version ${versionToRestore.version}`,
          isPublic: deck.isPublic,
          createdBy: session.user.id,
          cards: {
            create: currentDeckCards.map(deckCard => ({
              cardId: deckCard.cardId,
              quantity: deckCard.quantity,
              category: deckCard.category
            }))
          }
        }
      });

      // Delete current deck cards
      await tx.deckCard.deleteMany({
        where: { deckId }
      });

      // Restore cards from the selected version
      const restoredCards = await tx.deckCard.createMany({
        data: versionToRestore.cards.map(vc => ({
          deckId,
          cardId: vc.cardId,
          quantity: vc.quantity,
          category: vc.category
        }))
      });

      // Update deck metadata
      await tx.deck.update({
        where: { id: deckId },
        data: {
          name: versionToRestore.name,
          description: versionToRestore.description,
          currentVersion: nextVersion + 1,
          versionName: `Restored from v${versionToRestore.version}`,
          updatedAt: new Date()
        }
      });

      return { restoredCards, newVersion: nextVersion + 1 };
    });

    return NextResponse.json({
      message: `Deck restored to version ${versionToRestore.version}`,
      restoredFromVersion: versionToRestore.version,
      newCurrentVersion: result.newVersion
    });
  } catch (error) {
    console.error('Restore deck version error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: deckId, versionId } = await context.params;

    // Verify deck exists and user has access
    const deck = await prisma.deck.findUnique({
      where: {
        id: deckId,
        userId: session.user.id
      }
    });

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found or access denied' },
        { status: 404 }
      );
    }

    // Get the version to delete
    const versionToDelete = await prisma.deckVersion.findUnique({
      where: {
        id: versionId,
        deckId: deckId
      }
    });

    if (!versionToDelete) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    // Check if this is the only version
    const versionCount = await prisma.deckVersion.count({
      where: { deckId }
    });

    if (versionCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the only version of a deck' },
        { status: 400 }
      );
    }

    // Delete the version (cascade will delete version cards)
    await prisma.deckVersion.delete({
      where: { id: versionId }
    });

    return NextResponse.json({
      message: `Version ${versionToDelete.version} deleted successfully`
    });
  } catch (error) {
    console.error('Delete deck version error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}