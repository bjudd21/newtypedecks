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
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause for public decks only
    const where: Record<string, unknown> = {
      isPublic: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
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
          cards: {
            include: {
              card: {
                include: {
                  type: true,
                  rarity: true,
                }
              }
            }
          },
          _count: {
            select: { cards: true }
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
      const totalCards = deck.cards.reduce((sum, dc) => sum + dc.quantity, 0);
      const uniqueCards = deck.cards.length;
      const totalCost = deck.cards.reduce((sum, dc) => sum + ((dc.card.cost || 0) * dc.quantity), 0);
      const colors = [...new Set(deck.cards.map(dc => dc.card.faction).filter(Boolean))];

      return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
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
        cardPreview: deck.cards.slice(0, 3).map(dc => ({
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