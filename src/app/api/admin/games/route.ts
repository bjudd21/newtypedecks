/**
 * Admin Games API
 *
 * GET  /api/admin/games — list all games with card/deck counts
 * POST /api/admin/games — create a new game record
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/adminAuth';
import { prisma } from '@/lib/database';

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const games = await prisma.game.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { cards: true, decks: true } },
      },
    });

    return NextResponse.json({
      success: true,
      games: games.map((g) => ({
        id: g.id,
        slug: g.slug,
        name: g.name,
        shortName: g.shortName,
        publisher: g.publisher,
        isActive: g.isActive,
        sortOrder: g.sortOrder,
        config: g.config,
        cardCount: g._count.cards,
        deckCount: g._count.decks,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Admin games GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { slug, name, shortName, publisher, isActive, sortOrder, config } =
      body;

    if (!slug || !name || !config) {
      return NextResponse.json(
        { success: false, error: 'slug, name, and config are required' },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        {
          success: false,
          error: 'slug must be lowercase letters, numbers, and hyphens only',
        },
        { status: 400 }
      );
    }

    const game = await prisma.game.create({
      data: {
        slug,
        name,
        shortName: shortName || null,
        publisher: publisher || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
        config,
      },
    });

    return NextResponse.json({ success: true, game }, { status: 201 });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : 'Failed to create game';
    // Unique constraint violation
    if (msg.includes('Unique constraint')) {
      return NextResponse.json(
        { success: false, error: 'A game with that slug already exists' },
        { status: 409 }
      );
    }
    console.error('Admin games POST error:', error);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
