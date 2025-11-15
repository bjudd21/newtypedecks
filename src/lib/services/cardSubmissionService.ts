/**
 * Card Submission Service
 *
 * Handles manual card submissions, review workflow, and publication
 */

import { prisma } from '@/lib/database';
import { CardService } from './cardService';
import { SubmissionImageService } from './submissionImageService';
import type {
  CardSubmissionWithRelations,
  CreateSubmissionData,
  UpdateSubmissionData,
  SubmissionReviewData,
  SubmissionSearchFilters,
  SubmissionSearchOptions,
  SubmissionSearchResult,
  SubmissionStatistics,
  SubmissionValidationResult,
  BatchSubmissionOperation,
  BatchSubmissionResult,
  SubmissionStatus,
  SubmissionPriority,
} from '@/lib/types/submission';
import type { CreateCardData } from '@/lib/types/card';
import { validateSubmissionData } from './cardSubmissionService/validation';
import { transformSubmissionToCardData } from './cardSubmissionService/transformers';
import { calculateAverageReviewTime } from './cardSubmissionService/statistics';

export class CardSubmissionService {
  /**
   * Create a new card submission
   */
  static async createSubmission(
    data: CreateSubmissionData,
    submittedBy?: string
  ): Promise<CardSubmissionWithRelations> {
    // Validate submission data
    const validation = validateSubmissionData(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Create the submission
    const submission = (await prisma.cardSubmission.create({
      data: {
        ...data,
        submittedBy,
        keywords: data.keywords || [],
        tags: data.tags || [],
        status: 'PENDING',
        priority: data.priority || 'NORMAL',
        isFoil: data.isFoil || false,
        isPromo: data.isPromo || false,
        isAlternate: data.isAlternate || false,
        isLeak: data.isLeak || false,
        isPreview: data.isPreview || false,
        language: data.language || 'en',
      },
      include: {
        user: true,
        reviewer: true,
        publishedCard: true,
      },
    })) as CardSubmissionWithRelations;

    return submission;
  }

  /**
   * Get submission by ID
   */
  static async getSubmissionById(
    id: string,
    includeRelations = true
  ): Promise<CardSubmissionWithRelations | null> {
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

    return prisma.cardSubmission.findUnique({
      where: { id },
      include,
    }) as Promise<CardSubmissionWithRelations | null>;
  }

  /**
   * Update submission
   */
  static async updateSubmission(
    data: UpdateSubmissionData
  ): Promise<CardSubmissionWithRelations> {
    const { id, ...updateData } = data;

    const submission = (await prisma.cardSubmission.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        reviewer: true,
        publishedCard: true,
      },
    })) as CardSubmissionWithRelations;

    return submission;
  }

  /**
   * Search submissions
   */
  static async searchSubmissions(
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

  /**
   * Review submission (approve/reject)
   */
  static async reviewSubmission(
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

  /**
   * Publish approved submission as card
   */
  static async publishSubmission(
    submissionId: string,
    _publishedBy: string
  ): Promise<{
    submission: CardSubmissionWithRelations;
    card: import('@prisma/client').Card;
  }> {
    const submission = await this.getSubmissionById(submissionId);

    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.status !== 'APPROVED') {
      throw new Error('Submission must be approved before publishing');
    }

    if (submission.publishedCardId) {
      throw new Error('Submission has already been published');
    }

    // Transform submission to card data
    const cardData = await transformSubmissionToCardData(submission);

    // Create the card
    const card = await CardService.createCard(cardData);

    // Update submission status
    const updatedSubmission = (await prisma.cardSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'PUBLISHED',
        publishedCardId: card.id,
        publishedAt: new Date(),
      },
      include: {
        user: true,
        reviewer: true,
        publishedCard: true,
      },
    })) as CardSubmissionWithRelations;

    return { submission: updatedSubmission, card };
  }

  /**
   * Delete submission
   */
  static async deleteSubmission(id: string): Promise<void> {
    const submission = await prisma.cardSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.status === 'PUBLISHED') {
      throw new Error('Cannot delete published submission');
    }

    await prisma.cardSubmission.delete({
      where: { id },
    });
  }

  /**
   * Upload image for submission
   */
  static async uploadSubmissionImage(
    submissionId: string,
    file: File
  ): Promise<{ imageUrl: string; imageFile: string }> {
    const submission = await prisma.cardSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    // Upload and process the image
    const uploadResult = await SubmissionImageService.uploadSubmissionImage(
      file,
      {
        cardName: submission.name,
        setCode: 'SUB', // Default set code for submissions
        setNumber: submission.setNumber,
      }
    );

    if (!uploadResult.success) {
      throw new Error(uploadResult.message || 'Failed to upload image');
    }

    // Update submission with image URLs
    await prisma.cardSubmission.update({
      where: { id: submissionId },
      data: {
        imageUrl: uploadResult.imageUrl,
        imageFile: uploadResult.imageFile,
      },
    });

    return {
      imageUrl: uploadResult.imageUrl!,
      imageFile: uploadResult.imageFile!,
    };
  }

  /**
   * Get submission statistics
   */
  static async getSubmissionStatistics(): Promise<SubmissionStatistics> {
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

  /**
   * Batch operations on submissions
   */
  static async batchOperation(
    operation: BatchSubmissionOperation
  ): Promise<BatchSubmissionResult> {
    const { submissionIds, action, data } = operation;
    const successful: string[] = [];
    const failed: Array<{ submissionId: string; error: string }> = [];

    for (const submissionId of submissionIds) {
      try {
        switch (action) {
          case 'approve':
            await this.reviewSubmission(
              {
                id: submissionId,
                status: 'APPROVED',
                reviewNotes: data?.reviewNotes,
              },
              data?.reviewNotes ? 'batch-operation' : 'system'
            );
            break;

          case 'reject':
            await this.reviewSubmission(
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

  /**
   * Private helper methods
   */


}
