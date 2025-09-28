/**
 * Tournament Preparation Page
 * Comprehensive tournament preparation tools for competitive players
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import {
  TournamentValidator,
  MatchupAnalysis,
  PracticeTracker,
  TournamentSimulator
} from '@/components/tournament';
import { DeckSelector } from '@/components/deck';
import type { TournamentDeck } from '@/lib/services/tournamentPrepService';
import type { DeckCard } from '@/lib/services/deckAnalyticsService';
import { useAuth, useDecks } from '@/hooks';

export default function TournamentPrepPage() {
  const { isAuthenticated } = useAuth();
  const { getUserDecks } = useDecks();

  const [selectedDeck, setSelectedDeck] = useState<TournamentDeck | null>(null);
  const [activeTab, setActiveTab] = useState<'validator' | 'matchups' | 'practice' | 'simulator'>('validator');
  const [availableDecks, setAvailableDecks] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserDecks();
    }
  }, [isAuthenticated]);

  const loadUserDecks = async () => {
    try {
      const decks = await getUserDecks();
      setAvailableDecks(decks);
    } catch (error) {
      console.error('Failed to load user decks:', error);
    }
  };

  const handleDeckSelect = (deck: any) => {
    const tournamentDeck: TournamentDeck = {
      mainDeck: deck.cards as DeckCard[],
      sideboard: [], // TODO: Add sideboard support
      name: deck.name,
      format: {
        name: 'Standard',
        minDeckSize: 50,
        maxDeckSize: 60,
        sideboardSize: 15,
        maxCopiesPerCard: 3,
        bannedCards: [],
        restrictedCards: []
      }
    };
    setSelectedDeck(tournamentDeck);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Tournament Preparation
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Comprehensive tools to prepare your deck for competitive tournament play, analyze matchups, and improve your game.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">✅</div>
            <div className="text-sm text-gray-600">Deck Validation</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">⚔️</div>
            <div className="text-sm text-gray-600">Matchup Analysis</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">🎯</div>
            <div className="text-sm text-gray-600">Practice Tracking</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">🏆</div>
            <div className="text-sm text-gray-600">Tournament Simulator</div>
          </div>
        </div>
      </div>

      {/* Deck Selection */}
      {!selectedDeck && (
        <Card className="mb-8">
          <CardContent className="pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Deck to Analyze</h3>

            {!isAuthenticated ? (
              <div className="text-center py-8">
                <div className="text-gray-600 mb-4">
                  <div className="text-4xl mb-2">🔐</div>
                  <p className="text-lg font-medium mb-2">Sign In Required</p>
                  <p>Create an account or sign in to access your tournament decks and preparation tools</p>
                </div>
                <Button variant="primary" className="mt-4">
                  Sign In to Continue
                </Button>
              </div>
            ) : availableDecks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-600 mb-4">
                  <div className="text-4xl mb-2">🃏</div>
                  <p className="text-lg font-medium mb-2">No Decks Found</p>
                  <p>Create a deck first to start your tournament preparation</p>
                </div>
                <Button variant="primary" className="mt-4">
                  Build Your First Deck
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {availableDecks.map((deck) => (
                  <div
                    key={deck.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleDeckSelect(deck)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{deck.name}</h4>
                        {deck.description && (
                          <p className="text-sm text-gray-600">{deck.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{deck.cards?.reduce((sum: number, card: any) => sum + (card.quantity || 0), 0) || 0} cards</span>
                          <span>Updated {new Date(deck.updatedAt).toLocaleDateString()}</span>
                          {deck.isPublic && <span className="text-blue-600">Public</span>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Select for Tournament Prep
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tournament Preparation Tools */}
      {selectedDeck && (
        <div>
          {/* Selected Deck Info */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">{selectedDeck.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-blue-700">
                    <span>{selectedDeck.mainDeck.reduce((sum, card) => sum + card.quantity, 0)} main deck cards</span>
                    <span>{selectedDeck.sideboard.reduce((sum, card) => sum + card.quantity, 0)} sideboard cards</span>
                    <span>Format: {selectedDeck.format.name}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedDeck(null)}
                  variant="outline"
                  size="sm"
                >
                  Change Deck
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'validator', label: '✅ Deck Validation', desc: 'Tournament legality check' },
                  { id: 'matchups', label: '⚔️ Matchup Analysis', desc: 'Performance vs meta decks' },
                  { id: 'practice', label: '🎯 Practice Tracker', desc: 'Track practice games' },
                  { id: 'simulator', label: '🏆 Tournament Sim', desc: 'Simulate tournament results' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div>{tab.label}</div>
                    <div className="text-xs font-normal text-gray-500">{tab.desc}</div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'validator' && (
              <TournamentValidator
                deck={{
                  mainDeck: selectedDeck.mainDeck,
                  sideboard: selectedDeck.sideboard,
                  name: selectedDeck.name
                }}
              />
            )}

            {activeTab === 'matchups' && (
              <MatchupAnalysis deck={selectedDeck} />
            )}

            {activeTab === 'practice' && (
              <PracticeTracker deck={selectedDeck} />
            )}

            {activeTab === 'simulator' && (
              <TournamentSimulator deck={selectedDeck} />
            )}
          </div>
        </div>
      )}

      {/* Getting Started Guide */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Preparation Guide</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Pre-Tournament Checklist</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                Validate your deck for tournament legality
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                Analyze matchups against expected meta
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                Practice against difficult matchups
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                Simulate tournament performance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">5.</span>
                Prepare your sideboard strategy
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Tournament Tools</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Format validation and rule checking</li>
              <li>📊 Win rate predictions and statistics</li>
              <li>🎯 Detailed matchup breakdowns and strategies</li>
              <li>📝 Practice match tracking and analysis</li>
              <li>🏆 Full tournament simulation with placement predictions</li>
              <li>💡 Sideboard recommendations and play tips</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">💡</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Pro Tip</h4>
              <p className="text-blue-800 text-sm">
                Consistent practice is key to tournament success. Use the practice tracker to identify
                weak matchups and focus your preparation time on areas that need the most improvement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Resources */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-start gap-4">
          <div className="text-purple-600 text-2xl">🏆</div>
          <div>
            <h4 className="font-semibold text-purple-900 mb-2">Tournament Resources</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h5 className="text-sm font-medium text-purple-800 mb-1">Official Rules</h5>
                <p className="text-xs text-purple-700">Latest tournament rules and formats</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-purple-800 mb-1">Meta Reports</h5>
                <p className="text-xs text-purple-700">Current competitive landscape analysis</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-purple-800 mb-1">Event Calendar</h5>
                <p className="text-xs text-purple-700">Upcoming tournaments and events</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}