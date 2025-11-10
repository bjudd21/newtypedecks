// Card Types API endpoint - Fetch all available card types
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/reference/types - Get all card types
export async function GET() {
  try {
    const types = await prisma.cardType.findMany({
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
