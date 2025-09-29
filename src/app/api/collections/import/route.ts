/**
 * Collection Bulk Import API
 *
 * Handles bulk import of cards to user collections from various formats
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

interface ImportCard {
  cardId?: string;
  cardName?: string;
  setNumber?: string;
  setName?: string;
  quantity: number;
}

interface ImportResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
  imported: Array<{
    cardName: string;
    quantity: number;
    action: 'added' | 'updated';
  }>;
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

    const { format, data, options = {} } = await request.json();

    // Validate input
    if (!format || !data) {
      return NextResponse.json(
        { error: 'Format and data are required' },
        { status: 400 }
      );
    }

    let importCards: ImportCard[] = [];
    const result: ImportResult = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
      imported: []
    };

    // Parse data based on format
    try {
      switch (format.toLowerCase()) {
        case 'csv':
          importCards = await parseCSVData(data);
          break;
        case 'json':
          importCards = parseJSONData(data);
          break;
        case 'decklist':
          importCards = parseDeckListData(data);
          break;
        case 'mtga':
          importCards = parseMTGAData(data);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to parse ${format} data: ${error instanceof Error ? error.message : 'Unknown error'}` },
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
      where: { userId: session.user.id }
    });

    if (!userCollection) {
      userCollection = await prisma.collection.create({
        data: { userId: session.user.id }
      });
    }

    // Process each import card
    for (const importCard of importCards) {
      try {
        const card = await findCard(importCard);

        if (!card) {
          result.failed++;
          result.errors.push(`Card not found: ${importCard.cardName || importCard.cardId || 'unknown'}`);
          continue;
        }

        if (importCard.quantity <= 0) {
          result.skipped++;
          continue;
        }

        // Check if card already exists in collection
        const existingCollectionCard = await prisma.collectionCard.findUnique({
          where: {
            collectionId_cardId: {
              collectionId: userCollection.id,
              cardId: card.id
            }
          }
        });

        const updateBehavior = options.updateBehavior || 'add'; // 'add', 'replace', 'skip'

        if (existingCollectionCard) {
          if (updateBehavior === 'skip') {
            result.skipped++;
            continue;
          }

          const newQuantity = updateBehavior === 'replace'
            ? importCard.quantity
            : existingCollectionCard.quantity + importCard.quantity;

          await prisma.collectionCard.update({
            where: { id: existingCollectionCard.id },
            data: { quantity: Math.max(0, newQuantity) }
          });

          result.success++;
          result.imported.push({
            cardName: card.name,
            quantity: newQuantity,
            action: 'updated'
          });
        } else {
          // Create new collection card
          await prisma.collectionCard.create({
            data: {
              collectionId: userCollection.id,
              cardId: card.id,
              quantity: importCard.quantity
            }
          });

          result.success++;
          result.imported.push({
            cardName: card.name,
            quantity: importCard.quantity,
            action: 'added'
          });
        }
      } catch (error) {
        result.failed++;
        result.errors.push(`Failed to process card: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      message: 'Import completed',
      result,
      summary: {
        totalProcessed: importCards.length,
        successful: result.success,
        failed: result.failed,
        skipped: result.skipped
      }
    });
  } catch (error) {
    console.error('Collection import error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to find a card by various identifiers
async function findCard(importCard: ImportCard) {
  // Try by card ID first if provided
  if (importCard.cardId) {
    return await prisma.card.findUnique({
      where: { id: importCard.cardId },
      select: { id: true, name: true }
    });
  }

  // Try by set number and set name
  if (importCard.setNumber && importCard.setName) {
    const set = await prisma.set.findFirst({
      where: {
        OR: [
          { name: { equals: importCard.setName, mode: 'insensitive' } },
          { code: { equals: importCard.setName, mode: 'insensitive' } }
        ]
      }
    });

    if (set) {
      return await prisma.card.findUnique({
        where: {
          setId_setNumber: {
            setId: set.id,
            setNumber: importCard.setNumber
          }
        },
        select: { id: true, name: true }
      });
    }
  }

  // Try by exact card name match
  if (importCard.cardName) {
    return await prisma.card.findFirst({
      where: { name: { equals: importCard.cardName, mode: 'insensitive' } },
      select: { id: true, name: true }
    });
  }

  return null;
}

// Parse CSV data (Name, Quantity, Set, Set Number format)
async function parseCSVData(csvData: string): Promise<ImportCard[]> {
  const lines = csvData.trim().split('\n');
  const importCards: ImportCard[] = [];

  // Skip header if it exists
  let startIndex = 0;
  if (lines[0] && (lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('card'))) {
    startIndex = 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Support both comma and tab separation
    const parts = line.includes('\t') ? line.split('\t') : line.split(',');

    if (parts.length < 2) continue;

    const cardName = parts[0]?.trim().replace(/^["']|["']$/g, ''); // Remove quotes
    const quantity = parseInt(parts[1]?.trim()) || 0;
    const setName = parts[2]?.trim().replace(/^["']|["']$/g, '');
    const setNumber = parts[3]?.trim().replace(/^["']|["']$/g, '');

    if (cardName && quantity > 0) {
      importCards.push({
        cardName,
        quantity,
        setName: setName || undefined,
        setNumber: setNumber || undefined
      });
    }
  }

  return importCards;
}

// Parse JSON data
function parseJSONData(jsonData: any): ImportCard[] {
  if (!Array.isArray(jsonData)) {
    throw new Error('JSON data must be an array of card objects');
  }

  return jsonData.map((item: any) => ({
    cardId: item.cardId || item.id,
    cardName: item.cardName || item.name,
    quantity: parseInt(item.quantity) || parseInt(item.count) || 1,
    setName: item.setName || item.set,
    setNumber: item.setNumber || item.number
  })).filter(card => card.quantity > 0);
}

// Parse deck list format (quantity cardname)
function parseDeckListData(deckListData: string): ImportCard[] {
  const lines = deckListData.trim().split('\n');
  const importCards: ImportCard[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('#')) continue;

    // Match patterns like "3 Lightning Bolt" or "1x Storm Crow"
    const match = trimmedLine.match(/^(\d+)x?\s+(.+)$/);
    if (match) {
      const quantity = parseInt(match[1]);
      const cardName = match[2].trim();

      if (cardName && quantity > 0) {
        importCards.push({ cardName, quantity });
      }
    }
  }

  return importCards;
}

// Parse MTG Arena format
function parseMTGAData(mtgaData: string): ImportCard[] {
  const lines = mtgaData.trim().split('\n');
  const importCards: ImportCard[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // MTG Arena format: "3 Lightning Bolt (M21) 168"
    const match = trimmedLine.match(/^(\d+)\s+([^(]+)(?:\(([^)]+)\)\s*(\w+)?)?/);
    if (match) {
      const quantity = parseInt(match[1]);
      const cardName = match[2].trim();
      const setCode = match[3]?.trim();
      const setNumber = match[4]?.trim();

      if (cardName && quantity > 0) {
        importCards.push({
          cardName,
          quantity,
          setName: setCode,
          setNumber: setNumber
        });
      }
    }
  }

  return importCards;
}