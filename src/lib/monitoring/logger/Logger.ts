/**
 * Main Logger class
 * Orchestrates logging with multiple transports and formats
 */

import type { LogLevel, LogEntry, LoggerConfig } from './types';
import { formatJSON, formatText } from './formatters';
import { logToConsole } from './transports/consoleTransport';
import { logToFile } from './transports/fileTransport';
import { logToRemote } from './transports/remoteTransport';
import { createConvenienceMethods } from './convenienceMethods';

export class Logger {
  private config: LoggerConfig;
  private logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
  };

  // Convenience methods
  public apiLog: ReturnType<typeof createConvenienceMethods>['apiLog'];
  public dbLog: ReturnType<typeof createConvenienceMethods>['dbLog'];
  public authLog: ReturnType<typeof createConvenienceMethods>['authLog'];
  public userActionLog: ReturnType<
    typeof createConvenienceMethods
  >['userActionLog'];
  public performanceLog: ReturnType<
    typeof createConvenienceMethods
  >['performanceLog'];

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: (process.env.LOG_LEVEL as LogLevel) || 'info',
      enableConsole: process.env.NODE_ENV !== 'test',
      enableFile: process.env.NODE_ENV === 'production',
      enableRemote: !!process.env.LOG_ENDPOINT,
      format: process.env.NODE_ENV === 'production' ? 'json' : 'text',
      ...config,
    };

    // Bind convenience methods
    const convenienceMethods = createConvenienceMethods(this.log.bind(this));
    this.apiLog = convenienceMethods.apiLog;
    this.dbLog = convenienceMethods.dbLog;
    this.authLog = convenienceMethods.authLog;
    this.userActionLog = convenienceMethods.userActionLog;
    this.performanceLog = convenienceMethods.performanceLog;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] >= this.logLevels[this.config.level];
  }

  private formatMessage(entry: LogEntry): string {
    if (this.config.format === 'json') {
      return formatJSON(entry);
    }
    return formatText(entry);
  }

  private async handleConsoleTransport(entry: LogEntry) {
    if (!this.config.enableConsole) return;
    const formatted = this.formatMessage(entry);
    await logToConsole(entry, formatted);
  }

  private async handleFileTransport(entry: LogEntry) {
    if (!this.config.enableFile || typeof window !== 'undefined') return;
    const formatted = this.formatMessage(entry);
    await logToFile(formatted);
  }

  private async handleRemoteTransport(entry: LogEntry) {
    if (!this.config.enableRemote || !process.env.LOG_ENDPOINT) return;
    await logToRemote(entry, process.env.LOG_ENDPOINT);
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
      this.handleConsoleTransport(entry),
      this.handleFileTransport(entry),
      this.handleRemoteTransport(entry),
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
