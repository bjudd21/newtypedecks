'use client';

/**
 * Game context — provides the active GameWithConfig to all game-scoped pages.
 * The [gameSlug] layout resolves the game server-side and passes it here.
 */

import { createContext, useContext } from 'react';
import type { GameWithConfig } from '@/lib/types/game';

const GameContext = createContext<GameWithConfig | null>(null);

export function GameProvider({
  game,
  children,
}: {
  game: GameWithConfig;
  children: React.ReactNode;
}) {
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

/** Returns the active game. Must be called inside a [gameSlug] route. */
export function useGame(): GameWithConfig {
  const game = useContext(GameContext);
  if (!game) throw new Error('useGame must be used within a GameProvider');
  return game;
}
