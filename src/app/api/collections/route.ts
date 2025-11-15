/**
 * User Collections API
 *
 * Handles operations for user card collections
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';
import {
  buildCardWhereClause,
  parsePaginationParams,
  calculateCollectionStatistics,
  getEmptyCollectionResponse,
  getOrCreateCollection,
  processCardOperation,
  type CardAction,
} from './helpers';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const rarity = searchParams.get('rarity');
    const type = searchParams.get('type');
    const faction = searchParams.get('faction');

    const { page, limit, skip } = parsePaginationParams(
      searchParams.get('page'),
      searchParams.get('limit')
    );

    // Build where clause for card filtering
    const cardWhere = buildCardWhereClause(search, rarity, type, faction);

    // Get user's collection
    const userCollection = await prisma.collection.findUnique({
      where: { userId: session.user.id },
    });

    // If no collection exists yet, return empty collection
    if (!userCollection) {
      return NextResponse.json(getEmptyCollectionResponse(session.user.id, page, limit));
    }

    // Get collection cards with pagination
    const [collectionCards, total] = await Promise.all([
      prisma.collectionCard.findMany({
        where: {
          collection: {
            userId: session.user.id,
          },
          card: cardWhere,
        },
        include: {
          card: {
            include: {
              type: true,
              rarity: true,
            },
          },
        },
        orderBy: { id: 'desc' },
        skip,
        take: limit,
      }),
      prisma.collectionCard.count({
        where: {
          collection: {
            userId: session.user.id,
          },
          card: cardWhere,
        },
      }),
    ]);

    // Calculate collection statistics
    const statistics = await calculateCollectionStatistics(session.user.id);

    return NextResponse.json({
      collection: {
        userId: session.user.id,
        cards: collectionCards.map((cc) => ({
          cardId: cc.cardId,
          card: cc.card,
          quantity: cc.quantity,
          addedAt: cc.card.createdAt,
        })),
        statistics,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get collection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const {
      cardId,
      quantity,
      condition: _condition = 'Near Mint',
      action = 'add',
    } = await request.json();

    // Validate input
    if (!cardId) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }

    const parsedQuantity = Math.max(0, parseInt(quantity) || 1);

    // Verify card exists
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: { id: true, name: true },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Get or create user's collection
    const userCollection = await getOrCreateCollection(session.user.id);

    // Check if card is already in collection
    const existingCollectionCard = await prisma.collectionCard.findUnique({
      where: {
        collectionId_cardId: {
          collectionId: userCollection.id,
          cardId,
        },
      },
    });

    // Process card operation
    try {
      const result = await processCardOperation(
        action as CardAction,
        userCollection.id,
        cardId,
        card.name,
        parsedQuantity,
        existingCollectionCard
      );

      return NextResponse.json({
        message: `Card ${result.action} successfully`,
        result,
      });
    } catch (operationError) {
      if (operationError instanceof Error) {
        return NextResponse.json(
          { error: operationError.message },
          { status: operationError.message.includes('not in collection') ? 404 : 400 }
        );
      }
      throw operationError;
    }
  } catch (error) {
    console.error('Update collection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
