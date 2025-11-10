// Card Rarities API endpoint - Fetch all available card rarities
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/reference/rarities - Get all card rarities
export async function GET() {
  try {
    const rarities = await prisma.rarity.findMany({
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
