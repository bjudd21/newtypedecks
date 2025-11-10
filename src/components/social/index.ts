// Social components exports
export { UserProfile } from './UserProfile';
export { DeckRatings } from './DeckRatings';
export { DeckComments } from './DeckComments';

// Re-export types from services
export type {
  UserProfile as UserProfileType,
  DeckRating,
  DeckComment,
  SocialDeckData,
  UserStatistics,
  UserBadge,
  Follow,
  Notification,
  ActivityFeed,
  CommunityStats,
} from '@/lib/services/socialService';
