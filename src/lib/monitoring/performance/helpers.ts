/**
 * Performance monitoring helper functions and decorators
 */

import type { PerformanceEntry } from './types';
import type { PerformanceMonitor } from './PerformanceMonitor';

// Factory function to create helpers bound to a monitor instance
export function createHelpers(performanceMonitor: PerformanceMonitor) {
  return {
    measureAPI<T>(
      name: string,
      fn: () => T | Promise<T>,
      metadata?: Record<string, unknown>
    ) {
      return performanceMonitor.measure(name, 'api', fn, metadata);
    },

    measureDB<T>(
      name: string,
      fn: () => T | Promise<T>,
      metadata?: Record<string, unknown>
    ) {
      return performanceMonitor.measure(name, 'database', fn, metadata);
    },

    measureComponent<T>(
      name: string,
      fn: () => T | Promise<T>,
      metadata?: Record<string, unknown>
    ) {
      return performanceMonitor.measure(name, 'component', fn, metadata);
    },

    measureUserAction<T>(
      name: string,
      fn: () => T | Promise<T>,
      metadata?: Record<string, unknown>
    ) {
      return performanceMonitor.measure(name, 'user-action', fn, metadata);
    },

    // Performance decorator
    measurePerformance(type: PerformanceEntry['type'], operationName?: string) {
      return function <T extends (...args: unknown[]) => unknown>(
        target: unknown,
        propertyName: string,
        descriptor: TypedPropertyDescriptor<T>
      ) {
        const method = descriptor.value!;
        const name =
          operationName ||
          `${(target as { constructor: { name: string } }).constructor.name}.${propertyName}`;

        descriptor.value = function (this: unknown, ...args: unknown[]) {
          return performanceMonitor.measure(name, type, () =>
            method.apply(this, args)
          );
        } as T;

        return descriptor;
      };
    },
  };
}
