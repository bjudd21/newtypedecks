/**
 * Remote transport for logger
 * Sends logs to remote endpoint via HTTP
 */

import type { LogEntry } from '../types';

export async function logToRemote(entry: LogEntry, endpoint: string) {
  try {
    await fetch(endpoint, {
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
