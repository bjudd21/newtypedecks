// Card Sets API endpoint - Fetch all available card sets
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';

// GET /api/reference/sets?gameSlug=... - Get all card sets for a game
export async function GET(request: NextRequest) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const sets = await prisma.set.findMany({
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
    });

    return NextResponse.json(
      {
        sets,
        total: sets.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sets API GET error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch card sets',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
