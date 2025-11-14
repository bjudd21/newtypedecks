/**
 * User Collections API
 *
 * Handles operations for user card collections
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';
import type { PrismaCardWhere } from '@/lib/types';

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const rarity = searchParams.get('rarity');
    const type = searchParams.get('type');
    const faction = searchParams.get('faction');

    const skip = (page - 1) * limit;

    // Build where clause for card filtering
    const cardWhere: PrismaCardWhere = {};

    if (search) {
      cardWhere.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (rarity) {
      cardWhere.rarity = { is: { name: rarity } };
    }

    if (type) {
      cardWhere.type = { is: { name: type } };
    }

    if (faction) {
      cardWhere.faction = faction;
    }

    // Get user's collection
    const userCollection = await prisma.collection.findUnique({
      where: { userId: session.user.id },
    });

    // If no collection exists yet, return empty collection
    if (!userCollection) {
      return NextResponse.json({
        collection: {
          userId: session.user.id,
          cards: [],
          statistics: {
            totalCards: 0,
            uniqueCards: 0,
            completionPercentage: 0,
          },
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0,
          },
        },
      });
    }

    // Get collection cards with pagination
    const [collectionCards, total, totalCards] = await Promise.all([
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
      prisma.card.count(),
    ]);

    // Calculate collection statistics
    const userTotalCards = await prisma.collectionCard.aggregate({
      where: {
        collection: {
          userId: session.user.id,
        },
      },
      _sum: { quantity: true },
      _count: { id: true },
    });

    const statistics = {
      totalCards: userTotalCards._sum?.quantity || 0,
      uniqueCards: userTotalCards._count?.id || 0,
      completionPercentage:
        totalCards > 0
          ? Math.round(((userTotalCards._count?.id || 0) / totalCards) * 100)
          : 0,
    };

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
    let userCollection = await prisma.collection.findUnique({
      where: { userId: session.user.id },
    });

    if (!userCollection) {
      userCollection = await prisma.collection.create({
        data: { userId: session.user.id },
      });
    }

    // Check if card is already in collection
    const existingCollectionCard = await prisma.collectionCard.findUnique({
      where: {
        collectionId_cardId: {
          collectionId: userCollection.id,
          cardId,
        },
      },
    });

    let result;

    if (action === 'remove' || parsedQuantity === 0) {
      // Remove card from collection
      if (existingCollectionCard) {
        await prisma.collectionCard.delete({
          where: { id: existingCollectionCard.id },
        });
        result = { action: 'removed', cardName: card.name };
      } else {
        return NextResponse.json(
          { error: 'Card not in collection' },
          { status: 404 }
        );
      }
    } else if (existingCollectionCard) {
      // Update existing collection entry
      const newQuantity =
        action === 'set'
          ? parsedQuantity
          : existingCollectionCard.quantity + parsedQuantity;
      const finalQuantity = Math.max(0, newQuantity);

      if (finalQuantity === 0) {
        await prisma.collectionCard.delete({
          where: { id: existingCollectionCard.id },
        });
        result = { action: 'removed', cardName: card.name };
      } else {
        const updated = await prisma.collectionCard.update({
          where: { id: existingCollectionCard.id },
          data: {
            quantity: finalQuantity,
          },
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
              },
            },
          },
        });
        result = { action: 'updated', collection: updated };
      }
    } else {
      // Create new collection entry
      if (parsedQuantity > 0) {
        const newCollectionCard = await prisma.collectionCard.create({
          data: {
            collectionId: userCollection.id,
            cardId,
            quantity: parsedQuantity,
          },
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
              },
            },
          },
        });
        result = { action: 'added', collection: newCollectionCard };
      } else {
        return NextResponse.json(
          { error: 'Quantity must be greater than 0 to add cards' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      message: `Card ${result.action} successfully`,
      result,
    });
  } catch (error) {
    console.error('Update collection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
