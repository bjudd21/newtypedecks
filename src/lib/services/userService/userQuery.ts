/**
 * User Query Operations
 * Handles user list queries with filtering and pagination
 */

import { prisma } from '@/lib/database';
import type { Prisma } from '@prisma/client';
import type { UserListOptions, UserListResult } from './types';

/**
 * Get all users with pagination, search, and filtering
 */
export async function getAllUsers(
  options: UserListOptions = {}
): Promise<UserListResult> {
  const {
    page = 1,
    limit = 20,
    search,
    roleFilter,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.UserWhereInput = {
    ...(search && {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(roleFilter && { role: roleFilter }),
  };

  // Get total count
  const total = await prisma.user.count({ where });

  // Get users
  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    select: {
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
    },
  });

  // Transform users to include activity counts
  const usersWithActivity = users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    activity: {
      deckCount: (user as unknown as { _count: { decks: number } })._count.decks,
      collectionCount: (user as unknown as { _count: { collections: number } })._count.collections,
      submissionCount: (user as unknown as { _count: { submissions: number } })._count.submissions,
    },
  }));

  return {
    users: usersWithActivity,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
