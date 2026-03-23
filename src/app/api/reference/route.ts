// Combined Reference Data API endpoint - Fetch all reference data for filters
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';

// GET /api/reference?gameSlug=... - Get all reference data for card filters
export async function GET(request: NextRequest) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    // Fetch all reference data in parallel, scoped to this game
    const [types, rarities, sets] = await Promise.all([
      prisma.cardType.findMany({
        where: { gameId },
        select: {
          id: true,
          name: true,
          description: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.rarity.findMany({
        where: { gameId },
        select: {
          id: true,
          name: true,
          color: true,
          description: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.set.findMany({
        where: { gameId },
        select: {
          id: true,
          name: true,
          code: true,
          releaseDate: true,
          description: true,
          imageUrl: true,
        },
        orderBy: {
          releaseDate: 'desc', // Show newest sets first
        },
      }),
    ]);

    return NextResponse.json(
      {
        types,
        rarities,
        sets,
        metadata: {
          totalTypes: types.length,
          totalRarities: rarities.length,
          totalSets: sets.length,
          fetchedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reference API GET error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch reference data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
