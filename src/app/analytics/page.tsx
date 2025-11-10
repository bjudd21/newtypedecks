/**
 * Analytics Page
 * Shows meta-game insights and deck statistics
 */

import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { MetaGameInsights } from '@/components/analytics';

export const metadata: Metadata = {
  title: 'Meta-Game Analytics | Gundam Card Game',
  description:
    'Explore meta-game trends, popular cards, and competitive deck analytics for the Gundam Card Game',
  keywords: [
    'gundam',
    'card game',
    'meta',
    'analytics',
    'statistics',
    'competitive',
    'deck analysis',
  ],
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Meta-Game Analytics
        </h1>
        <p className="mb-6 text-lg text-gray-600">
          Explore competitive trends, popular strategies, and statistical
          insights from the Gundam Card Game community.
        </p>

        {/* Key Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">2,847</div>
              <div className="text-sm text-gray-600">Decks Analyzed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">542</div>
              <div className="text-sm text-gray-600">Unique Cards</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-gray-600">Archetypes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <div className="text-sm text-gray-600">Meta Health</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Meta-Game Insights Component */}
      <MetaGameInsights />

      {/* Additional Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About Meta-Game Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-sm text-gray-600">
            <p className="mb-4">
              Our meta-game analytics system continuously analyzes thousands of
              competitive decks to provide real-time insights into the current
              state of the Gundam Card Game competitive scene.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">
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
                <h4 className="mb-2 font-semibold text-gray-900">
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

            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="text-xl text-blue-600">💡</div>
                <div>
                  <h4 className="mb-1 font-semibold text-blue-900">Pro Tip</h4>
                  <p className="text-blue-800">
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
