/**
 * Submission Statistics Calculator
 */

import { prisma } from '@/lib/database';

/**
 * Calculate average review time in hours
 */
export async function calculateAverageReviewTime(): Promise<number> {
  const reviewedSubmissions = await prisma.cardSubmission.findMany({
    where: {
      status: { in: ['APPROVED', 'REJECTED'] },
      reviewedAt: { not: null },
    },
    select: {
      createdAt: true,
      reviewedAt: true,
    },
    take: 100,
    orderBy: { reviewedAt: 'desc' },
  });

  if (reviewedSubmissions.length === 0) return 0;

  const totalHours = reviewedSubmissions.reduce((sum, submission) => {
    if (submission.reviewedAt) {
      const diffMs =
        submission.reviewedAt.getTime() - submission.createdAt.getTime();
      return sum + diffMs / (1000 * 60 * 60);
    }
    return sum;
  }, 0);

  return totalHours / reviewedSubmissions.length;
}
