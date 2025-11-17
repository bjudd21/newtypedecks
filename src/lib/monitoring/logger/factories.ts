/**
 * Logger factory functions
 * Create specialized logger instances
 */

import type { Logger } from './Logger';

// Request-specific logger creator
export function createRequestLogger(
  logger: Logger,
  requestId: string,
  userId?: string,
  component?: string
): Logger {
  return logger.child({ requestId, userId, component });
}

// Component-specific logger creator
export function createComponentLogger(logger: Logger, component: string): Logger {
  return logger.child({ component });
}

// Create domain-specific loggers
export function createDomainLoggers(logger: Logger) {
  return {
    auth: createComponentLogger(logger, 'Auth'),
    api: createComponentLogger(logger, 'API'),
    database: createComponentLogger(logger, 'Database'),
    upload: createComponentLogger(logger, 'Upload'),
    email: createComponentLogger(logger, 'Email'),
    cache: createComponentLogger(logger, 'Cache'),
    deck: createComponentLogger(logger, 'Deck'),
    card: createComponentLogger(logger, 'Card'),
    collection: createComponentLogger(logger, 'Collection'),
    monitoring: createComponentLogger(logger, 'Monitoring'),
  };
}
