/**
 * Community Page
 * Social hub featuring user profiles, popular decks, and community activity
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { UserProfile } from '@/components/social';
import { socialService, type CommunityStats, type SocialDeckData, type ActivityFeed } from '@/lib/services/socialService';
import { useAuth } from '@/hooks';

export default function CommunityPage() {
  const { isAuthenticated, user } = useAuth();
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [popularDecks, setPopularDecks] = useState<SocialDeckData[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'popular' | 'activity' | 'leaderboard'>('overview');

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setIsLoading(true);

    try {
      const [stats, decks, activity] = await Promise.all([
        socialService.getCommunityStats(),
        socialService.getPopularDecks('week', 10),
        socialService.getUserActivityFeed('community', 1, 20)
      ]);

      setCommunityStats(stats);
      setPopularDecks(decks);
      setRecentActivity(activity);
    } catch (error) {
      console.error('Failed to load community data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deck_created': return '🃏';
      case 'deck_liked': return '❤️';
      case 'comment_posted': return '💬';
      case 'rating_given': return '⭐';
      case 'user_followed': return '👥';
      case 'badge_earned': return '🏆';
      default: return '📈';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Community Hub
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Connect with fellow players, discover popular decks, and join the conversation about the Gundam Card Game.
        </p>

        {/* Community Stats */}
        {communityStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(communityStats.totalUsers)}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(communityStats.publicDecks)}
              </div>
              <div className="text-sm text-gray-600">Public Decks</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(communityStats.totalComments)}
              </div>
              <div className="text-sm text-gray-600">Comments</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {communityStats.averageRating.toFixed(1)}★
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: '🏠 Overview' },
              { id: 'popular', label: '🔥 Popular Decks' },
              { id: 'activity', label: '📈 Recent Activity' },
              { id: 'leaderboard', label: '🏆 Leaderboard' }
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
          {/* Popular Archetypes */}
          {communityStats && (
            <Card>
              <CardHeader>
                <CardTitle>Popular Archetypes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communityStats.topArchetypes.map((archetype, index) => (
                    <div key={archetype.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <span className="font-medium">{archetype.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-600">{archetype.count} decks</div>
                        <Badge variant="secondary" className="text-xs">
                          {archetype.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Community Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="text-lg">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-medium">{activity.userName}</span>{' '}
                        {activity.title.toLowerCase()}{' '}
                        <span className="text-blue-600">{activity.description}</span>
                      </div>
                      <div className="text-xs text-gray-500">{formatTimeAgo(activity.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Decks */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>This Week's Popular Decks</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularDecks.slice(0, 4).map((deck) => (
                  <div key={deck.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{deck.name}</h4>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-400">★</span>
                        <span>{deck.averageRating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{deck.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">by {deck.authorName}</span>
                        {deck.archetype && (
                          <Badge variant="outline" className="text-xs">
                            {deck.archetype}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <span>❤️ {deck.likes}</span>
                        <span>💬 {deck.comments}</span>
                        <span>👁️ {deck.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'popular' && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Decks This Week</CardTitle>
            <div className="text-sm text-gray-600">
              Decks with the most likes, comments, and views
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading popular decks...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {popularDecks.map((deck, index) => (
                  <div key={deck.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{deck.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm font-medium">{deck.averageRating.toFixed(1)}</span>
                              <span className="text-sm text-gray-500">({deck.totalRatings})</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3">{deck.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">by {deck.authorName}</span>
                            {deck.archetype && (
                              <Badge variant="secondary">{deck.archetype}</Badge>
                            )}
                            {deck.format && (
                              <Badge variant="outline">{deck.format}</Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>❤️ {deck.likes}</span>
                            <span>💬 {deck.comments}</span>
                            <span>👁️ {formatNumber(deck.views)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Community Activity</CardTitle>
            <div className="text-sm text-gray-600">
              Latest updates from the community
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading activity...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg">
                      {getActivityIcon(activity.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-medium text-gray-900">{activity.userName}</span>{' '}
                          <span className="text-gray-700">{activity.title.toLowerCase()}</span>{' '}
                          <span className="text-blue-600 font-medium">{activity.description}</span>
                        </div>
                        <span className="text-sm text-gray-500">{formatTimeAgo(activity.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'leaderboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Deck Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-600">
                <div className="text-4xl mb-2">🏆</div>
                <p>Leaderboard coming soon!</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Most Helpful Reviewers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-600">
                <div className="text-4xl mb-2">⭐</div>
                <p>Coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Join Community Section */}
      {!isAuthenticated && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Join Our Community!</h3>
            <p className="text-blue-700 mb-4">
              Create an account to share your decks, leave comments, rate builds, and connect with other players.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="primary">
                Sign Up Free
              </Button>
              <Button variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Community Guidelines */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Be Respectful</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Treat all community members with respect</li>
              <li>• Provide constructive feedback on decks</li>
              <li>• Keep discussions focused on the game</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Share Quality Content</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Test your decks before sharing</li>
              <li>• Write helpful descriptions and strategies</li>
              <li>• Credit original creators when appropriate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}