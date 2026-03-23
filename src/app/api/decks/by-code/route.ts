/**
 * Deck by Code API
 *
 * GET /api/decks/by-code?code=NTDK-GN-xxxxxxxx
 *
 * Returns deck name + card list for importing into the deck builder.
 * Draft decks are only accessible to their owner.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.trim();

  if (!code) {
    return NextResponse.json(
      { error: 'Deck code is required' },
      { status: 400 }
    );
  }

  const deck = await prisma.deck.findUnique({
    where: { deckCode: code },
    include: {
      cards: {
        include: {
          card: {
            include: {
              type: true,
              rarity: true,
              set: true,
            },
          },
        },
      },
    },
  });

  if (!deck) {
    return NextResponse.json({ error: 'Invalid deck code' }, { status: 404 });
  }

  // Draft decks are only accessible to their owner
  if (deck.visibility === 'DRAFT') {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.id !== deck.userId) {
      return NextResponse.json({ error: 'Invalid deck code' }, { status: 404 });
    }
  }

  return NextResponse.json({
    name: deck.name,
    deckCode: deck.deckCode,
    cards: deck.cards.map((dc) => ({
      cardId: dc.cardId,
      card: dc.card,
      quantity: dc.quantity,
      category: dc.category ?? 'main',
    })),
  });
}
