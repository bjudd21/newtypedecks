/**
 * Social Service - Re-export for backward compatibility
 * All implementation moved to socialService/ directory
 */

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
} from './socialService/types';

export { socialService, SocialService } from './socialService/SocialService';
export { socialService as default } from './socialService/SocialService';
