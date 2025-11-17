/**
 * File transport for logger
 * Writes logs to file system (Node.js only)
 */

export async function logToFile(formatted: string) {
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
