/**
 * Collection page - Personal collection management interface
 */

import { CollectionManager } from '@/components/collection';
import { getGameBySlug } from '@/lib/database/games';

interface CollectionPageProps {
  params: Promise<{ gameSlug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { gameSlug } = await params;
  const game = await getGameBySlug(gameSlug);
  const gameName = game?.name ?? 'Card Game';
  return {
    title: `My Collection | ${gameName}`,
    description: `Manage your personal ${gameName} collection`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { gameSlug } = await params;
  const game = await getGameBySlug(gameSlug);
  const gameName = game?.name ?? 'Card Game';

  return (
    <div className="min-h-[calc(100vh-57px)]">
      {/* Hero placeholder */}
      <div
        className="hero-placeholder relative h-20 overflow-hidden"
        aria-hidden="true"
      >
        <div className="to-background absolute inset-0 bg-gradient-to-b from-transparent" />
      </div>
      <div className="container mx-auto px-4 pb-8">
        <div className="mb-6">
          <h1 className="text-foreground text-2xl font-semibold">
            My Collection
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Track and manage your personal {gameName} collection
          </p>
        </div>
        <CollectionManager />
      </div>
    </div>
  );
}
