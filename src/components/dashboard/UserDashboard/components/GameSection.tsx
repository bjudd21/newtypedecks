/**
 * GameSection Component
 * Per-game card shown in the cross-game dashboard.
 * Displays deck count, cards owned, recent decks, and quick-action links.
 */

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { GameDashboardData } from '@/lib/database/dashboard';

interface GameSectionProps {
  data: GameDashboardData;
}

const VISIBILITY_LABEL: Record<string, string> = {
  DRAFT: 'Draft',
  PRIVATE: 'Private',
  PUBLIC: 'Public',
};

export const GameSection: React.FC<GameSectionProps> = ({ data }) => {
  const { game, deckCount, recentDecks, collectionCardCount } = data;
  const slug = game.slug;
  const accentColor = game.primaryColor ?? 'oklch(0.82 0.165 76)';

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle
          className="text-base font-semibold"
          style={{ color: accentColor }}
        >
          {game.shortName ?? game.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats row */}
        <div className="flex gap-6">
          <div>
            <div className="text-2xl font-bold text-white">{deckCount}</div>
            <div className="text-muted-foreground text-xs">Decks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {collectionCardCount}
            </div>
            <div className="text-muted-foreground text-xs">Cards Owned</div>
          </div>
        </div>

        {/* Recent decks */}
        {recentDecks.length > 0 ? (
          <div className="space-y-1">
            <div className="text-muted-foreground/70 text-xs font-medium tracking-wide uppercase">
              Recent Decks
            </div>
            {recentDecks.map((deck) => (
              <Link
                key={deck.id}
                href={`/${slug}/decks/${deck.id}`}
                className="hover:text-foreground flex items-center justify-between text-sm text-[#c8b8f0]"
              >
                <span className="truncate pr-2">{deck.name}</span>
                <span className="text-muted-foreground/70 shrink-0 text-xs">
                  {VISIBILITY_LABEL[deck.visibility] ?? deck.visibility} ·{' '}
                  {deck.updatedAt}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground/70 text-sm">No decks yet.</p>
        )}

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href={`/${slug}/decks/create`}
            className="bg-border rounded px-3 py-1 text-xs text-[#c8b8f0] transition-colors hover:bg-[#5a4e7a]"
          >
            Build Deck
          </Link>
          <Link
            href={`/${slug}/cards`}
            className="bg-border rounded px-3 py-1 text-xs text-[#c8b8f0] transition-colors hover:bg-[#5a4e7a]"
          >
            Browse Cards
          </Link>
          <Link
            href={`/${slug}/collection`}
            className="bg-border rounded px-3 py-1 text-xs text-[#c8b8f0] transition-colors hover:bg-[#5a4e7a]"
          >
            Collection
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
