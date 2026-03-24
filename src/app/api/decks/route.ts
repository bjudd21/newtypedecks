/**
 * User Decks API
 *
 * Handles CRUD operations for user decks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';
import { generateDeckCode } from '@/lib/utils/deckCode';

export async function GET(request: NextRequest) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const publicOnly = searchParams.get('public') === 'true';
    // allUsers=true: return PUBLIC decks from all users (no auth required)
    const allUsers = searchParams.get('allUsers') === 'true';

    // Own-deck queries require authentication; allUsers (public) do not
    if (!allUsers && !session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = { gameId };

    if (allUsers) {
      // Only public decks visible to everyone
      where.visibility = 'PUBLIC';
    } else {
      // Own decks — all visibility tiers
      where.userId = session!.user.id;
      if (publicOnly) {
        where.visibility = 'PUBLIC';
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
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
                },
              },
            },
          },
          _count: {
            select: { cards: true },
          },
          user: {
            select: { name: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.deck.count({ where }),
    ]);

    // Calculate deck statistics
    const decksWithStats = decks.map((deck) => ({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      visibility: deck.visibility,
      userName: deck.user?.name ?? null,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
      cardCount: deck.cards.reduce((sum, dc) => sum + dc.quantity, 0),
      uniqueCards: deck.cards.length,
      totalCost: deck.cards.reduce(
        (sum, dc) => sum + (dc.card.cost || 0) * dc.quantity,
        0
      ),
      colors: [
        ...new Set(
          deck.cards
            .map((dc) => {
              const attrs = dc.card.gameAttributes as Record<
                string,
                unknown
              > | null;
              return (attrs?.faction as string | undefined) ?? undefined;
            })
            .filter(Boolean)
        ),
      ],
    }));

    return NextResponse.json({
      decks: decksWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
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
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId, game } = gameResult;
    const maxCopiesPerCard = game.config.deckRules.maxCopiesPerCard ?? 4;

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { name, description, visibility, ruleset, cards, categories } =
      await request.json();

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

    // Validate cards exist and belong to the requested game
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
      where: { id: { in: cardIds as string[] }, gameId },
      select: { id: true },
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
        visibility: (['DRAFT', 'PRIVATE', 'PUBLIC'].includes(visibility)
          ? visibility
          : 'DRAFT') as 'DRAFT' | 'PRIVATE' | 'PUBLIC',
        ruleset: (['COMPETITIVE', 'CASUAL'].includes(ruleset)
          ? ruleset
          : 'COMPETITIVE') as 'COMPETITIVE' | 'CASUAL',
        isPublic: visibility === 'PUBLIC',
        deckCode: generateDeckCode(game.slug),
        userId: session.user.id,
        gameId,
        categories: Array.isArray(categories) ? categories : undefined,
        cards: {
          create: cards.map((card: unknown) => {
            const cardObj = card as Record<string, unknown>;
            return {
              cardId: (cardObj.cardId ||
                (cardObj.card as Record<string, unknown> | undefined)
                  ?.id) as string,
              quantity: Math.max(
                1,
                Math.min(
                  maxCopiesPerCard,
                  parseInt(String(cardObj.quantity || 1))
                )
              ),
              category: (cardObj.category as string) || 'main',
              userCategory:
                (cardObj.userCategory as string | undefined) ?? null,
            };
          }),
        },
      },
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

    return NextResponse.json(
      {
        message: 'Deck created successfully',
        deck,
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
