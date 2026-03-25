'use client';

/**
 * Landing page client component — game selector.
 *
 * Design: Dense launcher grid. No marketing hero. Immediate utility.
 * Each game card shows the game's accent color via a top border strip,
 * plus card/deck counts and a direct entry link.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { GameWithConfig } from '@/lib/types/game';
import { Database, BookMarked, Archive, Layers } from 'lucide-react';

interface GameWithCounts extends GameWithConfig {
  cardCount: number;
  deckCount: number;
}

interface LandingClientProps {
  games: GameWithCounts[];
}

const QUICK_LINKS = [
  { icon: Database, label: 'Cards' },
  { icon: BookMarked, label: 'Decks' },
  { icon: Archive, label: 'Collection' },
];

export function LandingClient({ games }: LandingClientProps) {
  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section header — minimal, functional */}
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h1 className="text-foreground text-base font-semibold">
              Supported Games
            </h1>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Select a game to access its card database, deck builder, and
              collection tools.
            </p>
          </div>
          {games.length > 0 && (
            <span className="text-muted-foreground/50 text-xs">
              {games.length} {games.length === 1 ? 'game' : 'games'}
            </span>
          )}
        </div>

        {/* Game grid */}
        {games.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GameCard({ game, index }: { game: GameWithCounts; index: number }) {
  const accentColor = game.primaryColor ?? 'oklch(0.88 0 0)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
    >
      <Link href={`/${game.slug}`} className="group block h-full outline-none">
        <div
          className="border-border bg-card group-hover:border-border/80 group-hover:bg-accent/30 group-focus-visible:ring-ring relative flex h-full flex-col overflow-hidden rounded-lg border transition-all duration-150 group-focus-visible:ring-2"
          style={{ '--game-accent': accentColor } as React.CSSProperties}
        >
          {/* Top accent strip — game primary color */}
          <div
            className="h-0.5 w-full flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          />

          <div className="flex flex-1 flex-col p-4">
            {/* Game name + publisher */}
            <div className="mb-3 flex-1">
              <h2 className="text-foreground text-base leading-tight font-semibold">
                {game.name}
              </h2>
              {game.publisher && (
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {game.publisher}
                </p>
              )}
            </div>

            {/* Stats row */}
            <div className="mb-3 flex items-center gap-3">
              <Stat
                icon={<Database className="h-3 w-3" />}
                value={game.cardCount.toLocaleString()}
                label="cards"
              />
              {game.deckCount > 0 && (
                <Stat
                  icon={<BookMarked className="h-3 w-3" />}
                  value={game.deckCount.toLocaleString()}
                  label="decks"
                />
              )}
              {game.deckCount === 0 && (
                <span
                  className="rounded-sm px-1.5 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${accentColor} 15%, transparent)`,
                    color: accentColor,
                  }}
                >
                  New
                </span>
              )}
            </div>

            {/* Quick links */}
            <div className="border-border/50 flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-2">
                {QUICK_LINKS.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="text-muted-foreground/60 flex items-center gap-1 text-[11px]"
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </span>
                ))}
              </div>
              <span
                className="text-xs font-medium transition-colors duration-150"
                style={{ color: accentColor }}
              >
                Enter →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <span className="text-muted-foreground flex items-center gap-1 text-xs">
      <span className="text-muted-foreground/50">{icon}</span>
      <span className="text-foreground font-medium tabular-nums">{value}</span>
      <span>{label}</span>
    </span>
  );
}

function EmptyState() {
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
      <Layers className="text-muted-foreground/30 mb-3 h-8 w-8" />
      <p className="text-muted-foreground text-sm font-medium">
        No games available yet
      </p>
      <p className="text-muted-foreground/60 mt-1 text-xs">Check back soon.</p>
    </div>
  );
}
