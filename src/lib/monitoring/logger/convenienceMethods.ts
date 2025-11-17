/**
 * Convenience logging methods
 * Specialized logging methods for common scenarios
 */

import type { LogEntry, LogLevel } from './types';

export function createConvenienceMethods(
  log: (
    level: LogLevel,
    message: string,
    context?: Partial<LogEntry>
  ) => Promise<void>
) {
  return {
    apiLog(
      method: string,
      endpoint: string,
      statusCode: number,
      duration: number,
      context?: Partial<LogEntry>
    ) {
      return log('info', `${method} ${endpoint} ${statusCode} ${duration}ms`, {
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
    },

    dbLog(
      operation: string,
      table: string,
      duration: number,
      recordCount?: number,
      context?: Partial<LogEntry>
    ) {
      return log('debug', `DB ${operation} on ${table} (${duration}ms)`, {
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
    },

    authLog(
      action: string,
      userId?: string,
      success: boolean = true,
      context?: Partial<LogEntry>
    ) {
      const level: LogLevel = success ? 'info' : 'warn';
      return log(
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
    },

    userActionLog(
      action: string,
      resource: string,
      userId?: string,
      context?: Partial<LogEntry>
    ) {
      return log('info', `User action: ${action} on ${resource}`, {
        ...context,
        userId,
        action: 'user_action',
        context: {
          userAction: action,
          resource,
          ...context?.context,
        },
      });
    },

    performanceLog(
      operation: string,
      duration: number,
      success: boolean,
      context?: Partial<LogEntry>
    ) {
      const level: LogLevel = duration > 5000 ? 'warn' : 'debug'; // Warn on slow operations
      return log(level, `Performance: ${operation} took ${duration}ms`, {
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
    },
  };
}
