/**
 * Query Operations for Cards
 */

import { PrismaClient } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';
import { getCardInclude } from '../utils';

/**
 * Get a single card by ID
 */
export async function getCardById(
  db: PrismaClient,
  id: string,
  includeRelations = true
): Promise<CardWithRelations | null> {
  const include = getCardInclude(includeRelations);

  return db.card.findUnique({
    where: { id },
    include,
  }) as Promise<CardWithRelations | null>;
}

/**
 * Get a single card by set and number
 */
export async function getCardBySetAndNumber(
  db: PrismaClient,
  setId: string,
  setNumber: string,
  includeRelations = true
): Promise<CardWithRelations | null> {
  const include = getCardInclude(includeRelations);

  return db.card.findUnique({
    where: {
      setId_setNumber: {
        setId,
        setNumber,
      },
    },
    include,
  }) as Promise<CardWithRelations | null>;
}

/**
 * Get cards by IDs
 */
export async function getCardsByIds(
  db: PrismaClient,
  ids: string[],
  includeRelations = true
): Promise<CardWithRelations[]> {
  const include = getCardInclude(includeRelations);

  return db.card.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include,
  }) as Promise<CardWithRelations[]>;
}

/**
 * Get random cards
 */
export async function getRandomCards(
  db: PrismaClient,
  count = 10,
  includeRelations = true
): Promise<CardWithRelations[]> {
  const include = getCardInclude(includeRelations);

  // Get total count first
  const total = await db.card.count();
  if (total === 0) return [];

  // Generate random skip values
  const randomCards: CardWithRelations[] = [];
  const usedSkips = new Set<number>();

  while (randomCards.length < count && usedSkips.size < total) {
    const skip = Math.floor(Math.random() * total);
    if (usedSkips.has(skip)) continue;

    usedSkips.add(skip);

    const card = (await db.card.findFirst({
      skip,
      take: 1,
      include,
    })) as CardWithRelations | null;

    if (card) {
      randomCards.push(card);
    }
  }

  return randomCards;
}

/**
 * Search cards by text (name, description, official text)
 */
export async function searchCardsByText(
  db: PrismaClient,
  query: string,
  limit = 20
): Promise<CardWithRelations[]> {
  return db.card.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { officialText: { contains: query, mode: 'insensitive' } },
        { pilot: { contains: query, mode: 'insensitive' } },
        { model: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      type: true,
      rarity: true,
      set: true,
      rulings: true,
    },
    take: limit,
    orderBy: {
      name: 'asc',
    },
  }) as Promise<CardWithRelations[]>;
}

/**
 * Get card statistics
 */
export async function getCardStatistics(db: PrismaClient) {
  const { CardUtils } = await import('@/lib/models/card');

  // Get all cards for statistics
  const cards = (await db.card.findMany({
    include: {
      type: true,
      rarity: true,
      set: true,
    },
  })) as CardWithRelations[];

  return CardUtils.calculateStats(cards);
}
