/**
 * Type definitions for user service
 */

import type { UserRole } from '@prisma/client';

export interface UserListOptions {
  page?: number;
  limit?: number;
  search?: string;
  roleFilter?: UserRole;
  sortBy?: 'name' | 'email' | 'createdAt' | 'role';
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResult {
  users: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserActivity {
  deckCount: number;
  collectionCount: number;
  submissionCount: number;
}

export interface UserWithActivity {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  activity: UserActivity;
}

export interface UserStatistics {
  total: number;
  byRole: {
    user: number;
    moderator: number;
    admin: number;
  };
  recentSignups: {
    last7Days: number;
    last30Days: number;
  };
  verified: number;
  unverified: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  password?: string;
}
