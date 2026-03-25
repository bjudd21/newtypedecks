/**
 * Game home page — shown at /[gameSlug]/.
 * Injects game primary color as --game-primary CSS variable so all
 * descendant elements can use it via var(--game-primary).
 */

import Link from 'next/link';
import { getGameBySlug } from '@/lib/database/games';
import { notFound } from 'next/navigation';
import {
  Database,
  BookMarked,
  Archive,
  Printer,
  ChevronRight,
} from 'lucide-react';

export const revalidate = 3600;

interface GameHomePageProps {
  params: Promise<{ gameSlug: string }>;
}

const SECTIONS = [
  {
    key: 'cards',
    label: 'Card Database',
    description: 'Browse, search, and filter every card in the set.',
    icon: Database,
  },
  {
    key: 'decks',
    label: 'Deck Builder',
    description: 'Build, validate, and share competitive decks.',
    icon: BookMarked,
  },
  {
    key: 'collection',
    label: 'My Collection',
    description: 'Track owned cards, wants, and trade targets.',
    icon: Archive,
  },
  {
    key: 'proxies',
    label: 'Proxy Generator',
    description: 'Print playtest-quality proxies at home.',
    icon: Printer,
  },
];

export default async function GameHomePage({ params }: GameHomePageProps) {
  const { gameSlug } = await params;
  const game = await getGameBySlug(gameSlug);

  if (!game) notFound();

  const accentColor = game.primaryColor ?? 'oklch(0.88 0 0)';

  return (
    <div
      className="min-h-[calc(100vh-57px)] px-4 py-8 md:px-6"
      style={{ '--game-primary': accentColor } as React.CSSProperties}
    >
      <div className="mx-auto max-w-5xl">
        {/* Game header */}
        <div className="mb-8">
          <div className="flex items-start gap-3">
            {/* Color swatch — accent indicator */}
            <div
              className="mt-1 h-5 w-1 flex-shrink-0 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <div>
              <h1 className="text-foreground text-2xl leading-tight font-bold">
                {game.name}
              </h1>
              {game.publisher && (
                <p className="text-muted-foreground mt-0.5 text-sm">
                  by {game.publisher}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.key}
                href={`/${gameSlug}/${section.key}`}
                className="group border-border bg-card hover:border-border/80 hover:bg-accent/30 focus-visible:ring-ring flex items-center gap-4 rounded-lg border p-4 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none"
              >
                {/* Icon */}
                <div className="border-border/50 bg-background/60 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border">
                  <Icon className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors duration-150" />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm leading-tight font-medium">
                    {section.label}
                  </p>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    {section.description}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className="text-muted-foreground/40 group-hover:text-muted-foreground h-4 w-4 flex-shrink-0 transition-all duration-150 group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>

        {/* Quick tip strip */}
        <div className="border-border/50 bg-card/50 mt-6 rounded-md border px-4 py-3">
          <p className="text-muted-foreground text-xs">
            <span className="text-foreground font-medium">Quick access:</span>{' '}
            Use the navigation bar above to jump directly to any section.
          </p>
        </div>
      </div>
    </div>
  );
}
