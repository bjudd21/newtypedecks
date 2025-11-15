/**
 * Specialized Query Operations
 */

import { PrismaClient } from '@prisma/client';
import type { CardWithRelations, CardSearchFilters, CardSearchOptions } from '@/lib/types/card';
import { searchCards } from './search';

/**
 * Get cards by faction
 */
export async function getCardsByFaction(
  db: PrismaClient,
  faction: string,
  limit = 20,
  context?: {
    sessionId?: string;
    userId?: string;
    source?: 'manual' | 'suggestion' | 'filter' | 'sort';
    userAgent?: string;
    referer?: string;
  }
): Promise<CardWithRelations[]> {
  const result = await searchCards(
    db,
    { faction },
    { limit, includeRelations: true },
    context
  );
  return result.cards;
}

/**
 * Get cards by series
 */
export async function getCardsBySeries(
  db: PrismaClient,
  series: string,
  limit = 20,
  context?: {
    sessionId?: string;
    userId?: string;
    source?: 'manual' | 'suggestion' | 'filter' | 'sort';
    userAgent?: string;
    referer?: string;
  }
): Promise<CardWithRelations[]> {
  const result = await searchCards(
    db,
    { series },
    { limit, includeRelations: true },
    context
  );
  return result.cards;
}

/**
 * Get cards by type
 */
export async function getCardsByType(
  db: PrismaClient,
  typeId: string,
  limit = 20,
  context?: {
    sessionId?: string;
    userId?: string;
    source?: 'manual' | 'suggestion' | 'filter' | 'sort';
    userAgent?: string;
    referer?: string;
  }
): Promise<CardWithRelations[]> {
  const result = await searchCards(
    db,
    { typeId },
    { limit, includeRelations: true },
    context
  );
  return result.cards;
}

/**
 * Get cards by rarity
 */
export async function getCardsByRarity(
  db: PrismaClient,
  rarityId: string,
  limit = 20,
  context?: {
    sessionId?: string;
    userId?: string;
    source?: 'manual' | 'suggestion' | 'filter' | 'sort';
    userAgent?: string;
    referer?: string;
  }
): Promise<CardWithRelations[]> {
  const result = await searchCards(
    db,
    { rarityId },
    { limit, includeRelations: true },
    context
  );
  return result.cards;
}

/**
 * Get cards by set
 */
export async function getCardsBySet(
  db: PrismaClient,
  setId: string,
  limit = 100,
  context?: {
    sessionId?: string;
    userId?: string;
    source?: 'manual' | 'suggestion' | 'filter' | 'sort';
    userAgent?: string;
    referer?: string;
  }
): Promise<CardWithRelations[]> {
  const result = await searchCards(
    db,
    { setId },
    { limit, sortBy: 'setNumber', sortOrder: 'asc', includeRelations: true },
    context
  );
  return result.cards;
}
