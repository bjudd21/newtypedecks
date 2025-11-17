/**
 * User CRUD Operations
 * Handles create, read, update, delete operations for users
 */

import { prisma } from '@/lib/database';
import type { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { UserWithActivity, UpdateUserData } from './types';

/**
 * Get single user by ID with activity statistics
 */
export async function getUserById(id: string): Promise<UserWithActivity | null> {
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
export async function updateUser(
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
export async function updateUserRole(
  id: string,
  role: UserRole
): Promise<UserWithActivity> {
  return updateUser(id, { role });
}

/**
 * Delete user account
 * This will cascade delete related records based on Prisma schema
 */
export async function deleteUser(id: string): Promise<boolean> {
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
