/**
 * Permission Helpers for Deck Operations
 */

import { prisma } from '@/lib/database';

export async function checkDeckAccess(
  deckId: string,
  userId?: string
): Promise<{ allowed: boolean; deck?: { userId: string; isPublic: boolean } }> {
  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    select: { userId: true, isPublic: true },
  });

  if (!deck) {
    return { allowed: false };
  }

  if (deck.isPublic || (userId && deck.userId === userId)) {
    return { allowed: true, deck };
  }

  return { allowed: false, deck };
}

export async function checkDeckOwnership(
  deckId: string,
  userId: string
): Promise<{ owned: boolean; deck?: { userId: string; name: string } }> {
  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    select: { userId: true, name: true },
  });

  if (!deck) {
    return { owned: false };
  }

  return { owned: deck.userId === userId, deck };
}
