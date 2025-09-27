// Combined Reference Data API endpoint - Fetch all reference data for filters
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/reference - Get all reference data for card filters
export async function GET() {
  try {
    // Fetch all reference data in parallel
    const [types, rarities, sets] = await Promise.all([
      prisma.cardType.findMany({
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

    return NextResponse.json({
      types,
      rarities,
      sets,
      metadata: {
        totalTypes: types.length,
        totalRarities: rarities.length,
        totalSets: sets.length,
        fetchedAt: new Date().toISOString(),
      },
    }, { status: 200 });

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