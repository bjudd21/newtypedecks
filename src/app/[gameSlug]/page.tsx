/**
 * Game home page — shown at /[gameSlug]/.
 * Links to the main game-scoped sections.
 */

import Link from 'next/link';
import { getGameBySlug } from '@/lib/database/games';
import { notFound } from 'next/navigation';

interface GameHomePageProps {
  params: Promise<{ gameSlug: string }>;
}

export default async function GameHomePage({ params }: GameHomePageProps) {
  const { gameSlug } = await params;
  const game = await getGameBySlug(gameSlug);

  if (!game) notFound();

  const sections = [
    {
      href: `/${gameSlug}/cards`,
      label: 'Card Database',
      description: `Browse all ${game.name} cards`,
    },
    {
      href: `/${gameSlug}/decks`,
      label: 'Deck Builder',
      description: 'Build and share decks',
    },
    {
      href: `/${gameSlug}/collection`,
      label: 'My Collection',
      description: 'Track your card collection',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-5xl font-bold text-transparent">
            {game.name}
          </h1>
          {game.publisher && (
            <p className="text-gray-400">by {game.publisher}</p>
          )}
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-xl border border-[#443a5c] bg-[#2d2640] p-6 text-center transition-colors hover:border-[#8b7aaa] hover:bg-[#3a3050]"
            >
              <div className="mb-2 text-lg font-semibold text-white">
                {section.label}
              </div>
              <div className="text-sm text-gray-400">{section.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
