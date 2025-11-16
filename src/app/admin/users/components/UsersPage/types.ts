/**
 * Type definitions for UsersPage
 */

import type { UserRole } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  emailVerified?: Date | string | null;
  createdAt?: Date | string;
  activity?: {
    decks: number;
    collections: number;
    submissions: number;
  };
}

export interface UserStatistics {
  total: number;
  byRole: {
    [key in UserRole]: number;
  };
  verified: number;
  unverified: number;
  recentSignups: {
    last7Days: number;
    last30Days: number;
  };
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
}
