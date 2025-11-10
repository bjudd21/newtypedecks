// import type { CardWithRelations } from '@/lib/types/card';

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
  isPublic: boolean;
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

class SocialService {
  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    // This would fetch from database
    // For now, return mock data
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
      },
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
      },
      badges: [],
    };
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    // This would update in database
    const currentProfile = await this.getUserProfile(userId);
    if (!currentProfile) {
      throw new Error('User not found');
    }

    return { ...currentProfile, ...updates };
  }

  /**
   * Get deck ratings
   */
  async getDeckRatings(
    deckId: string,
    _page = 1,
    _limit = 10
  ): Promise<{
    ratings: DeckRating[];
    totalCount: number;
    averageRating: number;
    ratingBreakdown: Record<number, number>; // star -> count
  }> {
    // Mock implementation
    const mockRatings: DeckRating[] = [
      {
        id: '1',
        deckId,
        userId: 'user1',
        userName: 'CompetitivePlayer',
        rating: 5,
        review:
          'Excellent deck! Very consistent and competitive. The synergy between cards is outstanding.',
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15'),
        helpfulVotes: 8,
      },
      {
        id: '2',
        deckId,
        userId: 'user2',
        userName: 'CasualGamer',
        rating: 4,
        review:
          'Fun to play but requires some expensive cards. Great for local tournaments.',
        createdAt: new Date('2024-03-14'),
        updatedAt: new Date('2024-03-14'),
        helpfulVotes: 3,
      },
    ];

    return {
      ratings: mockRatings,
      totalCount: 23,
      averageRating: 4.3,
      ratingBreakdown: {
        5: 12,
        4: 7,
        3: 3,
        2: 1,
        1: 0,
      },
    };
  }

  /**
   * Submit deck rating
   */
  async submitDeckRating(
    deckId: string,
    userId: string,
    rating: number,
    review?: string
  ): Promise<DeckRating> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // This would save to database
    return {
      id: `rating_${Date.now()}`,
      deckId,
      userId,
      userName: 'CurrentUser',
      rating,
      review,
      createdAt: new Date(),
      updatedAt: new Date(),
      helpfulVotes: 0,
    };
  }

  /**
   * Get deck comments
   */
  async getDeckComments(
    deckId: string,
    _page = 1,
    _limit = 20
  ): Promise<{
    comments: DeckComment[];
    totalCount: number;
  }> {
    // Mock implementation
    const mockComments: DeckComment[] = [
      {
        id: '1',
        deckId,
        userId: 'user1',
        userName: 'StrategyExpert',
        content:
          'Love the inclusion of Mobile Suit Gundam in the main deck. Have you considered adding more Command cards for better control?',
        createdAt: new Date('2024-03-16T10:30:00'),
        updatedAt: new Date('2024-03-16T10:30:00'),
        likes: 5,
        replies: [
          {
            id: '1-1',
            deckId,
            userId: 'author',
            userName: 'DeckAuthor',
            content:
              'Thanks for the suggestion! I tried that in earlier versions but found it made the deck too slow.',
            createdAt: new Date('2024-03-16T14:15:00'),
            updatedAt: new Date('2024-03-16T14:15:00'),
            parentId: '1',
            likes: 2,
          },
        ],
      },
      {
        id: '2',
        deckId,
        userId: 'user2',
        userName: 'NewPlayer',
        content: 'Great beginner-friendly deck! Easy to pilot and understand.',
        createdAt: new Date('2024-03-15T16:45:00'),
        updatedAt: new Date('2024-03-15T16:45:00'),
        likes: 3,
      },
    ];

    return {
      comments: mockComments,
      totalCount: 12,
    };
  }

  /**
   * Post comment on deck
   */
  async postDeckComment(
    deckId: string,
    userId: string,
    content: string,
    parentId?: string
  ): Promise<DeckComment> {
    if (!content.trim()) {
      throw new Error('Comment cannot be empty');
    }

    // This would save to database
    return {
      id: `comment_${Date.now()}`,
      deckId,
      userId,
      userName: 'CurrentUser',
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId,
      likes: 0,
      isOwner: true,
    };
  }

  /**
   * Like/unlike deck
   */
  async toggleDeckLike(
    _deckId: string,
    _userId: string
  ): Promise<{ isLiked: boolean; likeCount: number }> {
    // This would update in database
    return {
      isLiked: true, // Toggled state
      likeCount: 42, // Updated count
    };
  }

  /**
   * Follow/unfollow user
   */
  async toggleUserFollow(
    _followingId: string,
    _followerId: string
  ): Promise<{ isFollowing: boolean; followerCount: number }> {
    // This would update in database
    return {
      isFollowing: true, // Toggled state
      followerCount: 35, // Updated count
    };
  }

  /**
   * Get user's activity feed
   */
  async getUserActivityFeed(
    userId: string,
    _page = 1,
    _limit = 20
  ): Promise<ActivityFeed[]> {
    // Mock implementation
    return [
      {
        id: '1',
        type: 'deck_created',
        userId: 'user1',
        userName: 'CompetitivePlayer',
        title: 'Created a new deck',
        description: 'Aggro Rush Tournament Build',
        createdAt: new Date('2024-03-16T09:00:00'),
      },
      {
        id: '2',
        type: 'comment_posted',
        userId: 'user2',
        userName: 'StrategyExpert',
        title: 'Commented on',
        description: 'Control Lock Meta Analysis deck',
        createdAt: new Date('2024-03-15T14:30:00'),
      },
    ];
  }

  /**
   * Get following feed (activity from users you follow)
   */
  async getFollowingFeed(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<ActivityFeed[]> {
    // This would get activity from followed users
    return this.getUserActivityFeed(userId, page, limit);
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
    unreadOnly = false
  ): Promise<Notification[]> {
    // Mock implementation
    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId,
        type: 'comment',
        title: 'New comment on your deck',
        message: 'StrategyExpert commented on "Aggro Rush Build"',
        data: { deckId: 'deck123', commentId: 'comment456' },
        isRead: false,
        createdAt: new Date('2024-03-16T11:00:00'),
      },
      {
        id: '2',
        userId,
        type: 'like',
        title: 'Your deck was liked',
        message: 'CompetitivePlayer liked "Control Lock Meta"',
        data: { deckId: 'deck789' },
        isRead: false,
        createdAt: new Date('2024-03-15T16:30:00'),
      },
    ];

    return unreadOnly
      ? mockNotifications.filter((n) => !n.isRead)
      : mockNotifications;
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(_notificationId: string): Promise<void> {
    // This would update in database
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(_userId: string): Promise<void> {
    // This would update all user notifications in database
  }

  /**
   * Get community statistics
   */
  async getCommunityStats(): Promise<CommunityStats> {
    return {
      totalUsers: 2847,
      activeUsers: 892,
      totalDecks: 5421,
      publicDecks: 3256,
      totalComments: 8934,
      totalRatings: 4567,
      averageRating: 4.2,
      topArchetypes: [
        { name: 'Aggro Rush', count: 1230, percentage: 25 },
        { name: 'Control Lock', count: 984, percentage: 20 },
        { name: 'Midrange Value', count: 738, percentage: 15 },
        { name: 'Combo Engine', count: 615, percentage: 13 },
      ],
      recentActivity: await this.getUserActivityFeed('community', 1, 10),
    };
  }

  /**
   * Search users
   */
  async searchUsers(query: string, _limit = 10): Promise<UserProfile[]> {
    // This would search users in database
    // For now, return empty array
    return [];
  }

  /**
   * Get popular decks (social metrics based)
   */
  async getPopularDecks(
    _timeframe: 'day' | 'week' | 'month' | 'all' = 'week',
    _limit = 20
  ): Promise<SocialDeckData[]> {
    // Mock implementation
    return [
      {
        id: 'deck1',
        name: 'Tournament Aggro Rush',
        description: 'Fast and consistent aggro build for competitive play',
        authorId: 'user1',
        authorName: 'CompetitivePlayer',
        isPublic: true,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-15'),
        tags: ['aggro', 'tournament', 'meta'],
        archetype: 'Aggro Rush',
        format: 'Standard',
        likes: 89,
        views: 1247,
        comments: 23,
        averageRating: 4.6,
        totalRatings: 31,
      },
    ];
  }

  /**
   * Report content (comment, deck, user)
   */
  async reportContent(
    _type: 'comment' | 'deck' | 'user',
    _contentId: string,
    _reporterId: string,
    _reason: string,
    _description?: string
  ): Promise<void> {
    // This would create a report in database for moderation
  }

  /**
   * Get user badges and achievements
   */
  async getUserBadges(_userId: string): Promise<UserBadge[]> {
    // Mock implementation
    return [
      {
        id: 'badge1',
        name: 'Deck Builder',
        description: 'Created your first public deck',
        icon: '🏗️',
        color: 'blue',
        earnedAt: new Date('2024-02-01'),
        rarity: 'common',
      },
      {
        id: 'badge2',
        name: 'Community Helper',
        description: 'Received 50+ helpful votes on reviews',
        icon: '🤝',
        color: 'green',
        earnedAt: new Date('2024-03-01'),
        rarity: 'uncommon',
      },
    ];
  }

  /**
   * Vote comment as helpful/unhelpful
   */
  async voteCommentHelpful(
    _commentId: string,
    _userId: string,
    _isHelpful: boolean
  ): Promise<{ helpfulVotes: number }> {
    // This would update in database
    return { helpfulVotes: 12 };
  }

  /**
   * Like/unlike comment
   */
  async toggleCommentLike(
    _commentId: string,
    _userId: string
  ): Promise<{ isLiked: boolean; likeCount: number }> {
    // This would update in database
    return {
      isLiked: true,
      likeCount: 8,
    };
  }
}

export const socialService = new SocialService();
