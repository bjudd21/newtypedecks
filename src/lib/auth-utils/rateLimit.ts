/**
 * Rate limiting for authentication attempts
 */

const attemptCounts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): {
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
      resetTime,
    };
  }

  // Increment counter
  attempts.count++;
  attempts.lastAttempt = now;

  return {
    allowed: true,
    remainingAttempts: maxAttempts - attempts.count,
  };
}
