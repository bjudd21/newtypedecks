/**
 * User database operations
 */

import { prisma } from '../database';
import { UserRole } from '@prisma/client';
import { hashPassword } from './passwordHashing';

/**
 * Create a new user with email and password
 */
export async function createUser(data: {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}): Promise<{
  success: boolean;
  user?: import('@prisma/client').User;
  error?: string;
}> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists',
      };
    }

    // Hash the password
    const hashedPassword = await hashPassword(data.password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || UserRole.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      user: user as import('@prisma/client').User,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: 'Failed to create user',
    };
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return {
      success: false,
      error: 'Failed to update password',
    };
  }
}
