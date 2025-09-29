'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { CompetitiveRating } from '@/components/analytics';
import {
  deckRecommendationService,
  type DeckRecommendation,
  type UserPreferences,
  type RecommendationFilters
} from '@/lib/services/deckRecommendationService';
import { useAuth, useDecks, useCollection } from '@/hooks';

interface DeckRecommendationsProps {
  userPreferences?: UserPreferences;
  onPreferencesChange?: (preferences: UserPreferences) => void;
  className?: string;
}

export const DeckRecommendations: React.FC<DeckRecommendationsProps> = ({
  userPreferences,
  onPreferencesChange,
  className
}) => {
  const { isAuthenticated, user } = useAuth();
  const { getUserDecks } = useDecks();
  const { getUserCollection } = useCollection();

  const [recommendations, setRecommendations] = useState<DeckRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RecommendationFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'archetypes' | 'upgrades'>('recommendations');

  useEffect(() => {
    if (userPreferences) {
      loadRecommendations();
    }
  }, [userPreferences, filters]);

  const loadRecommendations = async () => {
    if (!userPreferences) return;

    setIsLoading(true);
    setError(null);

    try {
      let userCollection;
      let currentDecks;

      if (isAuthenticated) {
        // Load user's collection and current decks
        userCollection = await getUserCollection();
        currentDecks = await getUserDecks();
      }

      const result = await deckRecommendationService.getRecommendations(
        userPreferences,
        userCollection,
        currentDecks,
        filters
      );

      setRecommendations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof RecommendationFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (!userPreferences) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <div className="text-gray-600 mb-4">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-lg font-medium mb-2">Personalized Deck Recommendations</p>
            <p>Set your preferences to get customized deck suggestions</p>
          </div>
          {onPreferencesChange && (
            <Button
              onClick={() => onPreferencesChange({
                playStyle: 'balanced',
                favoriteTypes: [],
                favoriteFactions: [],
                preferredCostRange: [1, 6],
                competitiveLevel: 'casual',
                deckSizePreference: 'standard',
                complexityPreference: 'moderate'
              })}
              variant="primary"
            >
              Set Up Preferences
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'recommendations', label: '🎯 Recommendations' },
              { id: 'archetypes', label: '🎮 Archetypes' },
              { id: 'upgrades', label: '⬆️ Upgrades' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Filters */}
      {activeTab === 'recommendations' && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </CardHeader>
          {showFilters && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Missing Cards
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={filters.maxMissingCards || ''}
                    onChange={(e) => handleFilterChange('maxMissingCards', parseInt(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Any"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Win Rate %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.minWinrate || ''}
                    onChange={(e) => handleFilterChange('minWinrate', parseInt(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Any"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="includeExperimental"
                    checked={filters.includeExperimental || false}
                    onChange={(e) => handleFilterChange('includeExperimental', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="includeExperimental" className="text-sm text-gray-700">
                    Include experimental decks
                  </label>
                </div>
                {isAuthenticated && (
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="onlyFromCollection"
                      checked={filters.onlyFromCollection || false}
                      onChange={(e) => handleFilterChange('onlyFromCollection', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="onlyFromCollection" className="text-sm text-gray-700">
                      Only from my collection
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Content */}
      {activeTab === 'recommendations' && (
        <div>
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Finding perfect decks for you...</p>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-red-600 mb-4">⚠️</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={loadRecommendations} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : recommendations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-600">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-lg font-medium mb-2">No Recommendations Found</p>
                  <p>Try adjusting your filters or preferences to see more options</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.deck.id}
                  recommendation={recommendation}
                  rank={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'archetypes' && (
        <ArchetypeRecommendations preferences={userPreferences} />
      )}

      {activeTab === 'upgrades' && (
        <DeckUpgrades />
      )}
    </div>
  );
};

interface RecommendationCardProps {
  recommendation: DeckRecommendation;
  rank: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, rank }) => {
  const [expanded, setExpanded] = useState(false);

  const getMetaColor = (position: string) => {
    switch (position) {
      case 'top-tier': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'competitive': return 'bg-green-100 text-green-800 border-green-200';
      case 'viable': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'experimental': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
              #{rank}
            </div>
            <div>
              <CardTitle className="text-lg">{recommendation.deck.name}</CardTitle>
              <p className="text-sm text-gray-600">{recommendation.deck.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getMetaColor(recommendation.metaPosition)}>
              {recommendation.metaPosition.replace('-', ' ')}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {recommendation.matchPercentage}% match
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{recommendation.estimatedWinrate}%</div>
            <div className="text-xs text-gray-600">Estimated Winrate</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${getDifficultyColor(recommendation.buildDifficulty)}`}>
              {recommendation.buildDifficulty}
            </div>
            <div className="text-xs text-gray-600">Build Difficulty</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{recommendation.deck.cards.length}</div>
            <div className="text-xs text-gray-600">Unique Cards</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{recommendation.missingCards.length}</div>
            <div className="text-xs text-gray-600">Missing Cards</div>
          </div>
        </div>

        {/* Top Reasons */}
        <div className="mb-4">
          <h4 className="font-medium text-sm text-gray-900 mb-2">Why This Deck?</h4>
          <div className="flex flex-wrap gap-2">
            {recommendation.reasons.slice(0, 3).map((reason, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {reason.title}
              </Badge>
            ))}
          </div>
        </div>

        {/* Missing Cards Summary */}
        {recommendation.missingCards.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-700 mb-2">
              Missing: {recommendation.missingCards.filter(c => c.priority === 'essential').length} essential,
              {' '}{recommendation.missingCards.filter(c => c.priority === 'important').length} important,
              {' '}{recommendation.missingCards.filter(c => c.priority === 'optional').length} optional
            </div>
            {recommendation.missingCards.slice(0, 3).map((missing, index) => (
              <Badge key={index} variant="outline" className="text-xs mr-2 mb-1">
                {missing.quantity}× {missing.card.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="outline"
            size="sm"
          >
            {expanded ? 'Show Less' : 'Show Details'}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Deck
            </Button>
            <Button variant="primary" size="sm">
              Build This Deck
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* All Reasons */}
              <div>
                <h5 className="font-medium text-sm text-gray-900 mb-3">Recommendation Reasons</h5>
                <div className="space-y-2">
                  {recommendation.reasons.map((reason, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-gray-800">{reason.title}</div>
                      <div className="text-gray-600">{reason.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Cards Detail */}
              {recommendation.missingCards.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm text-gray-900 mb-3">Missing Cards</h5>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {recommendation.missingCards.map((missing, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{missing.quantity}× {missing.card.name}</span>
                        <Badge
                          variant={missing.priority === 'essential' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {missing.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ArchetypeRecommendations: React.FC<{ preferences: UserPreferences }> = ({ preferences }) => {
  const [archetypes, setArchetypes] = useState<any[]>([]);

  useEffect(() => {
    const archetypeRecommendations = deckRecommendationService.getArchetypeRecommendations(preferences);
    setArchetypes(archetypeRecommendations);
  }, [preferences]);

  return (
    <div className="space-y-4">
      {archetypes.map((archetype, index) => (
        <Card key={archetype.archetype} className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{archetype.archetype}</h3>
                <p className="text-sm text-gray-600">{archetype.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{Math.round(archetype.matchScore * 100)}%</div>
                <div className="text-xs text-gray-600">Match</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Difficulty</div>
                <Badge variant="secondary" className="text-xs">
                  {archetype.difficulty}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Play Style</div>
                <Badge variant="outline" className="text-xs">
                  {archetype.playStyle}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Key Cards</div>
                <div className="text-xs text-gray-600">
                  {archetype.keyCards.join(', ')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const DeckUpgrades: React.FC = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <div className="text-gray-600">
          <div className="text-4xl mb-2">🔧</div>
          <p className="text-lg font-medium mb-2">Deck Upgrades</p>
          <p>Select a deck from your collection to see upgrade suggestions</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckRecommendations;