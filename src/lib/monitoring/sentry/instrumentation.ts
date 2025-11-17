/**
 * Custom function instrumentation
 */

import { errorTracker } from './errorTracker';
import { performanceMonitor } from './performanceMonitor';

// Custom instrumentation
export function instrumentFunction<T extends (...args: unknown[]) => unknown>(
  fn: T,
  name: string,
  category: string = 'function'
): T {
  return ((...args: Parameters<T>) => {
    const start = Date.now();

    try {
      const result = fn(...args);

      // Handle promises
      if (result && typeof (result as { then?: unknown }).then === 'function') {
        return (result as Promise<unknown>)
          .then((value: unknown) => {
            performanceMonitor.trackAPICall(
              name,
              category,
              Date.now() - start,
              true
            );
            return value;
          })
          .catch((error: Error) => {
            performanceMonitor.trackAPICall(
              name,
              category,
              Date.now() - start,
              false
            );
            errorTracker.captureException(error, { function: name, category });
            throw error;
          });
      }

      performanceMonitor.trackAPICall(name, category, Date.now() - start, true);
      return result;
    } catch (error) {
      performanceMonitor.trackAPICall(
        name,
        category,
        Date.now() - start,
        false
      );
      errorTracker.captureException(error as Error, {
        function: name,
        category,
      });
      throw error;
    }
  }) as T;
}
