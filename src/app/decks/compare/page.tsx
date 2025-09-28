/**
 * Deck Comparison Page
 * Allows users to compare multiple decks side by side
 */

'use client';

import React, { useState } from 'react';
import { Metadata } from 'next';
import { DeckComparison, DeckSelector } from '@/components/deck';
import type { ComparisonDeck } from '@/lib/services/deckComparisonService';

// Note: Metadata export not supported in client components, handled by layout
// export const metadata: Metadata = {
//   title: 'Deck Comparison | Gundam Card Game',
//   description: 'Compare multiple decks side by side with detailed analysis and strategic insights',
//   keywords: ['gundam', 'card game', 'deck', 'comparison', 'analysis', 'strategy'],
// };

export default function DeckComparisonPage() {
  const [selectedDecks, setSelectedDecks] = useState<ComparisonDeck[]>([]);

  const handleDeckSelect = (deck: ComparisonDeck) => {
    if (selectedDecks.length >= 4) {
      alert('Maximum of 4 decks can be compared at once');
      return;
    }

    if (selectedDecks.some(d => d.id === deck.id)) {
      alert('This deck is already selected for comparison');
      return;
    }

    setSelectedDecks(prev => [...prev, deck]);
  };

  const handleDeckRemove = (deckId: string) => {
    setSelectedDecks(prev => prev.filter(d => d.id !== deckId));
  };

  const handleAddMoreDecks = () => {
    // Scroll to deck selector
    const selector = document.getElementById('deck-selector');
    if (selector) {
      selector.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Deck Comparison Tool
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Compare multiple decks side by side to analyze their strengths, weaknesses, and strategic matchups.
        </p>

        {/* Quick Stats */}
        {selectedDecks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedDecks.length}</div>
              <div className="text-sm text-gray-600">Decks Selected</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {selectedDecks.reduce((sum, deck) => sum + deck.cards.reduce((cardSum, card) => cardSum + card.quantity, 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Cards</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(selectedDecks.reduce((sum, deck) => {
                  const avgCost = deck.cards.reduce((costSum, card) =>
                    costSum + ((card.card.cost || 0) * card.quantity), 0) /
                    deck.cards.reduce((cardSum, card) => cardSum + card.quantity, 0);
                  return sum + avgCost;
                }, 0) / (selectedDecks.length || 1) * 10) / 10}
              </div>
              <div className="text-sm text-gray-600">Avg Cost</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">4</div>
              <div className="text-sm text-gray-600">Max Decks</div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {selectedDecks.length >= 2 && (
        <div className="mb-8">
          <DeckComparison
            decks={selectedDecks}
            onRemoveDeck={handleDeckRemove}
            onAddDeck={handleAddMoreDecks}
          />
        </div>
      )}

      {/* Deck Selection */}
      <div id="deck-selector">
        <DeckSelector
          selectedDecks={selectedDecks}
          onDeckSelect={handleDeckSelect}
          onDeckRemove={handleDeckRemove}
          maxDecks={4}
        />
      </div>

      {/* Getting Started Guide */}
      {selectedDecks.length === 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started with Deck Comparison</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How to Compare Decks</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  Select 2-4 decks from your collection or public decks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  View detailed comparison analysis across multiple tabs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  Analyze strengths, weaknesses, and head-to-head matchups
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  Get personalized recommendations for improvements
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Comparison Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📊 Statistical analysis and competitive ratings</li>
                <li>⚔️ Head-to-head matchup predictions</li>
                <li>🔍 Detailed card distribution comparisons</li>
                <li>💡 Strategic recommendations and improvements</li>
                <li>🎯 Meta-game advantages and weaknesses</li>
                <li>📈 Predicted winrates and performance metrics</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 text-xl">💡</div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Pro Tip</h4>
                <p className="text-blue-800 text-sm">
                  Compare your deck against top-performing community decks to identify improvement opportunities
                  and understand the current meta-game trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Deck Selected Guide */}
      {selectedDecks.length === 1 && (
        <div className="mt-8 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="text-yellow-600 text-2xl">🎯</div>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">One Deck Selected</h4>
              <p className="text-yellow-800 text-sm">
                Select at least one more deck to start the comparison analysis.
                You can compare up to 4 decks simultaneously for comprehensive insights.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}