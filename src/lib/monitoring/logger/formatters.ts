/**
 * Log message formatters
 * JSON and text formatting for log entries
 */

import type { LogEntry } from './types';

export function formatJSON(entry: LogEntry): string {
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

export function formatText(entry: LogEntry): string {
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
