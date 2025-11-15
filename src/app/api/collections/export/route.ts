/**
 * Collection Export API
 *
 * Handles exporting user collections to various formats for backup and sharing
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';
import {
  generateExportData,
  buildCollectionWhereClause,
  type CollectionCardData,
} from './helpers';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const includeMetadata = searchParams.get('includeMetadata') === 'true';
    const includeConditions = searchParams.get('includeConditions') === 'true';
    const includeValues = searchParams.get('includeValues') === 'true';
    const filterBy = searchParams.get('filterBy'); // 'owned', 'complete', 'valuable'

    // Build where clause for collection cards based on filters
    const cardsWhereClause = buildCollectionWhereClause(filterBy);

    // Get collection with cards
    const userCollection = await prisma.collection.findUnique({
      where: { userId: session.user.id },
      include: {
        cards: {
          where: cardsWhereClause,
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                set: true,
              },
            },
          },
          orderBy: [
            { card: { set: { name: 'asc' } } },
            { card: { setNumber: 'asc' } },
            { card: { name: 'asc' } },
          ],
        },
      },
    });

    if (!userCollection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    const exportData = await generateExportData(
      userCollection.cards as unknown as CollectionCardData[],
      format,
      {
        includeMetadata,
        includeConditions,
        includeValues,
        userId: session.user.id,
      }
    );

    // Set appropriate headers for download
    const filename = `gundam-collection-${format}-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'json'}`;

    return new NextResponse(exportData.content, {
      status: 200,
      headers: {
        'Content-Type': exportData.contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Export collection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const {
      format = 'json',
      options = {},
      customFields = [],
      exportName,
    } = await request.json();

    // Get user's collection
    const userCollection = await prisma.collection.findUnique({
      where: { userId: session.user.id },
      include: {
        cards: {
          where: options.onlyOwned ? { quantity: { gt: 0 } } : {},
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                set: true,
              },
            },
          },
          orderBy: [
            { card: { set: { name: 'asc' } } },
            { card: { setNumber: 'asc' } },
            { card: { name: 'asc' } },
          ],
        },
      },
    });

    if (!userCollection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Generate export with custom options
    const exportData = await generateExportData(
      userCollection.cards as unknown as CollectionCardData[],
      format,
      {
        ...options,
        customFields,
        exportName,
        userId: session.user.id,
      }
    );

    return NextResponse.json({
      success: true,
      filename: exportData.filename,
      format,
      recordCount: userCollection.cards.length,
      size: exportData.content.length,
      downloadUrl: `/api/collections/export?format=${format}`, // Direct download URL
    });
  } catch (error) {
    console.error('Create export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
