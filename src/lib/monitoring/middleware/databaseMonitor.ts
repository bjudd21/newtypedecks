/**
 * Database query monitoring wrapper
 */

import { logger } from '../logger';
import { measureAPI } from '../performance';

// Database query monitoring wrapper
export async function monitorDatabaseQuery<T>(
  operation: string,
  query: () => Promise<T>,
  tableName?: string
): Promise<T> {
  return (await measureAPI(
    `DB ${operation}${tableName ? ` on ${tableName}` : ''}`,
    async () => {
      const result = await query();

      // Log successful query
      logger.dbLog(operation, tableName || 'unknown', Date.now(), undefined, {
        context: { success: true },
      });

      return result;
    },
    { operation, table: tableName }
  )) as Promise<T>;
}
