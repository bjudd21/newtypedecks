/**
 * User data transformation helpers
 * Functions for transforming user data between formats
 */

import type { UserRole } from '@prisma/client';
import type { UserWithActivity } from '../types';

/**
 * Prisma user select configuration for queries
 */
export const userSelectWithActivity = {
  id: true,
  email: true,
  name: true,
  image: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      decks: true,
      collections: true,
      submissions: true,
    },
  },
} as const;

/**
 * Transform Prisma user result to UserWithActivity
 */
export function transformToUserWithActivity(user: {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    decks: number;
    collections: number;
    submissions: number;
  };
}): UserWithActivity {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    activity: {
      deckCount: user._count.decks,
      collectionCount: user._count.collections,
      submissionCount: user._count.submissions,
    },
  };
}
