/**
 * Password strength validation
 */

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

  if (commonPatterns.some((pattern) => pattern.test(password))) {
    errors.push('Password contains common patterns and is too weak');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
