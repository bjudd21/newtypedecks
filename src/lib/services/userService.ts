/**
 * User Service
 *
 * Handles user management operations for admin panel
 */

import { prisma } from '@/lib/database';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

export class UserService {
  /**
   * Get all users with pagination, search, and filtering
   */
  static async getAllUsers(
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
    const where: unknown = {
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
        deckCount: user._count.decks,
        collectionCount: user._count.collections,
        submissionCount: user._count.submissions,
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

  /**
   * Get single user by ID with activity statistics
   */
  static async getUserById(id: string): Promise<UserWithActivity | null> {
    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      return null;
    }

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

  /**
   * Update user information
   */
  static async updateUser(
    id: string,
    data: UpdateUserData
  ): Promise<UserWithActivity> {
    // Validate email uniqueness if email is being updated
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new Error('Email already in use by another user');
      }
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.role && { role: data.role }),
        ...(hashedPassword && { password: hashedPassword }),
      },
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

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      image: updatedUser.image,
      role: updatedUser.role,
      emailVerified: updatedUser.emailVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      activity: {
        deckCount: updatedUser._count.decks,
        collectionCount: updatedUser._count.collections,
        submissionCount: updatedUser._count.submissions,
      },
    };
  }

  /**
   * Update user role
   */
  static async updateUserRole(
    id: string,
    role: UserRole
  ): Promise<UserWithActivity> {
    return this.updateUser(id, { role });
  }

  /**
   * Delete user account
   * This will cascade delete related records based on Prisma schema
   */
  static async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false;
    }
  }

  /**
   * Get overall user statistics for admin dashboard
   */
  static async getUserStatistics(): Promise<UserStatistics> {
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
  static async getUserActivity(id: string): Promise<UserActivity | null> {
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

  /**
   * Check if user exists by ID
   */
  static async userExists(id: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Check if email is already in use
   */
  static async emailExists(
    email: string,
    excludeUserId?: string
  ): Promise<boolean> {
    const count = await prisma.user.count({
      where: {
        email,
        ...(excludeUserId && { NOT: { id: excludeUserId } }),
      },
    });
    return count > 0;
  }
}
