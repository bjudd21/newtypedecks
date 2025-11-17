/**
 * Authentication monitoring wrapper
 */

import { logger } from '../logger';
import { businessMetrics } from '../analytics';
import { errorTracker } from '../sentry';
import { measureAPI } from '../performance';

// Authentication monitoring wrapper
export async function monitorAuth<T>(
  action: string,
  authFunction: () => Promise<T>,
  userId?: string
): Promise<T> {
  return (await measureAPI(
    `Auth ${action}`,
    async () => {
      try {
        const result = await authFunction();

        // Log successful auth action
        logger.authLog(action, userId, true);
        businessMetrics.trackUserLogin(userId || 'unknown', 'email'); // Default to email

        return result;
      } catch (error) {
        // Log failed auth action
        logger.authLog(action, userId, false);
        errorTracker.captureException(error as Error, {
          auth: { action, userId, success: false },
        });
        throw error;
      }
    },
    { action, userId }
  )) as Promise<T>;
}
