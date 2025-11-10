'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import {
  socialService,
  type UserProfile as UserProfileType,
} from '@/lib/services/socialService';
import { useAuth } from '@/hooks';

interface UserProfileProps {
  userId: string;
  isOwnProfile?: boolean;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  isOwnProfile = false,
  className,
}) => {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [_followerCount, setFollowerCount] = useState(0);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'decks' | 'activity' | 'badges'
  >('overview');

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userProfile = await socialService.getUserProfile(userId);
      if (userProfile) {
        setProfile(userProfile);
        setFollowerCount(userProfile.statistics.followers);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !profile) return;

    try {
      const result = await socialService.toggleUserFollow(
        profile.id,
        currentUser.id
      );
      setIsFollowing(result.isFollowing);
      setFollowerCount(result.followerCount);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };

  const getLastActiveText = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Active today';
    if (diffDays === 1) return 'Active yesterday';
    if (diffDays < 7) return `Active ${diffDays} days ago`;
    if (diffDays < 30) return `Active ${Math.floor(diffDays / 7)} weeks ago`;
    return `Last seen ${Math.floor(diffDays / 30)} months ago`;
  };

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'uncommon':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <div className="mb-4 text-red-600">⚠️</div>
          <p className="text-gray-600">{error || 'Profile not found'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.displayName}
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-2xl font-bold text-white">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.displayName}
                </h1>
                {profile.isVerified && (
                  <Badge variant="primary" className="bg-blue-600 text-white">
                    ✓ Verified
                  </Badge>
                )}
              </div>

              <p className="mb-1 text-gray-600">@{profile.username}</p>
              {profile.bio && (
                <p className="mb-3 text-gray-700">{profile.bio}</p>
              )}

              <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                <span>📅 Joined {formatJoinDate(profile.joinDate)}</span>
                <span>⏰ {getLastActiveText(profile.lastActive)}</span>
                {profile.location && profile.preferences.showLocation && (
                  <span>📍 {profile.location}</span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🔗 Website
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="mb-4 flex items-center gap-6">
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {profile.statistics.followers}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {profile.statistics.following}
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {profile.statistics.publicDecks}
                  </div>
                  <div className="text-sm text-gray-600">Public Decks</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {profile.statistics.deckLikes}
                  </div>
                  <div className="text-sm text-gray-600">Total Likes</div>
                </div>
              </div>

              {/* Actions */}
              {!isOwnProfile && currentUser && (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleFollowToggle}
                    variant={isFollowing ? 'outline' : 'default'}
                    size="sm"
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                  <Button variant="outline" size="sm">
                    💬 Message
                  </Button>
                </div>
              )}

              {isOwnProfile && (
                <div className="flex items-center gap-3">
                  <Button variant="default" size="sm">
                    ✏️ Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    ⚙️ Settings
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'decks', label: '🃏 Decks' },
              { id: 'activity', label: '📈 Activity' },
              { id: 'badges', label: '🏆 Badges' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as 'overview' | 'decks' | 'activity' | 'badges'
                  )
                }
                className={`border-b-2 px-1 py-3 text-sm font-medium ${
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
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Decks</span>
                  <span className="font-medium">
                    {profile.statistics.totalDecks}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Public Decks</span>
                  <span className="font-medium">
                    {profile.statistics.publicDecks}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {profile.statistics.averageRating.toFixed(1)}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= Math.round(profile.statistics.averageRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Comments Given</span>
                  <span className="font-medium">
                    {profile.statistics.commentsGiven}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Comments Received</span>
                  <span className="font-medium">
                    {profile.statistics.commentsReceived}
                  </span>
                </div>
                {profile.statistics.favoriteArchetype && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Favorite Archetype</span>
                    <Badge variant="secondary">
                      {profile.statistics.favoriteArchetype}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    🃏
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Created new deck</div>
                    <div className="text-gray-600">
                      Tournament Aggro Build • 2 hours ago
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    💬
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Commented on deck</div>
                    <div className="text-gray-600">
                      Control Lock Meta Analysis • 1 day ago
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    ⭐
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Rated deck</div>
                    <div className="text-gray-600">
                      Midrange Value Engine • 3 days ago
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'decks' && (
        <Card>
          <CardHeader>
            <CardTitle>Public Decks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center text-gray-600">
              <div className="mb-2 text-4xl">🃏</div>
              <p>Deck list will be loaded here</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center text-gray-600">
              <div className="mb-2 text-4xl">📈</div>
              <p>Activity feed will be loaded here</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'badges' && (
        <Card>
          <CardHeader>
            <CardTitle>Badges & Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.badges.length === 0 ? (
              <div className="py-8 text-center text-gray-600">
                <div className="mb-2 text-4xl">🏆</div>
                <p>No badges earned yet</p>
                <p className="text-sm">Complete activities to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {profile.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`rounded-lg p-4 ${getBadgeRarityColor(badge.rarity)}`}
                  >
                    <div className="text-center">
                      <div className="mb-2 text-3xl">{badge.icon}</div>
                      <div className="font-semibold">{badge.name}</div>
                      <div className="text-sm opacity-90">
                        {badge.description}
                      </div>
                      <div className="mt-2 text-xs opacity-75">
                        Earned {new Date(badge.earnedAt).toLocaleDateString()}
                      </div>
                    </div>
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

export default UserProfile;
