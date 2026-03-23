// Card Rarities API endpoint - Fetch all available card rarities
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';

// GET /api/reference/rarities?gameSlug=... - Get all card rarities for a game
export async function GET(request: NextRequest) {
  try {
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const rarities = await prisma.rarity.findMany({
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
    });

    return NextResponse.json(
      {
        rarities,
        total: rarities.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Rarities API GET error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch card rarities',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
