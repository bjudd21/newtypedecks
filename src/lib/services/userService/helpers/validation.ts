/**
 * User validation helpers
 * Helper functions for validating user data
 */

import { prisma } from '@/lib/database';

/**
 * Check if email is already in use by another user
 */
export async function validateEmailUniqueness(
  email: string,
  excludeUserId?: string
): Promise<void> {
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      ...(excludeUserId && { NOT: { id: excludeUserId } }),
    },
  });

  if (existingUser) {
    throw new Error('Email already in use by another user');
  }
}
