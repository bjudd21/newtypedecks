/**
 * User Collections API
 *
 * Handles operations for user card collections
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

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
    const cardWhere: any = {};

    if (search) {
      cardWhere.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (rarity) {
      cardWhere.rarity = { name: rarity };
    }

    if (type) {
      cardWhere.type = { name: type };
    }

    if (faction) {
      cardWhere.faction = { name: faction };
    }

    // Get user's collection with pagination
    const [collectionCards, total, totalCards] = await Promise.all([
      prisma.collection.findMany({
        where: {
          userId: session.user.id,
          card: cardWhere
        },
        include: {
          card: {
            include: {
              type: true,
              rarity: true,
              faction: true,
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.collection.count({
        where: {
          userId: session.user.id,
          card: cardWhere
        }
      }),
      prisma.card.count()
    ]);

    // Calculate collection statistics
    const userTotalCards = await prisma.collection.aggregate({
      where: { userId: session.user.id },
      _sum: { quantity: true },
      _count: { id: true }
    });

    const statistics = {
      totalCards: userTotalCards._sum.quantity || 0,
      uniqueCards: userTotalCards._count || 0,
      completionPercentage: totalCards > 0 ? Math.round((userTotalCards._count / totalCards) * 100) : 0,
      totalValue: collectionCards.reduce((sum, cc) => sum + ((cc.card.marketPrice || 0) * cc.quantity), 0),
    };

    return NextResponse.json({
      collection: {
        userId: session.user.id,
        cards: collectionCards.map(cc => ({
          cardId: cc.cardId,
          card: cc.card,
          quantity: cc.quantity,
          condition: cc.condition || 'Near Mint',
          addedAt: cc.createdAt,
          updatedAt: cc.updatedAt,
        })),
        statistics,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
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

    const { cardId, quantity, condition = 'Near Mint', action = 'add' } = await request.json();

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
      select: { id: true, name: true }
    });

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    // Check if card is already in collection
    const existingCollection = await prisma.collection.findUnique({
      where: {
        userId_cardId: {
          userId: session.user.id,
          cardId
        }
      }
    });

    let result;

    if (action === 'remove' || parsedQuantity === 0) {
      // Remove card from collection
      if (existingCollection) {
        await prisma.collection.delete({
          where: { id: existingCollection.id }
        });
        result = { action: 'removed', cardName: card.name };
      } else {
        return NextResponse.json(
          { error: 'Card not in collection' },
          { status: 404 }
        );
      }
    } else if (existingCollection) {
      // Update existing collection entry
      const newQuantity = action === 'set' ? parsedQuantity : existingCollection.quantity + parsedQuantity;
      const finalQuantity = Math.max(0, newQuantity);

      if (finalQuantity === 0) {
        await prisma.collection.delete({
          where: { id: existingCollection.id }
        });
        result = { action: 'removed', cardName: card.name };
      } else {
        const updated = await prisma.collection.update({
          where: { id: existingCollection.id },
          data: {
            quantity: finalQuantity,
            condition,
          },
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                faction: true,
              }
            }
          }
        });
        result = { action: 'updated', collection: updated };
      }
    } else {
      // Create new collection entry
      if (parsedQuantity > 0) {
        const newCollection = await prisma.collection.create({
          data: {
            userId: session.user.id,
            cardId,
            quantity: parsedQuantity,
            condition,
          },
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                faction: true,
              }
            }
          }
        });
        result = { action: 'added', collection: newCollection };
      } else {
        return NextResponse.json(
          { error: 'Quantity must be greater than 0 to add cards' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      message: `Card ${result.action} successfully`,
      result
    });
  } catch (error) {
    console.error('Update collection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
