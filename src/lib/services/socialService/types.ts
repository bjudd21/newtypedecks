/**
 * Type definitions for social service
 */

import type { DeckVisibility } from '@prisma/client';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  joinDate: Date;
  lastActive: Date;
  isVerified: boolean;
  preferences: UserSocialPreferences;
  statistics: UserStatistics;
  badges: UserBadge[];
}

export interface UserSocialPreferences {
  showRealName: boolean;
  showLocation: boolean;
  showDecks: boolean;
  showCollection: boolean;
  allowDirectMessages: boolean;
  emailNotifications: {
    comments: boolean;
    ratings: boolean;
    follows: boolean;
    deckLikes: boolean;
  };
}

export interface UserStatistics {
  totalDecks: number;
  publicDecks: number;
  deckLikes: number;
  commentsGiven: number;
  commentsReceived: number;
  averageRating: number;
  totalRatings: number;
  followers: number;
  following: number;
  tournamentWins?: number;
  favoriteArchetype?: string;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface DeckRating {
  id: string;
  deckId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  review?: string;
  createdAt: Date;
  updatedAt: Date;
  helpfulVotes: number;
  isHelpful?: boolean; // Current user's helpful vote
}

export interface DeckComment {
  id: string;
  deckId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
  parentId?: string; // For replies
  replies?: DeckComment[];
  likes: number;
  isLiked?: boolean; // Current user's like status
  isOwner?: boolean; // If current user owns this comment
  isPinned?: boolean;
}

export interface SocialDeckData {
  id: string;
  name: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  visibility: DeckVisibility;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  archetype?: string;
  format?: string;

  // Social metrics
  likes: number;
  views: number;
  comments: number;
  averageRating: number;
  totalRatings: number;

  // Current user interactions
  isLiked?: boolean;
  userRating?: number;
  isFollowingAuthor?: boolean;
  isFavorited?: boolean;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type:
    | 'comment'
    | 'rating'
    | 'like'
    | 'follow'
    | 'deck_featured'
    | 'badge_earned';
  title: string;
  message: string;
  data?: Record<string, unknown>; // Additional data like deck ID, comment ID, etc.
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface ActivityFeed {
  id: string;
  type:
    | 'deck_created'
    | 'deck_liked'
    | 'comment_posted'
    | 'rating_given'
    | 'user_followed'
    | 'badge_earned';
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  data?: Record<string, unknown>;
  createdAt: Date;
}

export interface CommunityStats {
  totalUsers: number;
  activeUsers: number; // Last 30 days
  totalDecks: number;
  publicDecks: number;
  totalComments: number;
  totalRatings: number;
  averageRating: number;
  topArchetypes: { name: string; count: number; percentage: number }[];
  recentActivity: ActivityFeed[];
}
