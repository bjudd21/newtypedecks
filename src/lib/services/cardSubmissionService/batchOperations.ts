/**
 * Card submission batch operations
 */

import { prisma } from '@/lib/database';
import type {
  BatchSubmissionOperation,
  BatchSubmissionResult,
} from '@/lib/types/submission';
import { reviewSubmission } from './reviewOperations';

/**
 * Batch operations on submissions
 */
export async function batchOperation(
  operation: BatchSubmissionOperation
): Promise<BatchSubmissionResult> {
  const { submissionIds, action, data } = operation;
  const successful: string[] = [];
  const failed: Array<{ submissionId: string; error: string }> = [];

  for (const submissionId of submissionIds) {
    try {
      switch (action) {
        case 'approve':
          await reviewSubmission(
            {
              id: submissionId,
              status: 'APPROVED',
              reviewNotes: data?.reviewNotes,
            },
            data?.reviewNotes ? 'batch-operation' : 'system'
          );
          break;

        case 'reject':
          await reviewSubmission(
            {
              id: submissionId,
              status: 'REJECTED',
              rejectionReason: data?.rejectionReason,
            },
            'batch-operation'
          );
          break;

        case 'archive':
          await prisma.cardSubmission.update({
            where: { id: submissionId },
            data: { status: 'ARCHIVED' },
          });
          break;

        case 'priority':
          if (!data?.priority) {
            throw new Error('Priority is required for priority update');
          }
          await prisma.cardSubmission.update({
            where: { id: submissionId },
            data: { priority: data.priority },
          });
          break;

        default:
          throw new Error(`Unknown action: ${action}`);
      }

      successful.push(submissionId);
    } catch (error) {
      failed.push({
        submissionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return { successful, failed };
}
