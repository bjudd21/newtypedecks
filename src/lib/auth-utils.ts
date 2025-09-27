/**
 * Authentication utility functions
 *
 * Helper functions for password hashing, user creation, and authentication operations
 */

import bcrypt from 'bcryptjs';
import { prisma } from './database';
import { UserRole } from '@prisma/client';

// Password hashing configuration
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Create a new user with email and password
 */
export async function createUser(data: {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}): Promise<{ success: boolean; user?: any; error?: string }> {
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
      user,
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

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common patterns
  const commonPatterns = [
    /(.)\1{3,}/, // Four or more consecutive identical characters
    /123456/, // Sequential numbers
    /password/i, // Common word
    /qwerty/i, // Keyboard patterns
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password contains common patterns and is too weak');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  if (email.length > 254) {
    return {
      isValid: false,
      error: 'Email address is too long',
    };
  }

  return { isValid: true };
}

/**
 * Generate a secure random password
 */
export function generateRandomPassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = lowercase + uppercase + numbers + symbols;

  let password = '';

  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

/**
 * Rate limiting for authentication attempts
 */
const attemptCounts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): {
  allowed: boolean;
  remainingAttempts?: number;
  resetTime?: number;
} {
  const now = Date.now();
  const attempts = attemptCounts.get(identifier);

  if (!attempts) {
    attemptCounts.set(identifier, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  // Reset if window has passed
  if (now - attempts.lastAttempt > windowMs) {
    attemptCounts.set(identifier, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  // Check if limit exceeded
  if (attempts.count >= maxAttempts) {
    const resetTime = attempts.lastAttempt + windowMs;
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime
    };
  }

  // Increment counter
  attempts.count++;
  attempts.lastAttempt = now;

  return {
    allowed: true,
    remainingAttempts: maxAttempts - attempts.count
  };
}