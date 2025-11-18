/**
 * Structured logging system
 * Provides consistent, structured logging across the application
 *
 * Re-exports from modularized structure for backward compatibility
 */

// Export types
export type { LogLevel, LogEntry, LoggerConfig } from './logger/types';

// Export main class
export { Logger } from './logger/Logger';

// Export singleton logger instance
export { logger } from './logger/index';

// Export factory functions
export { createRequestLogger, createComponentLogger } from './logger/index';

// Export decorators
export { logPerformance, logErrors } from './logger/index';

// Export domain loggers
export { domainLoggers } from './logger/index';

// Default export
export { default } from './logger/index';
