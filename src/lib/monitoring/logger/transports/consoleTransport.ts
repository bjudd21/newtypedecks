/**
 * Console transport for logger
 * Outputs logs to browser/Node.js console
 */

import type { LogEntry } from '../types';

export async function logToConsole(entry: LogEntry, formatted: string) {
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
