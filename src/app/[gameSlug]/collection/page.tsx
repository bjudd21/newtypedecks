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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-3xl font-bold text-transparent">
          My Collection
        </h1>
        <p className="text-gray-400">
          Track and manage your personal {gameName} collection
        </p>
      </div>

      <CollectionManager />
    </div>
  );
}
