// Card Types API endpoint - Fetch all available card types
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';

// GET /api/reference/types?gameSlug=... - Get all card types for a game
export async function GET(request: NextRequest) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const types = await prisma.cardType.findMany({
      where: { gameId },
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(
      {
        types,
        total: types.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Types API GET error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch card types',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
