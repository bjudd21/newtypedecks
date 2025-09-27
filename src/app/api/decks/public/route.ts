/**
 * Public Decks API
 *
 * Handles browsing of public decks
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const format = searchParams.get('format');
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause for public decks only
    const where: any = {
      isPublic: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (format) {
      where.format = format;
    }

    // Get public decks
    const [decks, total] = await Promise.all([
      prisma.deck.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          deckCards: {
            include: {
              card: {
                include: {
                  type: true,
                  rarity: true,
                  faction: true,
                }
              }
            }
          },
          _count: {
            select: { deckCards: true }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.deck.count({ where })
    ]);

    // Calculate deck statistics and remove sensitive data
    const publicDecks = decks.map(deck => {
      const totalCards = deck.deckCards.reduce((sum, dc) => sum + dc.quantity, 0);
      const uniqueCards = deck.deckCards.length;
      const totalCost = deck.deckCards.reduce((sum, dc) => sum + ((dc.card.cost || 0) * dc.quantity), 0);
      const colors = [...new Set(deck.deckCards.map(dc => dc.card.faction?.name).filter(Boolean))];

      return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        format: deck.format,
        createdAt: deck.createdAt,
        updatedAt: deck.updatedAt,
        author: {
          name: deck.user.name || 'Anonymous',
          // Don't expose email addresses publicly
        },
        statistics: {
          totalCards,
          uniqueCards,
          totalCost,
          averageCost: totalCards > 0 ? Math.round((totalCost / totalCards) * 100) / 100 : 0,
          colors,
        },
        // Don't expose full card list in browse view for performance
        cardPreview: deck.deckCards.slice(0, 3).map(dc => ({
          card: {
            id: dc.card.id,
            name: dc.card.name,
            imageUrl: dc.card.imageUrl,
            rarity: dc.card.rarity,
          },
          quantity: dc.quantity,
        }))
      };
    });

    return NextResponse.json({
      decks: publicDecks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get public decks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}