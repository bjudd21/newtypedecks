// Card Sets API endpoint - Fetch all available card sets
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/reference/sets - Get all card sets
export async function GET() {
  try {
    const sets = await prisma.set.findMany({
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

    return NextResponse.json({
      sets,
      total: sets.length,
    }, { status: 200 });

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