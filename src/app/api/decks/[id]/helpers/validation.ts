/**
 * Validation Helpers for Deck Updates
 */

import { prisma } from '@/lib/database';

export function validateDeckName(name?: string): string | null {
  if (!name) return null;
  if (name.length < 1 || name.length > 100) {
    return 'Deck name must be between 1 and 100 characters';
  }
  return null;
}

export async function validateDeckCards(cards: unknown[]): Promise<string | null> {
  if (cards.length === 0) {
    return 'Deck must contain at least one card';
  }

  const cardIds = cards
    .map((c: unknown) => {
      const cardObj = c as Record<string, unknown>;
      return (
        cardObj.cardId ||
        (cardObj.card as Record<string, unknown> | undefined)?.id
      );
    })
    .filter(Boolean);

  const existingCards = await prisma.card.findMany({
    where: { id: { in: cardIds as string[] } },
    select: { id: true },
  });

  if (existingCards.length !== new Set(cardIds).size) {
    return 'Some cards in the deck do not exist';
  }

  return null;
}
