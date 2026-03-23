/**
 * Deck Like/Unlike API
 *
 * POST /api/decks/[id]/like
 * Toggles the like for the authenticated user on a deck.
 * Returns { liked: boolean } — true if the deck is now liked.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  // Verify the deck exists before toggling like — prevents acting on phantom IDs
  const deck = await prisma.deck.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!deck) {
    return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
  }

  const existing = await prisma.deckLike.findUnique({
    where: { deckId_userId: { deckId: id, userId } },
  });

  if (existing) {
    // Unlike: remove record and decrement count
    await prisma.$transaction([
      prisma.deckLike.delete({
        where: { deckId_userId: { deckId: id, userId } },
      }),
      prisma.deck.update({
        where: { id },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
    return NextResponse.json({ liked: false });
  } else {
    // Like: create record and increment count
    await prisma.$transaction([
      prisma.deckLike.create({ data: { userId, deckId: id } }),
      prisma.deck.update({
        where: { id },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
    return NextResponse.json({ liked: true });
  }
}
