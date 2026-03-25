/**
 * Analytics Page
 * Shows meta-game insights and deck statistics
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { getGameBySlug } from '@/lib/database/games';

interface AnalyticsPageProps {
  params: Promise<{ gameSlug: string }>;
}

export async function generateMetadata({ params }: AnalyticsPageProps) {
  const { gameSlug } = await params;
  const game = await getGameBySlug(gameSlug);
  const gameName = game?.name ?? 'Card Game';
  return {
    title: `Meta-Game Analytics | ${gameName}`,
    description: `Explore meta-game trends, popular cards, and competitive deck analytics for ${gameName}`,
    keywords: [
      'card game',
      'meta',
      'analytics',
      'statistics',
      'competitive',
      'deck analysis',
    ],
  };
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { gameSlug } = await params;
  const game = await getGameBySlug(gameSlug);
  const gameName = game?.name ?? 'Card Game';
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          Meta-Game Analytics
        </h1>
        <p className="text-muted-foreground mb-6 text-lg">
          Explore competitive trends, popular strategies, and statistical
          insights from the {gameName} community.
        </p>

        {/* Key Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-primary text-2xl font-bold">2,847</div>
              <div className="text-muted-foreground text-sm">
                Decks Analyzed
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">542</div>
              <div className="text-muted-foreground text-sm">Unique Cards</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-primary text-2xl font-bold">23</div>
              <div className="text-muted-foreground text-sm">Archetypes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <div className="text-muted-foreground text-sm">Meta Health</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About Meta-Game Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose text-muted-foreground max-w-none text-sm">
            <p className="mb-4">
              Our meta-game analytics system continuously analyzes thousands of
              competitive decks to provide real-time insights into the current
              state of the {gameName} competitive scene.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-foreground mb-2 font-semibold">
                  Data Sources
                </h4>
                <ul className="space-y-1">
                  <li>• Tournament results and deck lists</li>
                  <li>• Community deck submissions</li>
                  <li>• Performance tracking across formats</li>
                  <li>• Win rate analysis and trends</li>
                </ul>
              </div>

              <div>
                <h4 className="text-foreground mb-2 font-semibold">
                  Key Metrics
                </h4>
                <ul className="space-y-1">
                  <li>• Card usage rates and popularity</li>
                  <li>• Archetype performance and win rates</li>
                  <li>• Meta diversity and balance scores</li>
                  <li>• Trending cards and strategies</li>
                </ul>
              </div>
            </div>

            <div className="border-border bg-accent mt-6 rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <div className="text-primary text-xl">💡</div>
                <div>
                  <h4 className="text-foreground mb-1 font-semibold">
                    Pro Tip
                  </h4>
                  <p className="text-muted-foreground">
                    Use the analytics data to inform your deck building
                    decisions. Look for underused cards that could give you a
                    competitive edge, or identify popular strategies to prepare
                    counters for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
