/**
 * Public Decks API
 *
 * Handles browsing of public decks with social metrics.
 * Sort options: trending (default), updatedAt, createdAt, likeCount, viewCount
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';

const VALID_SORT_KEYS = [
  'updatedAt',
  'createdAt',
  'likeCount',
  'viewCount',
] as const;
type ValidSortKey = (typeof VALID_SORT_KEYS)[number];

function trendingScore(
  likeCount: number,
  viewCount: number,
  createdAt: Date
): number {
  const ageHours = Math.max((Date.now() - createdAt.getTime()) / 3_600_000, 1);
  return (likeCount * 10 + viewCount) / Math.pow(ageHours, 1.5);
}

export async function GET(request: NextRequest) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'trending';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as
      | 'asc'
      | 'desc';

    const skip = (page - 1) * limit;
    const isTrending = sortBy === 'trending';

    const where: Record<string, unknown> = {
      visibility: 'PUBLIC',
      gameId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const validKey = VALID_SORT_KEYS.includes(sortBy as ValidSortKey)
      ? (sortBy as ValidSortKey)
      : 'updatedAt';

    const dbOrderBy = isTrending
      ? ({ createdAt: 'desc' } as const)
      : ({ [validKey]: sortOrder } as Record<string, string>);

    // For trending, fetch a larger batch to rank across more results
    const fetchLimit = isTrending ? Math.min(200, limit * 15) : limit;
    const fetchSkip = isTrending ? 0 : skip;

    const [rawDecks, total] = await Promise.all([
      prisma.deck.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true },
          },
          cards: {
            include: {
              card: {
                include: { type: true, rarity: true },
              },
            },
          },
          _count: { select: { cards: true } },
        },
        orderBy: dbOrderBy,
        skip: fetchSkip,
        take: fetchLimit,
      }),
      prisma.deck.count({ where }),
    ]);

    // Apply trending sort and paginate in memory
    let decks = rawDecks;
    if (isTrending) {
      decks = [...rawDecks]
        .sort(
          (a, b) =>
            trendingScore(b.likeCount, b.viewCount, b.createdAt) -
            trendingScore(a.likeCount, a.viewCount, a.createdAt)
        )
        .slice(skip, skip + limit);
    }

    // Look up which decks the current user has liked
    const likedDeckIdSet = new Set<string>();
    if (session?.user?.id) {
      const deckIds = decks.map((d) => d.id);
      const liked = await prisma.deckLike.findMany({
        where: { userId: session.user.id, deckId: { in: deckIds } },
        select: { deckId: true },
      });
      liked.forEach((l) => likedDeckIdSet.add(l.deckId));
    }

    const publicDecks = decks.map((deck) => {
      const totalCards = deck.cards.reduce((sum, dc) => sum + dc.quantity, 0);
      const uniqueCards = deck.cards.length;
      const totalCost = deck.cards.reduce(
        (sum, dc) => sum + (dc.card.cost || 0) * dc.quantity,
        0
      );
      const colors = [
        ...new Set(deck.cards.map((dc) => dc.card.faction).filter(Boolean)),
      ];

      return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        createdAt: deck.createdAt,
        updatedAt: deck.updatedAt,
        viewCount: deck.viewCount,
        likeCount: deck.likeCount,
        isLikedByUser: likedDeckIdSet.has(deck.id),
        author: {
          name: deck.user?.name || 'Anonymous',
        },
        statistics: {
          totalCards,
          uniqueCards,
          totalCost,
          averageCost:
            totalCards > 0
              ? Math.round((totalCost / totalCards) * 100) / 100
              : 0,
          colors,
        },
        cardPreview: deck.cards.slice(0, 3).map((dc) => ({
          card: {
            id: dc.card.id,
            name: dc.card.name,
            imageUrl: dc.card.imageUrl,
            rarity: dc.card.rarity,
          },
          quantity: dc.quantity,
        })),
      };
    });

    return NextResponse.json({
      decks: publicDecks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get public decks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
