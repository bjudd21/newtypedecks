/**
 * Shared helper for resolving gameSlug → gameId in API routes.
 *
 * Usage in a route handler:
 *   const gameResult = await resolveGameFromRequest(request);
 *   if (gameResult instanceof NextResponse) return gameResult;
 *   const { gameId } = gameResult;
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGameBySlug } from '@/lib/database/games';

/**
 * Extract and validate the gameSlug query parameter, then resolve it to a gameId.
 *
 * Returns { gameId, gameName } on success, or a NextResponse (400 or 404) on failure.
 */
export async function resolveGameFromRequest(
  request: NextRequest
): Promise<{ gameId: string; gameName: string } | NextResponse> {
  const gameSlug = request.nextUrl.searchParams.get('gameSlug');

  if (!gameSlug) {
    return NextResponse.json(
      { error: 'gameSlug query parameter is required' },
      { status: 400 }
    );
  }

  const game = await getGameBySlug(gameSlug);
  if (!game) {
    return NextResponse.json(
      { error: `Game '${gameSlug}' not found` },
      { status: 404 }
    );
  }

  return { gameId: game.id, gameName: game.name };
}
