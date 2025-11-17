/**
 * Card submission statistics operations
 */

import { prisma } from '@/lib/database';
import type {
  SubmissionStatistics,
  SubmissionStatus,
  SubmissionPriority,
} from '@/lib/types/submission';
import { calculateAverageReviewTime } from './statistics';

/**
 * Get submission statistics
 */
export async function getSubmissionStatistics(): Promise<SubmissionStatistics> {
  const [
    total,
    statusCounts,
    priorityCounts,
    recentSubmissions,
    pendingReview,
    avgReviewTime,
  ] = await Promise.all([
    // Total submissions
    prisma.cardSubmission.count(),

    // By status
    prisma.cardSubmission.groupBy({
      by: ['status'],
      _count: { status: true },
    }),

    // By priority
    prisma.cardSubmission.groupBy({
      by: ['priority'],
      _count: { priority: true },
    }),

    // Recent submissions (last 7 days)
    prisma.cardSubmission.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),

    // Pending review
    prisma.cardSubmission.count({
      where: { status: 'PENDING' },
    }),

    // Average review time
    calculateAverageReviewTime(),
  ]);

  const byStatus = statusCounts.reduce(
    (acc, item) => {
      acc[item.status as SubmissionStatus] = item._count.status;
      return acc;
    },
    {} as Record<SubmissionStatus, number>
  );

  const byPriority = priorityCounts.reduce(
    (acc, item) => {
      acc[item.priority as SubmissionPriority] = item._count.priority;
      return acc;
    },
    {} as Record<SubmissionPriority, number>
  );

  return {
    total,
    byStatus,
    byPriority,
    recentSubmissions,
    pendingReview,
    averageReviewTime: avgReviewTime,
  };
}
