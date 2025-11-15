/**
 * Collection Bulk Import API
 *
 * Handles bulk import of cards to user collections from various formats
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';
import {
  parseImportData,
  processImportCards,
  type ImportResult,
} from './helpers';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { format, data, options = {} } = await request.json();

    // Validate input
    if (!format || !data) {
      return NextResponse.json(
        { error: 'Format and data are required' },
        { status: 400 }
      );
    }

    // Parse data based on format
    let importCards;
    try {
      importCards = await parseImportData(format, data);
    } catch (error) {
      return NextResponse.json(
        {
          error: `Failed to parse ${format} data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
        { status: 400 }
      );
    }

    if (importCards.length === 0) {
      return NextResponse.json(
        { error: 'No valid cards found in import data' },
        { status: 400 }
      );
    }

    if (importCards.length > 1000) {
      return NextResponse.json(
        { error: 'Import limited to 1000 cards at once' },
        { status: 400 }
      );
    }

    // Get or create user collection
    let userCollection = await prisma.collection.findUnique({
      where: { userId: session.user.id },
    });

    if (!userCollection) {
      userCollection = await prisma.collection.create({
        data: { userId: session.user.id },
      });
    }

    // Process import cards
    const result: ImportResult = await processImportCards(
      importCards,
      userCollection.id,
      options
    );

    return NextResponse.json({
      message: 'Import completed',
      result,
      summary: {
        totalProcessed: importCards.length,
        successful: result.success,
        failed: result.failed,
        skipped: result.skipped,
      },
    });
  } catch (error) {
    console.error('Collection import error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
