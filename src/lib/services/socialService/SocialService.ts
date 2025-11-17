/**
 * Social Service - Main orchestrator
 * Maintains backward compatibility while delegating to focused service modules
 */

import * as profileService from './profileService';
import * as commentsService from './commentsService';
import * as ratingsService from './ratingsService';
import * as interactionsService from './interactionsService';
import * as activityService from './activityService';
import * as notificationsService from './notificationsService';
import * as communityService from './communityService';
import type {
  UserProfile,
  DeckComment,
  DeckRating,
  SocialDeckData,
  Notification,
  ActivityFeed,
  CommunityStats,
  UserBadge,
} from './types';

class SocialService {
  // ====================
  // User Profile Methods
  // ====================

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return profileService.getUserProfile(userId);
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    return profileService.updateUserProfile(userId, updates);
  }

  // ====================
  // Ratings Methods
  // ====================

  async getDeckRatings(
    deckId: string,
    page = 1,
    limit = 10
  ): Promise<{
    ratings: DeckRating[];
    totalCount: number;
    averageRating: number;
    ratingBreakdown: Record<number, number>;
  }> {
    return ratingsService.getDeckRatings(deckId, page, limit);
  }

  async submitDeckRating(
    deckId: string,
    userId: string,
    rating: number,
    review?: string
  ): Promise<DeckRating> {
    return ratingsService.submitDeckRating(deckId, userId, rating, review);
  }

  async voteCommentHelpful(
    ratingId: string,
    userId: string,
    isHelpful: boolean
  ): Promise<{ isHelpful: boolean; helpfulVotes: number }> {
    return ratingsService.voteCommentHelpful(ratingId, userId, isHelpful);
  }

  // ====================
  // Comments Methods
  // ====================

  async getDeckComments(
    deckId: string,
    page = 1,
    limit = 20
  ): Promise<{
    comments: DeckComment[];
    totalCount: number;
  }> {
    return commentsService.getDeckComments(deckId, page, limit);
  }

  async postDeckComment(
    deckId: string,
    userId: string,
    content: string,
    parentId?: string
  ): Promise<DeckComment> {
    return commentsService.postDeckComment(deckId, userId, content, parentId);
  }

  async toggleCommentLike(
    commentId: string,
    userId: string
  ): Promise<{ isLiked: boolean; likeCount: number }> {
    return commentsService.toggleCommentLike(commentId, userId);
  }

  // ====================
  // Social Interactions
  // ====================

  async toggleDeckLike(
    deckId: string,
    userId: string
  ): Promise<{ isLiked: boolean; likeCount: number }> {
    return interactionsService.toggleDeckLike(deckId, userId);
  }

  async toggleUserFollow(
    followingId: string,
    followerId: string
  ): Promise<{ isFollowing: boolean; followerCount: number }> {
    return interactionsService.toggleUserFollow(followingId, followerId);
  }

  // ====================
  // Activity & Feeds
  // ====================

  async getUserActivityFeed(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<ActivityFeed[]> {
    return activityService.getUserActivityFeed(userId, page, limit);
  }

  async getFollowingFeed(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<ActivityFeed[]> {
    return activityService.getFollowingFeed(userId, page, limit);
  }

  // ====================
  // Notifications
  // ====================

  async getUserNotifications(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<{
    notifications: Notification[];
    totalCount: number;
    unreadCount: number;
  }> {
    return notificationsService.getUserNotifications(userId, page, limit);
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    return notificationsService.markNotificationRead(notificationId);
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    return notificationsService.markAllNotificationsRead(userId);
  }

  // ====================
  // Community & Stats
  // ====================

  async getCommunityStats(): Promise<CommunityStats> {
    return communityService.getCommunityStats();
  }

  async searchUsers(query: string, limit = 10): Promise<UserProfile[]> {
    return communityService.searchUsers(query, limit);
  }

  async getPopularDecks(
    timeframe: 'day' | 'week' | 'month' | 'all' = 'week',
    limit = 10
  ): Promise<SocialDeckData[]> {
    return communityService.getPopularDecks(timeframe, limit);
  }

  async reportContent(
    contentType: string,
    contentId: string,
    userId: string,
    reason: string
  ): Promise<void> {
    return communityService.reportContent(contentType, contentId, userId, reason);
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return communityService.getUserBadges(userId);
  }
}

export const socialService = new SocialService();
export { SocialService };
