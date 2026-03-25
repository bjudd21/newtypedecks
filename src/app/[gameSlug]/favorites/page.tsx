/**
 * Favorite Decks Page
 */

import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FavoriteDeckManager } from '@/components/deck';
import { getGameBySlug } from '@/lib/database/games';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gameSlug: string }>;
}) {
  const { gameSlug } = await params;
  const game = await getGameBySlug(gameSlug);
  const gameName = game?.name ?? 'Card Game';
  return {
    title: `Favorite Decks | ${gameName}`,
    description: `Manage your collection of favorite decks from the ${gameName} community. Keep track of decks you love and want to reference later.`,
    keywords:
      'card game, favorite decks, saved decks, deck collection, bookmarks',
  };
}

interface FavoritesPageProps {
  params: Promise<{ gameSlug: string }>;
}

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { gameSlug } = await params;

  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/${gameSlug}/favorites`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-4 text-4xl font-bold">
            Favorite Decks
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your collection of favorite decks from the community. Keep
            track of decks you love and want to reference later.
          </p>
        </div>

        {/* Favorite Deck Manager */}
        <FavoriteDeckManager
          onDeckSelect={(deckId) => {
            // Redirect to deck detail page
            window.location.href = `/${gameSlug}/decks/${deckId}`;
          }}
          onRemoveFavorite={() => {
            // Refresh handled by component
            console.warn('Favorite removed');
          }}
        />

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <div className="mb-2 text-lg font-medium text-blue-800">
              🔍 Discover More
            </div>
            <p className="mb-4 text-sm text-blue-700">
              Browse templates and community decks to find new favorites to add
              to your collection.
            </p>
            <a
              href={`/${gameSlug}/templates`}
              className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Browse Templates →
            </a>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <div className="mb-2 text-lg font-medium text-green-800">
              🔧 Build Your Own
            </div>
            <p className="mb-4 text-sm text-green-700">
              Create your own decks using the deck builder. Save them and share
              with the community.
            </p>
            <Link
              href={`/${gameSlug}/decks`}
              className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800"
            >
              Deck Builder →
            </Link>
          </div>

          <div className="border-border bg-card rounded-lg border p-6">
            <div className="text-foreground mb-2 text-lg font-medium">
              📊 Browse Community
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              Explore public decks shared by other players in the community.
            </p>
            <Link
              href={`/${gameSlug}/decks?filter=public`}
              className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm font-medium"
            >
              Community Decks →
            </Link>
          </div>
        </div>

        {/* Tips */}
        <div className="border-border bg-accent mt-8 rounded-lg border p-6">
          <h2 className="text-foreground mb-4 text-lg font-medium">
            💡 Tips for Managing Favorites
          </h2>
          <div className="text-muted-foreground grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <ul className="space-y-2">
              <li>
                • Use the search function to quickly find specific favorites
              </li>
              <li>
                • Favorite both decks you want to study and ones you enjoy
                playing
              </li>
              <li>• Check back regularly as creators may update their decks</li>
            </ul>
            <ul className="space-y-2">
              <li>
                • Use templates from your favorites to create new deck
                variations
              </li>
              <li>
                • Remove outdated favorites to keep your collection organized
              </li>
              <li>
                • Share your own decks so others can add them to their favorites
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
