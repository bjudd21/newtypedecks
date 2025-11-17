/**
 * Social Service Module
 * Exports all social service functionality
 */

// Export types
export type {
  UserProfile,
  UserSocialPreferences,
  UserStatistics,
  UserBadge,
  DeckRating,
  DeckComment,
  SocialDeckData,
  Follow,
  Notification,
  ActivityFeed,
  CommunityStats,
} from './types';

// Export service modules
export * from './commentsService';
export * from './ratingsService';

// Export main service (default export for backward compatibility)
export { socialService, SocialService } from './SocialService';
export { socialService as default } from './SocialService';
