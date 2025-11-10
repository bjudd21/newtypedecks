/**
 * Token generation and validation utilities
 * Used for password resets and email verification
 */

import { randomBytes } from 'crypto';

/**
 * Generate a secure random token
 */
export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Generate token expiration time (1 hour from now)
 */
export function generateTokenExpiration(): Date {
  return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
}

/**
 * Generate email verification token expiration (24 hours from now)
 */
export function generateEmailVerificationExpiration(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
}

/**
 * Check if a token has expired
 */
export function isTokenExpired(expirationDate: Date): boolean {
  return new Date() > expirationDate;
}

/**
 * Generate a URL-safe token
 */
export function generateUrlSafeToken(): string {
  return randomBytes(32).toString('base64url');
}
