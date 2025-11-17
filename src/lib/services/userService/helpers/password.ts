/**
 * Password helper functions
 * Handles password hashing and related operations
 */

import bcrypt from 'bcryptjs';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Hash password if provided, otherwise return undefined
 */
export async function hashPasswordIfProvided(
  password?: string
): Promise<string | undefined> {
  if (!password) {
    return undefined;
  }
  return hashPassword(password);
}
