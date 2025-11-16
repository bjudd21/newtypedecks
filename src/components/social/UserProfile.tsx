'use client';

import React, { useState, useEffect } from 'react';
import {
  socialService,
  type UserProfile as UserProfileType,
} from '@/lib/services/socialService';
import { useAuth } from '@/hooks';
import {
  LoadingState,
  ErrorState,
  ProfileHeader,
  TabNavigation,
  OverviewTab,
  DecksTab,
  ActivityTab,
  BadgesTab,
} from './UserProfile/';

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

  if (isLoading) {
    return <LoadingState className={className} />;
  }

  if (error || !profile) {
    return <ErrorState error={error} className={className} />;
  }

  return (
    <div className={className}>
      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        currentUser={currentUser}
        onFollowToggle={handleFollowToggle}
      />

      {/* Profile Tabs */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab profile={profile} />}
      {activeTab === 'decks' && <DecksTab />}
      {activeTab === 'activity' && <ActivityTab />}
      {activeTab === 'badges' && <BadgesTab profile={profile} />}
    </div>
  );
};

export default UserProfile;
