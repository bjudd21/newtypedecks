/**
 * User Favorite Decks API
 *
 * Handles user favorite decks management
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

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      userId: session.user.id
    };

    if (search) {
      where.deck = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    // Get user's favorite decks
    const [favorites, total] = await Promise.all([
      prisma.userFavoriteDeck.findMany({
        where,
        include: {
          deck: {
            include: {
              user: {
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
                select: {
                  favoritedBy: true,
                  templateUsage: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.userFavoriteDeck.count({ where })
    ]);

    // Calculate deck statistics
    const favoritesWithStats = favorites.map(favorite => ({
      id: favorite.id,
      favoritedAt: favorite.createdAt,
      deck: {
        id: favorite.deck.id,
        name: favorite.deck.name,
        description: favorite.deck.description,
        isPublic: favorite.deck.isPublic,
        isTemplate: favorite.deck.isTemplate,
        templateSource: favorite.deck.templateSource,
        creator: favorite.deck.user,
        cardCount: favorite.deck.cards.reduce((sum, dc) => sum + dc.quantity, 0),
        uniqueCards: favorite.deck.cards.length,
        totalCost: favorite.deck.cards.reduce((sum, dc) => sum + ((dc.card.cost || 0) * dc.quantity), 0),
        colors: [...new Set(favorite.deck.cards.map(dc => dc.card.set?.name).filter(Boolean))],
        favoriteCount: favorite.deck._count.favoritedBy,
        usageCount: favorite.deck._count.templateUsage,
        createdAt: favorite.deck.createdAt,
        updatedAt: favorite.deck.updatedAt,
      }
    }));

    return NextResponse.json({
      favorites: favoritesWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
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

    const { deckId } = await request.json();

    // Validate input
    if (!deckId) {
      return NextResponse.json(
        { error: 'Deck ID is required' },
        { status: 400 }
      );
    }

    // Check if deck exists and is public (or owned by user)
    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
      select: {
        id: true,
        name: true,
        isPublic: true,
        userId: true
      }
    });

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      );
    }

    // Check if deck is accessible (public or owned by user)
    if (!deck.isPublic && deck.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Cannot favorite private deck that you do not own' },
        { status: 403 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.userFavoriteDeck.findUnique({
      where: {
        userId_deckId: {
          userId: session.user.id,
          deckId: deckId
        }
      }
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Deck is already in your favorites' },
        { status: 400 }
      );
    }

    // Create favorite
    const favorite = await prisma.userFavoriteDeck.create({
      data: {
        userId: session.user.id,
        deckId: deckId
      },
      include: {
        deck: {
          select: {
            id: true,
            name: true,
            description: true,
            isPublic: true,
            isTemplate: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        message: 'Deck added to favorites successfully',
        favorite
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add favorite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}