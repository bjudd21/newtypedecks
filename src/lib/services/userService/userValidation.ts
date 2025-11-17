/**
 * User Validation Operations
 * Handles user existence and validation checks
 */

import { prisma } from '@/lib/database';

/**
 * Check if user exists by ID
 */
export async function userExists(id: string): Promise<boolean> {
  const count = await prisma.user.count({
    where: { id },
  });
  return count > 0;
}

/**
 * Check if email is already in use
 */
export async function emailExists(
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
