/**
 * Game database utilities
 *
 * Provides helpers for resolving game slugs to IDs and fetching game records.
 * Used by API routes to scope all queries to a specific TCG.
 */

import { prisma } from './index';
import type { GameWithConfig } from '@/lib/types/game';

/** Resolve a game slug to its database ID. Returns null if not found. */
export async function resolveGameId(slug: string): Promise<string | null> {
  const game = await prisma.game.findUnique({
    where: { slug },
    select: { id: true },
  });
  return game?.id ?? null;
}

/** Fetch a full game record by slug. Returns null if not found. */
export async function getGameBySlug(
  slug: string
): Promise<GameWithConfig | null> {
  const game = await prisma.game.findUnique({ where: { slug } });
  return game as unknown as GameWithConfig | null;
}

/** Fetch all active games ordered by sortOrder. */
export async function getAllActiveGames(): Promise<GameWithConfig[]> {
  const games = await prisma.game.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  return games as unknown as GameWithConfig[];
}
