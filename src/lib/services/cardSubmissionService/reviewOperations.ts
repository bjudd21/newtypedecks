/**
 * Card submission review operations
 */

import { prisma } from '@/lib/database';
import type {
  CardSubmissionWithRelations,
  SubmissionReviewData,
} from '@/lib/types/submission';

/**
 * Review submission (approve/reject)
 */
export async function reviewSubmission(
  reviewData: SubmissionReviewData,
  reviewedBy: string
): Promise<CardSubmissionWithRelations> {
  const { id, status, reviewNotes, rejectionReason } = reviewData;

  const submission = (await prisma.cardSubmission.update({
    where: { id },
    data: {
      status,
      reviewedBy,
      reviewedAt: new Date(),
      reviewNotes,
      rejectionReason: status === 'REJECTED' ? rejectionReason : undefined,
    },
    include: {
      user: true,
      reviewer: true,
      publishedCard: true,
    },
  })) as CardSubmissionWithRelations;

  return submission;
}
