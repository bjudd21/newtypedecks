'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Select } from '@/components/ui';
import { CompetitiveRating } from '@/components/analytics';
import { deckComparisonService, type DeckComparison, type ComparisonDeck } from '@/lib/services/deckComparisonService';
import type { DeckCard } from '@/lib/services/deckAnalyticsService';

interface DeckComparisonProps {
  decks: ComparisonDeck[];
  onRemoveDeck?: (deckId: string) => void;
  onAddDeck?: () => void;
  className?: string;
}

export const DeckComparison: React.FC<DeckComparisonProps> = ({
  decks,
  onRemoveDeck,
  onAddDeck,
  className
}) => {
  const [comparison, setComparison] = useState<DeckComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'differences' | 'matchups' | 'recommendations'>('overview');

  useEffect(() => {
    if (decks.length >= 2) {
      generateComparison();
    } else {
      setComparison(null);
    }
  }, [decks]);

  const generateComparison = async () => {
    if (decks.length < 2) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await deckComparisonService.compareDecks(decks);
      setComparison(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compare decks');
    } finally {
      setIsLoading(false);
    }
  };

  if (decks.length < 2) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <div className="text-gray-600 mb-4">
            <div className="text-4xl mb-2">⚖️</div>
            <p className="text-lg font-medium mb-2">Deck Comparison</p>
            <p>Add at least 2 decks to start comparing</p>
          </div>
          {onAddDeck && (
            <Button onClick={onAddDeck} variant="primary">
              Add Deck to Compare
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing deck comparison...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={generateComparison} variant="outline">
            Retry Comparison
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!comparison) return null;

  return (
    <div className={className}>
      {/* Deck List Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Comparing {comparison.decks.length} Decks</CardTitle>
            {onAddDeck && (
              <Button onClick={onAddDeck} variant="outline" size="sm">
                Add Another Deck
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparison.decks.map((deck) => (
              <div key={deck.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{deck.name}</h4>
                    {deck.description && (
                      <p className="text-xs text-gray-600 mt-1">{deck.description}</p>
                    )}
                  </div>
                  {onRemoveDeck && (
                    <Button
                      onClick={() => onRemoveDeck(deck.id)}
                      variant="outline"
                      size="sm"
                      className="ml-2 text-red-600 hover:bg-red-50"
                    >
                      ✕
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Cards:</span>
                    <span className="font-medium">
                      {deck.cards.reduce((sum, card) => sum + card.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Avg Cost:</span>
                    <span className="font-medium">
                      {deck.analytics?.averageCost.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  {deck.analytics && (
                    <CompetitiveRating
                      rating={deck.analytics.competitiveRating}
                      size="sm"
                      showLabel={false}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'differences', label: '🔍 Differences' },
              { id: 'matchups', label: '⚔️ Matchups' },
              { id: 'recommendations', label: '💡 Recommendations' }
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Deck Size</span>
                  <span className="font-medium">{comparison.summary.averageCardCount.toFixed(0)} cards</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Cost</span>
                  <span className="font-medium">{comparison.summary.averageCost.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Shared Cards</span>
                  <span className="font-medium">{comparison.summary.commonCards.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Most Diverse Aspect</span>
                  <Badge variant="secondary" className="text-xs">
                    {comparison.summary.mostDiverseAspect.replace('Distribution', '')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deck Relationships</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Most Similar Decks</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{getDeckName(comparison.summary.mostSimilarDecks[0])}</Badge>
                    <span className="text-gray-400">↔️</span>
                    <Badge variant="outline">{getDeckName(comparison.summary.mostSimilarDecks[1])}</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Most Different Decks</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{getDeckName(comparison.summary.mostDifferentDecks[0])}</Badge>
                    <span className="text-gray-400">⚔️</span>
                    <Badge variant="outline">{getDeckName(comparison.summary.mostDifferentDecks[1])}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Cards */}
          {comparison.summary.commonCards.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Shared Cards ({comparison.summary.commonCards.length})</CardTitle>
                <div className="text-sm text-gray-600">
                  Cards that appear in all compared decks
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {comparison.summary.commonCards.slice(0, 20).map((card) => (
                    <Badge key={card.id} variant="secondary" className="text-xs">
                      {card.name}
                    </Badge>
                  ))}
                  {comparison.summary.commonCards.length > 20 && (
                    <Badge variant="outline" className="text-xs">
                      +{comparison.summary.commonCards.length - 20} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'differences' && (
        <div className="space-y-6">
          {/* Competitive Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Competitive Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparison.decks.map((deck) => (
                  <div key={deck.id} className="flex items-center justify-between">
                    <span className="font-medium">{deck.name}</span>
                    <CompetitiveRating
                      rating={comparison.differences.competitiveRating[deck.id]}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {comparison.decks.map((deck) => (
              <Card key={deck.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{deck.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                        ✅ Strengths
                      </h4>
                      <ul className="text-sm space-y-1">
                        {comparison.differences.strengthsAndWeaknesses[deck.id]?.strengths.length > 0 ? (
                          comparison.differences.strengthsAndWeaknesses[deck.id].strengths.map((strength, index) => (
                            <li key={index} className="text-green-600">• {strength}</li>
                          ))
                        ) : (
                          <li className="text-gray-500">• No specific strengths identified</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                        ⚠️ Weaknesses
                      </h4>
                      <ul className="text-sm space-y-1">
                        {comparison.differences.strengthsAndWeaknesses[deck.id]?.weaknesses.length > 0 ? (
                          comparison.differences.strengthsAndWeaknesses[deck.id].weaknesses.map((weakness, index) => (
                            <li key={index} className="text-red-600">• {weakness}</li>
                          ))
                        ) : (
                          <li className="text-gray-500">• No major weaknesses identified</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'matchups' && comparison.winrateAnalysis && (
        <div className="space-y-6">
          {/* Predicted Winrates */}
          <Card>
            <CardHeader>
              <CardTitle>Predicted Overall Winrates</CardTitle>
              <div className="text-sm text-gray-600">
                Based on deck composition and competitive analysis
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(comparison.winrateAnalysis.predicted)
                  .sort(([,a], [,b]) => b - a)
                  .map(([deckId, winrate]) => (
                  <div key={deckId} className="flex items-center justify-between">
                    <span className="font-medium">{getDeckName(deckId)}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${winrate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">{winrate.toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Head-to-Head Matchups */}
          <Card>
            <CardHeader>
              <CardTitle>Head-to-Head Matchups</CardTitle>
              <div className="text-sm text-gray-600">
                Predicted winrates for direct matchups
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2"></th>
                      {comparison.decks.map(deck => (
                        <th key={deck.id} className="text-center p-2 min-w-20">
                          <div className="truncate" title={deck.name}>
                            {deck.name.substring(0, 8)}...
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.decks.map(deckA => (
                      <tr key={deckA.id} className="border-b">
                        <td className="font-medium p-2">
                          <div className="truncate" title={deckA.name}>
                            {deckA.name.substring(0, 12)}...
                          </div>
                        </td>
                        {comparison.decks.map(deckB => {
                          const winrate = comparison.winrateAnalysis?.matchups[deckA.id]?.[deckB.id] || 50;
                          const isWinning = winrate > 52;
                          const isLosing = winrate < 48;

                          return (
                            <td key={deckB.id} className="text-center p-2">
                              <span className={`px-1 py-0.5 rounded text-xs ${
                                deckA.id === deckB.id
                                  ? 'bg-gray-100 text-gray-600'
                                  : isWinning
                                    ? 'bg-green-100 text-green-700'
                                    : isLosing
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {deckA.id === deckB.id ? '-' : `${winrate.toFixed(0)}%`}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Meta Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {comparison.decks.map((deck) => (
              <Card key={deck.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{deck.name} Meta Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Meta Advantages</h4>
                      <ul className="text-sm space-y-1">
                        {comparison.winrateAnalysis?.metaAdvantages[deck.id]?.map((advantage, index) => (
                          <li key={index} className="text-green-600">• {advantage}</li>
                        )) || <li className="text-gray-500">• No specific advantages identified</li>}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">Meta Weaknesses</h4>
                      <ul className="text-sm space-y-1">
                        {comparison.winrateAnalysis?.metaWeaknesses[deck.id]?.map((weakness, index) => (
                          <li key={index} className="text-red-600">• {weakness}</li>
                        )) || <li className="text-gray-500">• No major weaknesses identified</li>}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {comparison.recommendations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-600">
                  <div className="text-4xl mb-2">🎯</div>
                  <p>No specific recommendations at this time</p>
                  <p className="text-sm">All decks appear well-optimized for their strategies</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            comparison.recommendations.map((recommendation, index) => {
              const priorityColors = {
                critical: 'border-red-500 bg-red-50',
                high: 'border-orange-500 bg-orange-50',
                medium: 'border-yellow-500 bg-yellow-50',
                low: 'border-blue-500 bg-blue-50'
              };

              const priorityIcons = {
                critical: '🚨',
                high: '⚠️',
                medium: '💡',
                low: 'ℹ️'
              };

              return (
                <Card key={index} className={`border-l-4 ${priorityColors[recommendation.priority]}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="text-xl">{priorityIcons[recommendation.priority]}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{recommendation.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Impact: {recommendation.impact}%
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                        <div className="text-xs text-gray-500">
                          Target: <span className="font-medium">{getDeckName(recommendation.targetDeck)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );

  function getDeckName(deckId: string): string {
    return comparison?.decks.find(d => d.id === deckId)?.name || deckId;
  }
};

export default DeckComparison;