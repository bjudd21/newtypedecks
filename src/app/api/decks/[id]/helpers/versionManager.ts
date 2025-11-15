/**
 * Deck Version Management
 */

import { prisma } from '@/lib/database';
import type { Prisma } from '@prisma/client';

export async function createDeckVersion(
  deckId: string,
  userId: string,
  tx: Prisma.TransactionClient
): Promise<number> {
  const currentDeck = await tx.deck.findUnique({
    where: { id: deckId },
    include: { cards: true },
  });

  if (!currentDeck || currentDeck.cards.length === 0) {
    return 0;
  }

  const lastVersion = await tx.deckVersion.findFirst({
    where: { deckId },
    orderBy: { version: 'desc' },
    select: { version: true },
  });

  const nextVersion = (lastVersion?.version || 0) + 1;

  await tx.deckVersion.create({
    data: {
      deckId,
      version: nextVersion,
      name: currentDeck.name,
      description: currentDeck.description,
      versionName: `Version ${nextVersion}`,
      changeNote: 'Automatic version created before deck update',
      isPublic: currentDeck.isPublic,
      createdBy: userId,
      cards: {
        create: currentDeck.cards.map((deckCard) => ({
          cardId: deckCard.cardId,
          quantity: deckCard.quantity,
          category: deckCard.category,
        })),
      },
    },
  });

  await tx.deck.update({
    where: { id: deckId },
    data: {
      currentVersion: nextVersion,
      updatedAt: new Date(),
    },
  });

  return nextVersion;
}

export async function updateDeckCards(
  deckId: string,
  cards: unknown[],
  tx: Prisma.TransactionClient
) {
  await tx.deckCard.deleteMany({
    where: { deckId },
  });

  await tx.deckCard.createMany({
    data: cards.map((card: unknown) => {
      const cardObj = card as Record<string, unknown>;
      return {
        deckId,
        cardId: (cardObj.cardId ||
          (cardObj.card as Record<string, unknown> | undefined)?.id) as string,
        quantity: Math.max(
          1,
          Math.min(4, parseInt(String(cardObj.quantity || 1)))
        ),
        category: (cardObj.category as string) || 'main',
      };
    }),
  });

  return await tx.deck.findUnique({
    where: { id: deckId },
    include: {
      cards: {
        include: {
          card: {
            include: {
              type: true,
              rarity: true,
            },
          },
        },
      },
    },
  });
}
