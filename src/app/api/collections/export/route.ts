/**
 * Collection Export API
 *
 * Handles exporting user collections to various formats for backup and sharing
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

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

    // Get user's collection
    const whereClause: any = { userId: session.user.id };

    // Apply filters if specified
    if (filterBy) {
      switch (filterBy) {
        case 'owned':
          whereClause.quantity = { gt: 0 };
          break;
        case 'complete':
          // Could filter by complete sets, but for now just owned cards
          whereClause.quantity = { gt: 0 };
          break;
        case 'valuable':
          // Could filter by card value, but for now include all
          break;
      }
    }

    // Get collection with cards
    const userCollection = await prisma.collection.findUnique({
      where: { userId: session.user.id },
      include: {
        cards: {
          where: filterBy === 'owned' ? { quantity: { gt: 0 } } : {},
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                set: true,
              }
            }
          },
          orderBy: [
            { card: { set: { name: 'asc' } } },
            { card: { setNumber: 'asc' } },
            { card: { name: 'asc' } }
          ]
        }
      }
    });

    if (!userCollection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    const exportData = await generateExportData(
      userCollection.cards,
      format,
      {
        includeMetadata,
        includeConditions,
        includeValues,
        userId: session.user.id
      }
    );

    // Set appropriate headers for download
    const filename = `gundam-collection-${format}-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'json'}`;

    return new NextResponse(exportData.content, {
      status: 200,
      headers: {
        'Content-Type': exportData.contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
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
      exportName
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
              }
            }
          },
          orderBy: [
            { card: { set: { name: 'asc' } } },
            { card: { setNumber: 'asc' } },
            { card: { name: 'asc' } }
          ]
        }
      }
    });

    if (!userCollection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Generate export with custom options
    const exportData = await generateExportData(
      userCollection.cards,
      format,
      {
        ...options,
        customFields,
        exportName,
        userId: session.user.id
      }
    );

    return NextResponse.json({
      success: true,
      filename: exportData.filename,
      format,
      recordCount: userCollection.cards.length,
      size: exportData.content.length,
      downloadUrl: `/api/collections/export?format=${format}` // Direct download URL
    });
  } catch (error) {
    console.error('Create export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate export data in various formats
async function generateExportData(
  collectionCards: any[],
  format: string,
  options: any = {}
) {
  const timestamp = new Date().toISOString();

  switch (format.toLowerCase()) {
    case 'csv':
      return generateCSVExport(collectionCards, options);
    case 'json':
      return generateJSONExport(collectionCards, options, timestamp);
    case 'xlsx':
      return generateExcelExport(collectionCards, options);
    case 'txt':
      return generateTextExport(collectionCards, options);
    case 'decklist':
      return generateDeckListExport(collectionCards, options);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// Generate CSV export
function generateCSVExport(collectionCards: any[], options: any) {
  const headers = ['Card Name', 'Quantity', 'Set Name', 'Set Number', 'Type', 'Rarity'];

  if (options.includeConditions) {
    headers.push('Condition');
  }
  if (options.includeValues) {
    headers.push('Market Price', 'Total Value');
  }
  if (options.includeMetadata) {
    headers.push('Added Date', 'Last Updated');
  }

  const rows = [headers.join(',')];

  collectionCards.forEach(collectionCard => {
    const card = collectionCard.card;
    const row = [
      `"${card.name}"`,
      collectionCard.quantity,
      `"${card.set?.name || ''}"`,
      `"${card.setNumber || ''}"`,
      `"${card.type?.name || ''}"`,
      `"${card.rarity?.name || ''}"`,
    ];

    if (options.includeConditions) {
      row.push(`"${collectionCard.condition || 'Near Mint'}"`);
    }
    if (options.includeValues) {
      const marketPrice = card.marketPrice || 0;
      const totalValue = marketPrice * collectionCard.quantity;
      row.push(marketPrice.toString(), totalValue.toString());
    }
    if (options.includeMetadata) {
      row.push(
        `"${collectionCard.createdAt}"`,
        `"${collectionCard.updatedAt}"`
      );
    }

    rows.push(row.join(','));
  });

  return {
    content: rows.join('\n'),
    contentType: 'text/csv',
    filename: `gundam-collection-${new Date().toISOString().split('T')[0]}.csv`
  };
}

// Generate JSON export
function generateJSONExport(collectionCards: any[], options: any, timestamp: string) {
  const exportData: any = {
    exportInfo: {
      format: 'gundam-card-game-collection',
      version: '1.0',
      exportedAt: timestamp,
      exportedBy: options.userId,
      recordCount: collectionCards.length,
      exportOptions: options
    },
    collection: collectionCards.map(collectionCard => {
      const card = collectionCard.card;
      const exportCard: any = {
        cardId: card.id,
        cardName: card.name,
        quantity: collectionCard.quantity,
        set: {
          name: card.set?.name,
          code: card.set?.code,
          number: card.setNumber
        },
        cardInfo: {
          type: card.type?.name,
          rarity: card.rarity?.name,
          cost: card.cost,
          description: card.description
        }
      };

      if (options.includeConditions) {
        exportCard.condition = collectionCard.condition || 'Near Mint';
      }

      if (options.includeValues) {
        exportCard.marketPrice = card.marketPrice || 0;
        exportCard.totalValue = (card.marketPrice || 0) * collectionCard.quantity;
      }

      if (options.includeMetadata) {
        exportCard.metadata = {
          addedDate: collectionCard.createdAt,
          lastUpdated: collectionCard.updatedAt
        };
      }

      // Include custom fields if specified
      if (options.customFields && options.customFields.length > 0) {
        exportCard.customData = {};
        options.customFields.forEach((field: string) => {
          if (card[field] !== undefined) {
            exportCard.customData[field] = card[field];
          }
        });
      }

      return exportCard;
    })
  };

  return {
    content: JSON.stringify(exportData, null, 2),
    contentType: 'application/json',
    filename: `gundam-collection-${new Date().toISOString().split('T')[0]}.json`
  };
}

// Generate simple text list export
function generateTextExport(collectionCards: any[], options: any) {
  const lines: string[] = [];

  if (options.includeMetadata) {
    lines.push('# Gundam Card Game Collection Export');
    lines.push(`# Exported on: ${new Date().toISOString()}`);
    lines.push(`# Total Cards: ${collectionCards.reduce((sum, cc) => sum + cc.quantity, 0)}`);
    lines.push(`# Unique Cards: ${collectionCards.length}`);
    lines.push('');
  }

  collectionCards.forEach(collectionCard => {
    const card = collectionCard.card;
    let line = `${collectionCard.quantity}x ${card.name}`;

    if (card.set?.name) {
      line += ` (${card.set.name}${card.setNumber ? ' #' + card.setNumber : ''})`;
    }

    if (options.includeConditions && collectionCard.condition) {
      line += ` [${collectionCard.condition}]`;
    }

    lines.push(line);
  });

  return {
    content: lines.join('\n'),
    contentType: 'text/plain',
    filename: `gundam-collection-${new Date().toISOString().split('T')[0]}.txt`
  };
}

// Generate deck list format export
function generateDeckListExport(collectionCards: any[], options: any) {
  const lines: string[] = [];

  lines.push('// Gundam Card Game Collection');
  lines.push(`// Exported: ${new Date().toLocaleDateString()}`);
  lines.push('// Format: Quantity Card Name');
  lines.push('');

  collectionCards.forEach(collectionCard => {
    const card = collectionCard.card;
    lines.push(`${collectionCard.quantity} ${card.name}`);
  });

  return {
    content: lines.join('\n'),
    contentType: 'text/plain',
    filename: `gundam-collection-decklist-${new Date().toISOString().split('T')[0]}.txt`
  };
}

// Generate Excel export (would require additional library)
function generateExcelExport(collectionCards: any[], options: any) {
  // For now, return CSV format with Excel-friendly headers
  // In a full implementation, you'd use a library like 'xlsx' or 'exceljs'
  return generateCSVExport(collectionCards, options);
}