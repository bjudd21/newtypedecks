'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { CompetitiveRating } from '@/components/analytics';
import { useDecks, useAuth } from '@/hooks';
import type { ComparisonDeck } from '@/lib/services/deckComparisonService';
import type { DeckCard } from '@/lib/services/deckAnalyticsService';

interface DeckSelectorProps {
  selectedDecks: ComparisonDeck[];
  onDeckSelect: (deck: ComparisonDeck) => void;
  onDeckRemove: (deckId: string) => void;
  maxDecks?: number;
  className?: string;
}

interface DeckListItem {
  id: string;
  name: string;
  description?: string;
  cardCount: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export const DeckSelector: React.FC<DeckSelectorProps> = ({
  selectedDecks,
  onDeckSelect,
  onDeckRemove,
  maxDecks = 4,
  className
}) => {
  const { isAuthenticated } = useAuth();
  const { getUserDecks, getPublicDecks, getDeckById, isLoading } = useDecks();

  const [availableDecks, setAvailableDecks] = useState<DeckListItem[]>([]);
  const [loadingDeckData, setLoadingDeckData] = useState<Record<string, boolean>>({});
  const [showPublicDecks, setShowPublicDecks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAvailableDecks();
  }, [isAuthenticated, showPublicDecks]);

  const loadAvailableDecks = async () => {
    try {
      let decks: DeckListItem[] = [];

      if (isAuthenticated) {
        // Load user's decks
        const userDecks = await getUserDecks();
        decks = userDecks.map(deck => ({
          id: deck.id,
          name: deck.name,
          description: deck.description,
          cardCount: deck.cards?.reduce((sum, card) => sum + (card.quantity || 0), 0) || 0,
          isPublic: deck.isPublic,
          createdAt: deck.createdAt,
          updatedAt: deck.updatedAt,
          userId: deck.userId
        }));
      }

      if (showPublicDecks) {
        // Load public decks
        const publicDecks = await getPublicDecks();
        const publicDeckItems = publicDecks.map(deck => ({
          id: deck.id,
          name: deck.name,
          description: deck.description,
          cardCount: deck.cards?.reduce((sum, card) => sum + (card.quantity || 0), 0) || 0,
          isPublic: true,
          createdAt: deck.createdAt,
          updatedAt: deck.updatedAt,
          userId: deck.userId
        }));

        // Merge and deduplicate (user's decks take priority)
        const userDeckIds = new Set(decks.map(d => d.id));
        const uniquePublicDecks = publicDeckItems.filter(d => !userDeckIds.has(d.id));
        decks = [...decks, ...uniquePublicDecks];
      }

      setAvailableDecks(decks);
    } catch (error) {
      console.error('Failed to load available decks:', error);
      setAvailableDecks([]);
    }
  };

  const handleDeckSelect = async (deckItem: DeckListItem) => {
    if (selectedDecks.length >= maxDecks) {
      alert(`Maximum of ${maxDecks} decks can be compared at once`);
      return;
    }

    if (selectedDecks.some(d => d.id === deckItem.id)) {
      alert('This deck is already selected for comparison');
      return;
    }

    setLoadingDeckData(prev => ({ ...prev, [deckItem.id]: true }));

    try {
      // Load full deck data including cards
      const fullDeck = await getDeckById(deckItem.id);

      if (!fullDeck || !fullDeck.cards) {
        throw new Error('Deck data not found or incomplete');
      }

      const comparisonDeck: ComparisonDeck = {
        id: fullDeck.id,
        name: fullDeck.name,
        description: fullDeck.description,
        cards: fullDeck.cards.map(deckCard => ({
          cardId: deckCard.cardId,
          card: deckCard.card,
          quantity: deckCard.quantity,
          category: deckCard.category || 'main'
        })) as DeckCard[]
      };

      onDeckSelect(comparisonDeck);
    } catch (error) {
      console.error('Failed to load deck for comparison:', error);
      alert('Failed to load deck data. Please try again.');
    } finally {
      setLoadingDeckData(prev => ({ ...prev, [deckItem.id]: false }));
    }
  };

  const filteredDecks = availableDecks.filter(deck =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedDeckIds = new Set(selectedDecks.map(d => d.id));

  return (
    <div className={className}>
      {/* Selected Decks */}
      {selectedDecks.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selected for Comparison ({selectedDecks.length}/{maxDecks})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedDecks.map((deck) => (
                <div key={deck.id} className="border rounded-lg p-3 bg-blue-50 border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{deck.name}</h4>
                      {deck.description && (
                        <p className="text-xs text-gray-600 mt-1">{deck.description}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => onDeckRemove(deck.id)}
                      variant="outline"
                      size="sm"
                      className="ml-2 text-red-600 hover:bg-red-50"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Cards:</span>
                    <span className="font-medium">
                      {deck.cards.reduce((sum, card) => sum + card.quantity, 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deck Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Choose Decks to Compare</CardTitle>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <Button
                  onClick={() => setShowPublicDecks(!showPublicDecks)}
                  variant={showPublicDecks ? 'primary' : 'outline'}
                  size="sm"
                >
                  {showPublicDecks ? 'Hide Public' : 'Show Public'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search decks by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading decks...</p>
            </div>
          ) : filteredDecks.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <div className="text-4xl mb-2">🃏</div>
              <p className="mb-2">No decks found</p>
              {!isAuthenticated ? (
                <p className="text-sm">Sign in to access your decks or view public deck collections</p>
              ) : searchQuery ? (
                <p className="text-sm">Try adjusting your search terms</p>
              ) : showPublicDecks ? (
                <p className="text-sm">No public decks available at this time</p>
              ) : (
                <p className="text-sm">You haven't created any decks yet</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDecks.map((deck) => {
                const isSelected = selectedDeckIds.has(deck.id);
                const isLoading = loadingDeckData[deck.id];
                const canSelect = selectedDecks.length < maxDecks && !isSelected;

                return (
                  <div
                    key={deck.id}
                    className={`border rounded-lg p-3 transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{deck.name}</h4>
                          {!isAuthenticated && deck.isPublic && (
                            <Badge variant="secondary" className="text-xs">Public</Badge>
                          )}
                          {isAuthenticated && deck.userId !== 'current-user' && (
                            <Badge variant="outline" className="text-xs">Community</Badge>
                          )}
                        </div>
                        {deck.description && (
                          <p className="text-xs text-gray-600 mb-2">{deck.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>{deck.cardCount} cards</span>
                          <span>Updated {new Date(deck.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="ml-3 flex-shrink-0">
                        {isSelected ? (
                          <Button
                            onClick={() => onDeckRemove(deck.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleDeckSelect(deck)}
                            variant={canSelect ? 'primary' : 'outline'}
                            size="sm"
                            disabled={!canSelect || isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-1">
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                Loading
                              </div>
                            ) : canSelect ? (
                              'Select'
                            ) : selectedDecks.length >= maxDecks ? (
                              'Max Reached'
                            ) : (
                              'Selected'
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckSelector;