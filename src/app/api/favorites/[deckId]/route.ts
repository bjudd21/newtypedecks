/**
 * Individual Favorite Deck API
 *
 * Handles operations on specific favorite decks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

interface RouteContext {
  params: Promise<{ deckId: string }>;
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

    const { deckId } = await context.params;

    // Find and delete the favorite
    const favorite = await prisma.userFavoriteDeck.findUnique({
      where: {
        userId_deckId: {
          userId: session.user.id,
          deckId: deckId
        }
      },
      include: {
        deck: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    await prisma.userFavoriteDeck.delete({
      where: {
        userId_deckId: {
          userId: session.user.id,
          deckId: deckId
        }
      }
    });

    return NextResponse.json({
      message: 'Deck removed from favorites successfully',
      deckName: favorite.deck.name
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
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

    const { deckId } = await context.params;

    // Check if deck is favorited by user
    const favorite = await prisma.userFavoriteDeck.findUnique({
      where: {
        userId_deckId: {
          userId: session.user.id,
          deckId: deckId
        }
      }
    });

    return NextResponse.json({
      isFavorited: !!favorite,
      favoritedAt: favorite?.createdAt || null
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}