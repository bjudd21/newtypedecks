/**
 * Deck Templates Page
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { DeckTemplateBrowser } from '@/components/deck';

export const metadata: Metadata = {
  title: 'Deck Templates | Gundam Card Game',
  description: 'Browse and use community-created deck templates to jumpstart your deck building. Discover proven strategies and competitive builds from the Gundam Card Game community.',
  keywords: 'gundam card game, deck templates, community decks, deck building, competitive builds, tournament decks'
};

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deck Templates
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover proven deck strategies and competitive builds from the Gundam Card Game community.
            Use these templates as starting points for your own deck creations or learn from successful tournament builds.
          </p>
        </div>

        {/* Template Browser */}
        <DeckTemplateBrowser
          onCreateFromTemplate={(_templateId) => {
            // Redirect to deck builder with new deck
            window.location.href = '/decks';
          }}
        />

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-blue-800 font-medium text-lg mb-2">
              🎯 Strategic Variety
            </div>
            <p className="text-blue-700 text-sm">
              Explore different deck archetypes and strategies. From aggressive rush decks to control builds,
              find the playstyle that suits you best.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-green-800 font-medium text-lg mb-2">
              🏆 Tournament Proven
            </div>
            <p className="text-green-700 text-sm">
              Many templates are based on successful tournament decks and competitive builds.
              Learn from the best players in the community.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="text-purple-800 font-medium text-lg mb-2">
              🔧 Customizable
            </div>
            <p className="text-purple-700 text-sm">
              Templates are starting points. Feel free to modify and adapt them to your preferences
              and local meta game.
            </p>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Community Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <ul className="space-y-2">
              <li>• Templates should be complete and playable decks</li>
              <li>• Provide clear descriptions of strategy and win conditions</li>
              <li>• Include sideboard suggestions where applicable</li>
              <li>• Test your templates before sharing with the community</li>
            </ul>
            <ul className="space-y-2">
              <li>• Credit original creators when adapting existing decks</li>
              <li>• Keep descriptions helpful and constructive</li>
              <li>• Report inappropriate or spam templates</li>
              <li>• Share feedback and improvements with template creators</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Have a great deck to share? Create a template from your own decks to help other players!
          </p>
          <div className="space-x-4">
            <Link
              href="/decks"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Deck Builder
            </Link>
            <Link
              href="/favorites"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View My Favorites
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}