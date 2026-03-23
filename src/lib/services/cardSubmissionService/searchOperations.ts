/**
 * Card submission search operations
 */

import { prisma } from '@/lib/database';
import type {
  CardSubmissionWithRelations,
  SubmissionSearchFilters,
  SubmissionSearchOptions,
  SubmissionSearchResult,
} from '@/lib/types/submission';

/**
 * Search submissions
 */
export async function searchSubmissions(
  filters: SubmissionSearchFilters = {},
  options: SubmissionSearchOptions = {}
): Promise<SubmissionSearchResult> {
  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    includeRelations = true,
  } = options;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: Record<string, unknown> = {};

  if (filters.gameId) where.gameId = filters.gameId;

  if (filters.status && filters.status.length > 0) {
    where.status = { in: filters.status };
  }

  if (filters.priority && filters.priority.length > 0) {
    where.priority = { in: filters.priority };
  }

  if (filters.submittedBy) {
    where.submittedBy = filters.submittedBy;
  }

  if (filters.reviewedBy) {
    where.reviewedBy = filters.reviewedBy;
  }

  if (filters.isLeak !== undefined) {
    where.isLeak = filters.isLeak;
  }

  if (filters.isPreview !== undefined) {
    where.isPreview = filters.isPreview;
  }

  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {} as { gte?: Date; lte?: Date };
    if (filters.dateFrom)
      (where.createdAt as { gte?: Date; lte?: Date }).gte = filters.dateFrom;
    if (filters.dateTo)
      (where.createdAt as { gte?: Date; lte?: Date }).lte = filters.dateTo;
  }

  if (filters.name) {
    where.name = {
      contains: filters.name,
      mode: 'insensitive',
    };
  }

  if (filters.faction) {
    where.faction = filters.faction;
  }

  if (filters.series) {
    where.series = filters.series;
  }

  // Include relations if requested
  const include = includeRelations
    ? {
        user: true,
        reviewer: true,
        publishedCard: true,
        type: true,
        rarity: true,
        set: true,
      }
    : undefined;

  // Execute search
  const [submissions, total] = await Promise.all([
    prisma.cardSubmission.findMany({
      where,
      include,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.cardSubmission.count({ where }),
  ]);

  return {
    submissions: submissions as CardSubmissionWithRelations[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
