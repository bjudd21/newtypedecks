'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { DeckAnalytics, DeckCard, deckAnalyticsService } from '@/lib/services/deckAnalyticsService';
import { DistributionChart } from './DistributionChart';
import { SuggestionsList } from './SuggestionsList';
import { CompetitiveRating } from './CompetitiveRating';

interface DeckAnalyticsDisplayProps {
  deckCards: DeckCard[];
  deckName?: string;
  className?: string;
  onAnalysisUpdate?: (analytics: DeckAnalytics) => void;
}

export const DeckAnalyticsDisplay: React.FC<DeckAnalyticsDisplayProps> = ({
  deckCards,
  deckName = 'Deck',
  className,
  onAnalysisUpdate
}) => {
  const [analytics, setAnalytics] = useState<DeckAnalytics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'distributions' | 'suggestions' | 'improvements'>('overview');

  // Analyze deck when cards change
  useEffect(() => {
    if (deckCards.length === 0) {
      setAnalytics(null);
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = deckAnalyticsService.analyzeDeck(deckCards);
      setAnalytics(result);
      onAnalysisUpdate?.(result);
    } catch (error) {
      console.error('Deck analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [deckCards, onAnalysisUpdate]);

  if (isAnalyzing) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing deck...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <p className="text-gray-600">Add cards to your deck to see analytics</p>
        </CardContent>
      </Card>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return 'text-green-600 bg-green-100';
    if (rating >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className={className}>
      {/* Header with Overall Rating */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{deckName} Analytics</span>
            <CompetitiveRating rating={analytics.competitiveRating} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalCards}</div>
              <div className="text-sm text-gray-600">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.uniqueCards}</div>
              <div className="text-sm text-gray-600">Unique Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.averageCost}</div>
              <div className="text-sm text-gray-600">Avg Cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.totalCost}</div>
              <div className="text-sm text-gray-600">Total Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Metrics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold">Card Efficiency</div>
              <div className={`text-2xl font-bold px-3 py-1 rounded-full inline-block ${getRatingColor(analytics.cardEfficiency * 10)}`}>
                {analytics.cardEfficiency}
              </div>
              <div className="text-xs text-gray-600 mt-1">Power-to-cost ratio</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Deck Balance</div>
              <div className={`text-2xl font-bold px-3 py-1 rounded-full inline-block ${getRatingColor(analytics.deckBalance)}`}>
                {analytics.deckBalance}%
              </div>
              <div className="text-xs text-gray-600 mt-1">Distribution balance</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Synergy Score</div>
              <div className={`text-2xl font-bold px-3 py-1 rounded-full inline-block ${getRatingColor(analytics.synergyScore)}`}>
                {analytics.synergyScore}%
              </div>
              <div className="text-xs text-gray-600 mt-1">Card interactions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'distributions', label: '📈 Distributions' },
              { id: 'suggestions', label: '💡 Suggestions' },
              { id: 'improvements', label: '⚡ Improvements' }
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
          <DistributionChart
            title="Card Types"
            data={analytics.typeDistribution}
            type="pie"
          />
          <DistributionChart
            title="Cost Distribution"
            data={analytics.costDistribution}
            type="bar"
          />
          <DistributionChart
            title="Rarity Distribution"
            data={analytics.rarityDistribution}
            type="pie"
          />
          <DistributionChart
            title="Faction Distribution"
            data={analytics.factionDistribution}
            type="pie"
          />
        </div>
      )}

      {activeTab === 'distributions' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Distribution Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Type Distribution Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Card Types</h4>
                  <div className="space-y-2">
                    {Object.entries(analytics.typeDistribution).map(([type, data]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{type}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {data.count} cards
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {data.percentage}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Curve Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cost Curve Analysis</h4>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {Array.from({ length: 8 }, (_, i) => {
                      const cost = i;
                      const data = analytics.costDistribution[cost] || { count: 0, percentage: 0 };
                      return (
                        <div key={cost} className="text-center">
                          <div className="text-xs font-medium text-gray-600">Cost {cost}+</div>
                          <div className="text-sm font-bold">{data.count}</div>
                          <div className="text-xs text-gray-500">{data.percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'suggestions' && (
        <SuggestionsList suggestions={analytics.suggestions} />
      )}

      {activeTab === 'improvements' && (
        <Card>
          <CardHeader>
            <CardTitle>Deck Improvements</CardTitle>
            <div className="text-sm text-gray-600">
              Recommended improvements based on competitive analysis
            </div>
          </CardHeader>
          <CardContent>
            {analytics.improvements.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <div className="text-4xl mb-2">🎉</div>
                <p>Your deck looks well-optimized!</p>
                <p className="text-sm">No major improvements detected.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.improvements.map((improvement, index) => {
                  const severityColors = {
                    minor: 'border-yellow-200 bg-yellow-50',
                    moderate: 'border-orange-200 bg-orange-50',
                    critical: 'border-red-200 bg-red-50'
                  };

                  const severityIcons = {
                    minor: '⚠️',
                    moderate: '⚡',
                    critical: '🚨'
                  };

                  return (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${severityColors[improvement.severity]}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-xl">{severityIcons[improvement.severity]}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs capitalize">
                              {improvement.category.replace('-', ' ')}
                            </Badge>
                            <Badge
                              variant={improvement.severity === 'critical' ? 'destructive' : 'secondary'}
                              className="text-xs capitalize"
                            >
                              {improvement.severity}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {improvement.description}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {improvement.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeckAnalyticsDisplay;