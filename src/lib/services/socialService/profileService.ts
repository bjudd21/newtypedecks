/**
 * User Profile Service
 * Handles user profile operations
 */

import type { UserProfile, UserSocialPreferences, UserStatistics } from './types';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  return {
    id: userId,
    username: 'placeholder_user',
    displayName: 'Placeholder User',
    bio: 'Passionate Gundam Card Game player and deck builder',
    joinDate: new Date('2024-01-15'),
    lastActive: new Date(),
    isVerified: false,
    preferences: {
      showRealName: true,
      showLocation: true,
      showDecks: true,
      showCollection: false,
      allowDirectMessages: true,
      emailNotifications: {
        comments: true,
        ratings: true,
        follows: true,
        deckLikes: false,
      },
    } as UserSocialPreferences,
    statistics: {
      totalDecks: 12,
      publicDecks: 8,
      deckLikes: 145,
      commentsGiven: 89,
      commentsReceived: 67,
      averageRating: 4.2,
      totalRatings: 23,
      followers: 34,
      following: 56,
      favoriteArchetype: 'Midrange Value',
    } as UserStatistics,
    badges: [],
  };
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  const currentProfile = await getUserProfile(userId);
  if (!currentProfile) {
    throw new Error('User not found');
  }
  return { ...currentProfile, ...updates };
}
