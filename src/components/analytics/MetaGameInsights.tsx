'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '@/components/ui';
import {
  MetaGameData,
  deckAnalyticsService,
} from '@/lib/services/deckAnalyticsService';

interface MetaGameInsightsProps {
  className?: string;
}

export const MetaGameInsights: React.FC<MetaGameInsightsProps> = ({
  className,
}) => {
  const [metaData, setMetaData] = useState<MetaGameData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'popular' | 'trending' | 'archetypes'
  >('overview');

  // Load meta-game data
  useEffect(() => {
    const loadMetaData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await deckAnalyticsService.getMetaGameData();
        setMetaData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load meta-game data'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadMetaData();
  }, []);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading meta-game data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <div className="mb-4 text-red-600">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!metaData) {
    return null;
  }

  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meta-Game Overview</CardTitle>
          <div className="text-sm text-gray-600">
            Current competitive landscape and deck trends
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metaData.metaBreakdown.controlDecks}%
              </div>
              <div className="text-sm text-gray-600">Control Decks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {metaData.metaBreakdown.aggroDecks}%
              </div>
              <div className="text-sm text-gray-600">Aggro Decks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metaData.metaBreakdown.midrangeDecks}%
              </div>
              <div className="text-sm text-gray-600">Midrange Decks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {metaData.metaBreakdown.comboDecks}%
              </div>
              <div className="text-sm text-gray-600">Combo Decks</div>
            </div>
          </div>

          {/* Meta breakdown visualization */}
          <div className="mt-4">
            <div className="flex h-4 overflow-hidden rounded-full bg-gray-200">
              <div
                className="bg-blue-500"
                style={{ width: `${metaData.metaBreakdown.controlDecks}%` }}
                title={`Control: ${metaData.metaBreakdown.controlDecks}%`}
              />
              <div
                className="bg-red-500"
                style={{ width: `${metaData.metaBreakdown.aggroDecks}%` }}
                title={`Aggro: ${metaData.metaBreakdown.aggroDecks}%`}
              />
              <div
                className="bg-green-500"
                style={{ width: `${metaData.metaBreakdown.midrangeDecks}%` }}
                title={`Midrange: ${metaData.metaBreakdown.midrangeDecks}%`}
              />
              <div
                className="bg-purple-500"
                style={{ width: `${metaData.metaBreakdown.comboDecks}%` }}
                title={`Combo: ${metaData.metaBreakdown.comboDecks}%`}
              />
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
              { id: 'popular', label: '🔥 Popular Cards' },
              { id: 'trending', label: '📈 Trending' },
              { id: 'archetypes', label: '🎯 Archetypes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as 'overview' | 'popular' | 'trending' | 'archetypes'
                  )
                }
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Meta Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Diversity Score</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: '78%' }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Balance Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-yellow-500"
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Innovation</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: '82%' }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="text-green-600">📈</div>
                  <div>
                    <div className="font-medium">Control decks rising</div>
                    <div className="text-gray-600">
                      +5.2% usage in the last week
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-red-600">📉</div>
                  <div>
                    <div className="font-medium">Aggro decks declining</div>
                    <div className="text-gray-600">
                      -3.8% usage in the last week
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-blue-600">🔄</div>
                  <div>
                    <div className="font-medium">New builds emerging</div>
                    <div className="text-gray-600">
                      12 new archetype variations
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'popular' && (
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Cards</CardTitle>
            <div className="text-sm text-gray-600">
              Cards seeing the most competitive play
            </div>
          </CardHeader>
          <CardContent>
            {metaData.popularCards.length === 0 ? (
              <div className="py-8 text-center text-gray-600">
                <p>No popular card data available</p>
                <p className="text-sm">
                  Check back later for updated meta-game information
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {metaData.popularCards.slice(0, 10).map((cardData, index) => (
                  <div
                    key={cardData.card.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{cardData.card.name}</div>
                        <div className="text-sm text-gray-600">
                          {cardData.card.type?.name} •{' '}
                          {cardData.card.rarity?.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {cardData.usageRate}% usage
                      </div>
                      <div className="text-sm text-gray-600">
                        {cardData.winRate}% win rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'trending' && (
        <Card>
          <CardHeader>
            <CardTitle>Trending Cards</CardTitle>
            <div className="text-sm text-gray-600">
              Cards increasing or decreasing in popularity
            </div>
          </CardHeader>
          <CardContent>
            {metaData.trendingCards.length === 0 ? (
              <div className="py-8 text-center text-gray-600">
                <p>No trending data available</p>
                <p className="text-sm">
                  Trends will appear as the meta develops
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {metaData.trendingCards.map((trendData, _index) => {
                  const trendColor =
                    trendData.trendDirection === 'up'
                      ? 'text-green-600'
                      : trendData.trendDirection === 'down'
                        ? 'text-red-600'
                        : 'text-gray-600';
                  const trendIcon =
                    trendData.trendDirection === 'up'
                      ? '📈'
                      : trendData.trendDirection === 'down'
                        ? '📉'
                        : '➡️';

                  return (
                    <div
                      key={trendData.card.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{trendIcon}</div>
                        <div>
                          <div className="font-medium">
                            {trendData.card.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {trendData.card.type?.name} • {trendData.periodDays}{' '}
                            day trend
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${trendColor}`}>
                          {trendData.changePercent > 0 ? '+' : ''}
                          {trendData.changePercent}%
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {trendData.trendDirection === 'up'
                            ? 'Rising'
                            : trendData.trendDirection === 'down'
                              ? 'Falling'
                              : 'Stable'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'archetypes' && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Archetypes</CardTitle>
            <div className="text-sm text-gray-600">
              Most successful deck archetypes in the current meta
            </div>
          </CardHeader>
          <CardContent>
            {metaData.popularArchetypes.length === 0 ? (
              <div className="py-8 text-center text-gray-600">
                <p>No archetype data available</p>
                <p className="text-sm">
                  Archetype analysis will appear as the meta develops
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {metaData.popularArchetypes.map((archetype, _index) => (
                  <div key={archetype.name} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold">
                          {archetype.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {archetype.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {archetype.winRate}%
                        </div>
                        <div className="text-sm text-gray-600">Win Rate</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Usage:</span>
                        <span className="font-medium">
                          {archetype.usageRate}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Key Cards:</span>
                        <span className="font-medium">
                          {archetype.keyCards.length}
                        </span>
                      </div>
                    </div>

                    {/* Key cards preview */}
                    {archetype.keyCards.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {archetype.keyCards.slice(0, 5).map((card) => (
                          <Badge
                            key={card.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {card.name}
                          </Badge>
                        ))}
                        {archetype.keyCards.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{archetype.keyCards.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MetaGameInsights;
