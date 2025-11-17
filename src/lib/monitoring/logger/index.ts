/**
 * Logger module exports
 */

// Export types
export type { LogLevel, LogEntry, LoggerConfig } from './types';

// Export main class
export { Logger } from './Logger';

// Create singleton logger instance
import { Logger } from './Logger';
import {
  createRequestLogger as createRequestLoggerFn,
  createComponentLogger as createComponentLoggerFn,
  createDomainLoggers,
} from './factories';
import { logPerformance as logPerformanceFn, logErrors as logErrorsFn } from './decorators';

// Create default logger instance
export const logger = new Logger();

// Export factory functions bound to default logger
export function createRequestLogger(
  requestId: string,
  userId?: string,
  component?: string
): Logger {
  return createRequestLoggerFn(logger, requestId, userId, component);
}

export function createComponentLogger(component: string): Logger {
  return createComponentLoggerFn(logger, component);
}

// Export decorators bound to default logger
export function logPerformance(operation: string) {
  return logPerformanceFn(operation, logger);
}

export function logErrors(component: string) {
  return logErrorsFn(component, logger);
}

// Create and export domain loggers
export const domainLoggers = createDomainLoggers(logger);

// Default export
export default logger;
