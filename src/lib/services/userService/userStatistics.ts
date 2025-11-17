/**
 * User Statistics Operations
 * Handles user statistics and activity metrics
 */

import { prisma } from '@/lib/database';
import { UserRole } from '@prisma/client';
import type { UserStatistics, UserActivity } from './types';

/**
 * Get overall user statistics for admin dashboard
 */
export async function getUserStatistics(): Promise<UserStatistics> {
  // Get total count
  const total = await prisma.user.count();

  // Get counts by role
  const [userCount, moderatorCount, adminCount] = await Promise.all([
    prisma.user.count({ where: { role: UserRole.USER } }),
    prisma.user.count({ where: { role: UserRole.MODERATOR } }),
    prisma.user.count({ where: { role: UserRole.ADMIN } }),
  ]);

  // Get counts for recent signups
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [last7Days, last30Days] = await Promise.all([
    prisma.user.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  // Get verified vs unverified counts
  const [verified, unverified] = await Promise.all([
    prisma.user.count({ where: { emailVerified: { not: null } } }),
    prisma.user.count({ where: { emailVerified: null } }),
  ]);

  return {
    total,
    byRole: {
      user: userCount,
      moderator: moderatorCount,
      admin: adminCount,
    },
    recentSignups: {
      last7Days,
      last30Days,
    },
    verified,
    unverified,
  };
}

/**
 * Get user activity details
 */
export async function getUserActivity(id: string): Promise<UserActivity | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      _count: {
        select: {
          decks: true,
          collections: true,
          submissions: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    deckCount: user._count.decks,
    collectionCount: user._count.collections,
    submissionCount: user._count.submissions,
  };
}
