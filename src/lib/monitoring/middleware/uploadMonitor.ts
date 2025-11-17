/**
 * File upload monitoring wrapper
 */

import { logger } from '../logger';
import { errorTracker } from '../sentry';
import { measureAPI } from '../performance';

// File upload monitoring wrapper
export async function monitorFileUpload<T>(
  fileName: string,
  fileSize: number,
  uploadFunction: () => Promise<T>
): Promise<T> {
  return (await measureAPI(
    `Upload ${fileName}`,
    async () => {
      try {
        const result = await uploadFunction();

        // Log successful upload
        logger.info(`File uploaded successfully: ${fileName}`, {
          action: 'file_upload',
          context: { fileName, fileSize, success: true },
        });

        return result;
      } catch (error) {
        // Log failed upload
        logger.error(`File upload failed: ${fileName}`, error as Error, {
          action: 'file_upload',
          context: { fileName, fileSize, success: false },
        });

        errorTracker.captureException(error as Error, {
          upload: { fileName, fileSize, success: false },
        });

        throw error;
      }
    },
    { fileName, fileSize }
  )) as Promise<T>;
}
