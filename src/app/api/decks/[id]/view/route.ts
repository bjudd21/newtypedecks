/**
 * Deck View Count API
 *
 * POST /api/decks/[id]/view
 * Increments the view count for a deck. Caller is responsible for
 * session-based deduplication (sessionStorage on the client).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    await prisma.deck.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
}
