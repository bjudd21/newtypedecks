/**
 * User Decks API
 *
 * Handles CRUD operations for user decks
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isPublic = searchParams.get('public') === 'true';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get decks with card count
    const [decks, total] = await Promise.all([
      prisma.deck.findMany({
        where,
        include: {
          cards: {
            include: {
              card: {
                include: {
                  type: true,
                  rarity: true,
                }
              }
            }
          },
          _count: {
            select: { cards: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.deck.count({ where })
    ]);

    // Calculate deck statistics
    const decksWithStats = decks.map(deck => ({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      isPublic: deck.isPublic,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
      cardCount: deck.cards.reduce((sum, dc) => sum + dc.quantity, 0),
      uniqueCards: deck.cards.length,
      totalCost: deck.cards.reduce((sum, dc) => sum + ((dc.card.cost || 0) * dc.quantity), 0),
      colors: [...new Set(deck.cards.map(dc => dc.card.faction).filter(Boolean))],
    }));

    return NextResponse.json({
      decks: decksWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get decks error:', error);
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

    const { name, description, isPublic, cards } = await request.json();

    // Validate input
    if (!name || !cards || !Array.isArray(cards)) {
      return NextResponse.json(
        { error: 'Name and cards are required' },
        { status: 400 }
      );
    }

    if (name.length < 1 || name.length > 100) {
      return NextResponse.json(
        { error: 'Deck name must be between 1 and 100 characters' },
        { status: 400 }
      );
    }

    if (cards.length === 0) {
      return NextResponse.json(
        { error: 'Deck must contain at least one card' },
        { status: 400 }
      );
    }

    // Validate cards exist
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

    // Create deck with cards
    const deck = await prisma.deck.create({
      data: {
        name,
        description: description || '',
        isPublic: Boolean(isPublic),
        userId: session.user.id,
        cards: {
          create: cards.map((card: any) => ({
            cardId: card.cardId || card.card?.id,
            quantity: Math.max(1, Math.min(4, parseInt(card.quantity) || 1)),
            category: card.category || 'main'
          }))
        }
      },
      include: {
        cards: {
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json(
      {
        message: 'Deck created successfully',
        deck
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create deck error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
