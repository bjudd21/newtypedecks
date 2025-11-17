/**
 * Email validation utilities
 */

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
