/**
 * Game-scoped layout — resolves the game by slug and provides it to all
 * child pages via GameProvider. Returns 404 for unknown game slugs.
 */

import { notFound } from 'next/navigation';
import { getGameBySlug } from '@/lib/database/games';
import { GameProvider } from '@/contexts/GameContext';

interface GameLayoutProps {
  children: React.ReactNode;
  params: Promise<{ gameSlug: string }>;
}

export default async function GameLayout({
  children,
  params,
}: GameLayoutProps) {
  const { gameSlug } = await params;
  const game = await getGameBySlug(gameSlug);

  if (!game) notFound();

  return <GameProvider game={game}>{children}</GameProvider>;
}
