/**
 * Deck Templates API
 *
 * Handles CRUD operations for deck templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const source = searchParams.get('source'); // "Official", "Community", etc.

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isTemplate: true,
      isPublic: true // Only show public templates
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (source) {
      where.templateSource = source;
    }

    // Get templates with usage statistics
    const [templates, total] = await Promise.all([
      prisma.deck.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          cards: {
            include: {
              card: {
                include: {
                  type: true,
                  rarity: true,
                  set: true
                }
              }
            }
          },
          templateUsage: {
            select: {
              id: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              templateUsage: true,
              favoritedBy: true
            }
          }
        },
        orderBy: [
          { templateUsage: { _count: 'desc' } }, // Most used first
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      prisma.deck.count({ where })
    ]);

    // Calculate template statistics
    const templatesWithStats = templates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      templateSource: template.templateSource,
      creator: template.user,
      cardCount: template.cards.reduce((sum, dc) => sum + dc.quantity, 0),
      uniqueCards: template.cards.length,
      totalCost: template.cards.reduce((sum, dc) => sum + ((dc.card.cost || 0) * dc.quantity), 0),
      colors: [...new Set(template.cards.map(dc => dc.card.set?.name).filter(Boolean))],
      usageCount: template._count.templateUsage,
      favoriteCount: template._count.favoritedBy,
      lastUsed: template.templateUsage[0]?.createdAt || null,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      // Don't include full card list in browse view for performance
      cards: undefined
    }));

    return NextResponse.json({
      templates: templatesWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get templates error:', error);
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

    const { deckId, templateName, templateDescription, templateSource } = await request.json();

    // Validate input
    if (!deckId) {
      return NextResponse.json(
        { error: 'Deck ID is required' },
        { status: 400 }
      );
    }

    // Check if deck exists and user owns it
    const deck = await prisma.deck.findUnique({
      where: {
        id: deckId,
        userId: session.user.id
      },
      include: {
        cards: {
          include: {
            card: true
          }
        }
      }
    });

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found or access denied' },
        { status: 404 }
      );
    }

    if (deck.cards.length === 0) {
      return NextResponse.json(
        { error: 'Cannot create template from empty deck' },
        { status: 400 }
      );
    }

    // Create template deck
    const template = await prisma.deck.create({
      data: {
        name: templateName?.trim() || `${deck.name} (Template)`,
        description: templateDescription?.trim() || `Template based on ${deck.name}`,
        isPublic: true,
        isTemplate: true,
        templateSource: templateSource?.trim() || 'Community',
        userId: session.user.id,
        cards: {
          create: deck.cards.map(deckCard => ({
            cardId: deckCard.cardId,
            quantity: deckCard.quantity,
            category: deckCard.category
          }))
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        cards: {
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                set: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(
      {
        message: 'Template created successfully',
        template
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}