/**
 * Logger decorators
 * Performance and error logging decorators
 */

import type { Logger } from './Logger';

// Performance logging decorator
export function logPerformance(operation: string, logger: Logger) {
  return function <T extends (...args: unknown[]) => unknown>(
    target: unknown,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const method = descriptor.value!;

    descriptor.value = async function (this: unknown, ...args: unknown[]) {
      const start = Date.now();
      const component = `${(target as { constructor: { name: string } }).constructor.name}.${propertyName}`;

      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - start;
        logger.performanceLog(operation, duration, true, { component });
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        logger.performanceLog(operation, duration, false, { component });
        logger.error(`${operation} failed`, error as Error, { component });
        throw error;
      }
    } as T;

    return descriptor;
  };
}

// Error logging decorator
export function logErrors(component: string, logger: Logger) {
  return function <T extends (...args: unknown[]) => unknown>(
    target: unknown,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const method = descriptor.value!;

    descriptor.value = async function (this: unknown, ...args: unknown[]) {
      try {
        return await method.apply(this, args);
      } catch (error) {
        logger.error(`Method ${propertyName} failed`, error as Error, {
          component: `${component}.${propertyName}`,
          context: { args: args.slice(0, 3) }, // Log first 3 args only
        });
        throw error;
      }
    } as T;

    return descriptor;
  };
}
