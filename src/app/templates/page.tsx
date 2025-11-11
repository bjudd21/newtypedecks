'use client';

/**
 * Deck Templates Page
 */

import React from 'react';
import Link from 'next/link';
import { DeckTemplateBrowser } from '@/components/deck';

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Deck Templates
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Discover proven deck strategies and competitive builds from the
            Gundam Card Game community. Use these templates as starting points
            for your own deck creations or learn from successful tournament
            builds.
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
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <div className="mb-2 text-lg font-medium text-blue-800">
              🎯 Strategic Variety
            </div>
            <p className="text-sm text-blue-700">
              Explore different deck archetypes and strategies. From aggressive
              rush decks to control builds, find the playstyle that suits you
              best.
            </p>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <div className="mb-2 text-lg font-medium text-green-800">
              🏆 Tournament Proven
            </div>
            <p className="text-sm text-green-700">
              Many templates are based on successful tournament decks and
              competitive builds. Learn from the best players in the community.
            </p>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
            <div className="mb-2 text-lg font-medium text-purple-800">
              🔧 Customizable
            </div>
            <p className="text-sm text-purple-700">
              Templates are starting points. Feel free to modify and adapt them
              to your preferences and local meta game.
            </p>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Community Guidelines
          </h2>
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
            <ul className="space-y-2">
              <li>• Templates should be complete and playable decks</li>
              <li>
                • Provide clear descriptions of strategy and win conditions
              </li>
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
          <p className="mb-4 text-gray-600">
            Have a great deck to share? Create a template from your own decks to
            help other players!
          </p>
          <div className="space-x-4">
            <Link
              href="/decks"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Go to Deck Builder
            </Link>
            <Link
              href="/favorites"
              className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              View My Favorites
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
