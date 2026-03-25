/**
 * Game-scoped layout — resolves the game by slug and provides it to all
 * child pages via GameProvider. Returns 404 for unknown game slugs.
 */

import { notFound } from 'next/navigation';
import { getGameBySlug } from '@/lib/database/games';
import { GameProvider } from '@/contexts/GameContext';

export const revalidate = 3600;

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

  // Inject the game's primary color as a CSS custom property so all
  // descendant components can use it via var(--game-primary) / bg-primary.
  const accentColor = game.primaryColor ?? 'oklch(0.88 0 0)';

  return (
    <div style={{ '--game-primary': accentColor } as React.CSSProperties}>
      <GameProvider game={game}>{children}</GameProvider>
    </div>
  );
}
