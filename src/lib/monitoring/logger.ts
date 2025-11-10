/**
 * Structured logging system
 * Provides consistent, structured logging across the application
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
  userId?: string;
  requestId?: string;
  component?: string;
  action?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  format: 'json' | 'text';
}

class Logger {
  private config: LoggerConfig;
  private logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
  };

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: (process.env.LOG_LEVEL as LogLevel) || 'info',
      enableConsole: process.env.NODE_ENV !== 'test',
      enableFile: process.env.NODE_ENV === 'production',
      enableRemote: !!process.env.LOG_ENDPOINT,
      format: process.env.NODE_ENV === 'production' ? 'json' : 'text',
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] >= this.logLevels[this.config.level];
  }

  private formatMessage(entry: LogEntry): string {
    if (this.config.format === 'json') {
      return JSON.stringify({
        timestamp: entry.timestamp,
        level: entry.level.toUpperCase(),
        message: entry.message,
        context: entry.context,
        error: entry.error
          ? {
              name: entry.error.name,
              message: entry.error.message,
              stack: entry.error.stack,
            }
          : undefined,
        userId: entry.userId,
        requestId: entry.requestId,
        component: entry.component,
        action: entry.action,
      });
    }

    let formatted = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;

    if (entry.component) {
      formatted += ` [${entry.component}]`;
    }

    if (entry.action) {
      formatted += ` (${entry.action})`;
    }

    if (entry.userId) {
      formatted += ` [User: ${entry.userId}]`;
    }

    if (entry.requestId) {
      formatted += ` [Req: ${entry.requestId}]`;
    }

    if (entry.context && Object.keys(entry.context).length > 0) {
      formatted += ` Context: ${JSON.stringify(entry.context)}`;
    }

    if (entry.error) {
      formatted += `\nError: ${entry.error.message}\nStack: ${entry.error.stack}`;
    }

    return formatted;
  }

  private async logToConsole(entry: LogEntry) {
    if (!this.config.enableConsole) return;

    const formatted = this.formatMessage(entry);

    switch (entry.level) {
      case 'debug':
        console.warn(formatted);
        break;
      case 'info':
        console.warn(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
      case 'fatal':
        console.error(formatted);
        break;
    }
  }

  private async logToFile(entry: LogEntry) {
    if (!this.config.enableFile || typeof window !== 'undefined') return;

    // In a real implementation, you would write to a log file
    // For now, we'll skip file logging in the browser
    const formatted = this.formatMessage(entry);

    // Node.js environment - could write to file
    if (typeof process !== 'undefined' && process.env.LOG_FILE) {
      try {
        const fs = await import('fs');
        fs.appendFileSync(process.env.LOG_FILE, formatted + '\n');
      } catch (error) {
        console.error('Failed to write to log file:', error);
      }
    }
  }

  private async logToRemote(entry: LogEntry) {
    if (!this.config.enableRemote || !process.env.LOG_ENDPOINT) return;

    try {
      await fetch(process.env.LOG_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to remote endpoint:', error);
    }
  }

  private async log(
    level: LogLevel,
    message: string,
    context?: Partial<LogEntry>
  ) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...context,
    };

    await Promise.all([
      this.logToConsole(entry),
      this.logToFile(entry),
      this.logToRemote(entry),
    ]);
  }

  // Public logging methods
  debug(message: string, context?: Partial<LogEntry>) {
    return this.log('debug', message, context);
  }

  info(message: string, context?: Partial<LogEntry>) {
    return this.log('info', message, context);
  }

  warn(message: string, context?: Partial<LogEntry>) {
    return this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Partial<LogEntry>) {
    return this.log('error', message, { ...context, error });
  }

  fatal(message: string, error?: Error, context?: Partial<LogEntry>) {
    return this.log('fatal', message, { ...context, error });
  }

  // Convenience methods for specific contexts
  apiLog(
    method: string,
    endpoint: string,
    statusCode: number,
    duration: number,
    context?: Partial<LogEntry>
  ) {
    return this.info(`${method} ${endpoint} ${statusCode} ${duration}ms`, {
      ...context,
      action: 'api_request',
      context: {
        method,
        endpoint,
        statusCode,
        duration,
        ...context?.context,
      },
    });
  }

  dbLog(
    operation: string,
    table: string,
    duration: number,
    recordCount?: number,
    context?: Partial<LogEntry>
  ) {
    return this.debug(`DB ${operation} on ${table} (${duration}ms)`, {
      ...context,
      action: 'database_query',
      context: {
        operation,
        table,
        duration,
        recordCount,
        ...context?.context,
      },
    });
  }

  authLog(
    action: string,
    userId?: string,
    success: boolean = true,
    context?: Partial<LogEntry>
  ) {
    const level = success ? 'info' : 'warn';
    return this.log(
      level,
      `Auth ${action} ${success ? 'succeeded' : 'failed'}`,
      {
        ...context,
        userId,
        action: 'authentication',
        context: {
          authAction: action,
          success,
          ...context?.context,
        },
      }
    );
  }

  userActionLog(
    action: string,
    resource: string,
    userId?: string,
    context?: Partial<LogEntry>
  ) {
    return this.info(`User action: ${action} on ${resource}`, {
      ...context,
      userId,
      action: 'user_action',
      context: {
        userAction: action,
        resource,
        ...context?.context,
      },
    });
  }

  performanceLog(
    operation: string,
    duration: number,
    success: boolean,
    context?: Partial<LogEntry>
  ) {
    const level = duration > 5000 ? 'warn' : 'debug'; // Warn on slow operations
    return this.log(level, `Performance: ${operation} took ${duration}ms`, {
      ...context,
      action: 'performance',
      context: {
        operation,
        duration,
        success,
        slow: duration > 5000,
        ...context?.context,
      },
    });
  }

  // Create child logger with additional context
  child(additionalContext: Partial<LogEntry>): Logger {
    const childLogger = new Logger(this.config);

    // Override log method to include additional context
    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = async (
      level: LogLevel,
      message: string,
      context?: Partial<LogEntry>
    ) => {
      return originalLog(level, message, { ...additionalContext, ...context });
    };

    return childLogger;
  }
}

// Create default logger instance
export const logger = new Logger();

// Request-specific logger creator
export function createRequestLogger(
  requestId: string,
  userId?: string,
  component?: string
): Logger {
  return logger.child({ requestId, userId, component });
}

// Component-specific logger creator
export function createComponentLogger(component: string): Logger {
  return logger.child({ component });
}

// Performance logging decorator
export function logPerformance(operation: string) {
  return function <T extends (...args: unknown[]) => unknown>(
    target: unknown,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const method = descriptor.value!;

    descriptor.value = async function (this: unknown, ...args: unknown[]) {
      const start = Date.now();
      const methodLogger = createComponentLogger(
        `${(target as { constructor: { name: string } }).constructor.name}.${propertyName}`
      );

      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - start;
        methodLogger.performanceLog(operation, duration, true);
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        methodLogger.performanceLog(operation, duration, false);
        methodLogger.error(`${operation} failed`, error as Error);
        throw error;
      }
    } as T;

    return descriptor;
  };
}

// Error logging decorator
export function logErrors(component: string) {
  return function <T extends (...args: unknown[]) => unknown>(
    target: unknown,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const method = descriptor.value!;

    descriptor.value = async function (this: unknown, ...args: unknown[]) {
      const methodLogger = createComponentLogger(
        `${component}.${propertyName}`
      );

      try {
        return await method.apply(this, args);
      } catch (error) {
        methodLogger.error(`Method ${propertyName} failed`, error as Error, {
          context: { args: args.slice(0, 3) }, // Log first 3 args only
        });
        throw error;
      }
    } as T;

    return descriptor;
  };
}

// Structured logging for specific domains
export const domainLoggers = {
  auth: createComponentLogger('Auth'),
  api: createComponentLogger('API'),
  database: createComponentLogger('Database'),
  upload: createComponentLogger('Upload'),
  email: createComponentLogger('Email'),
  cache: createComponentLogger('Cache'),
  deck: createComponentLogger('Deck'),
  card: createComponentLogger('Card'),
  collection: createComponentLogger('Collection'),
  monitoring: createComponentLogger('Monitoring'),
};

// Export for global use
export default logger;
