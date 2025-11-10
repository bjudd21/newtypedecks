/**
 * Favorite Decks Page
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FavoriteDeckManager } from '@/components/deck';

export const metadata: Metadata = {
  title: 'Favorite Decks | Gundam Card Game',
  description: 'Manage your collection of favorite decks from the Gundam Card Game community. Keep track of decks you love and want to reference later.',
  keywords: 'gundam card game, favorite decks, saved decks, deck collection, bookmarks'
};

export default async function FavoritesPage() {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/favorites');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Favorite Decks
          </h1>
          <p className="text-lg text-gray-600">
            Manage your collection of favorite decks from the community.
            Keep track of decks you love and want to reference later.
          </p>
        </div>

        {/* Favorite Deck Manager */}
        <FavoriteDeckManager
          onDeckSelect={(deckId) => {
            // Redirect to deck detail page
            window.location.href = `/decks/${deckId}`;
          }}
          onRemoveFavorite={() => {
            // Refresh handled by component
            console.warn('Favorite removed');
          }}
        />

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-blue-800 font-medium text-lg mb-2">
              🔍 Discover More
            </div>
            <p className="text-blue-700 text-sm mb-4">
              Browse templates and community decks to find new favorites to add to your collection.
            </p>
            <a
              href="/templates"
              className="inline-flex items-center text-blue-700 hover:text-blue-800 text-sm font-medium"
            >
              Browse Templates →
            </a>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-green-800 font-medium text-lg mb-2">
              🔧 Build Your Own
            </div>
            <p className="text-green-700 text-sm mb-4">
              Create your own decks using the deck builder. Save them and share with the community.
            </p>
            <Link
              href="/decks"
              className="inline-flex items-center text-green-700 hover:text-green-800 text-sm font-medium"
            >
              Deck Builder →
            </Link>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="text-purple-800 font-medium text-lg mb-2">
              📊 Browse Community
            </div>
            <p className="text-purple-700 text-sm mb-4">
              Explore public decks shared by other players in the community.
            </p>
            <Link
              href="/decks?filter=public"
              className="inline-flex items-center text-purple-700 hover:text-purple-800 text-sm font-medium"
            >
              Community Decks →
            </Link>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            💡 Tips for Managing Favorites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <ul className="space-y-2">
              <li>• Use the search function to quickly find specific favorites</li>
              <li>• Favorite both decks you want to study and ones you enjoy playing</li>
              <li>• Check back regularly as creators may update their decks</li>
            </ul>
            <ul className="space-y-2">
              <li>• Use templates from your favorites to create new deck variations</li>
              <li>• Remove outdated favorites to keep your collection organized</li>
              <li>• Share your own decks so others can add them to their favorites</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}