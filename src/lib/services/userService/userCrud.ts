/**
 * User CRUD Operations
 * Handles create, read, update, delete operations for users
 */

import { prisma } from '@/lib/database';
import type { UserRole } from '@prisma/client';
import type { UserWithActivity, UpdateUserData } from './types';
import { validateEmailUniqueness } from './helpers/validation';
import { hashPasswordIfProvided } from './helpers/password';
import {
  userSelectWithActivity,
  transformToUserWithActivity,
} from './helpers/transformers';

/**
 * Get single user by ID with activity statistics
 */
export async function getUserById(id: string): Promise<UserWithActivity | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelectWithActivity,
  });

  if (!user) {
    return null;
  }

  return transformToUserWithActivity(user);
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
    await validateEmailUniqueness(data.email, id);
  }

  // Hash password if provided
  const hashedPassword = await hashPasswordIfProvided(data.password);

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.role && { role: data.role }),
      ...(hashedPassword && { password: hashedPassword }),
    },
    select: userSelectWithActivity,
  });

  return transformToUserWithActivity(updatedUser);
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
