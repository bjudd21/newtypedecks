/**
 * Card Submission Service
 *
 * Handles manual card submissions, review workflow, and publication
 */

import { prisma } from '@/lib/database';
import { CardService } from './cardService';
import { SubmissionImageService } from './submissionImageService';
import type {
  CardSubmission,
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

export class CardSubmissionService {
  /**
   * Create a new card submission
   */
  static async createSubmission(
    data: CreateSubmissionData,
    submittedBy?: string
  ): Promise<CardSubmissionWithRelations> {
    // Validate submission data
    const validation = this.validateSubmissionData(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Create the submission
    const submission = await prisma.cardSubmission.create({
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
    }) as CardSubmissionWithRelations;

    return submission;
  }

  /**
   * Get submission by ID
   */
  static async getSubmissionById(
    id: string,
    includeRelations = true
  ): Promise<CardSubmissionWithRelations | null> {
    const include = includeRelations ? {
      user: true,
      reviewer: true,
      publishedCard: true,
      type: true,
      rarity: true,
      set: true,
    } : undefined;

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

    const submission = await prisma.cardSubmission.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        reviewer: true,
        publishedCard: true,
      },
    }) as CardSubmissionWithRelations;

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
    const where: any = {};

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
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
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
    const include = includeRelations ? {
      user: true,
      reviewer: true,
      publishedCard: true,
      type: true,
      rarity: true,
      set: true,
    } : undefined;

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

    const submission = await prisma.cardSubmission.update({
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
    }) as CardSubmissionWithRelations;

    return submission;
  }

  /**
   * Publish approved submission as card
   */
  static async publishSubmission(
    submissionId: string,
    publishedBy: string
  ): Promise<{ submission: CardSubmissionWithRelations; card: any }> {
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
    const cardData = await this.transformSubmissionToCardData(submission);

    // Create the card
    const card = await CardService.createCard(cardData);

    // Update submission status
    const updatedSubmission = await prisma.cardSubmission.update({
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
    }) as CardSubmissionWithRelations;

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
    const uploadResult = await SubmissionImageService.uploadSubmissionImage(file, {
      cardName: submission.name,
      setCode: 'SUB', // Default set code for submissions
      setNumber: submission.setNumber,
    });

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
      this.calculateAverageReviewTime(),
    ]);

    const byStatus = statusCounts.reduce((acc, item) => {
      acc[item.status as SubmissionStatus] = item._count.status;
      return acc;
    }, {} as Record<SubmissionStatus, number>);

    const byPriority = priorityCounts.reduce((acc, item) => {
      acc[item.priority as SubmissionPriority] = item._count.priority;
      return acc;
    }, {} as Record<SubmissionPriority, number>);

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
            await this.reviewSubmission({
              id: submissionId,
              status: 'APPROVED',
              reviewNotes: data?.reviewNotes,
            }, data?.reviewNotes ? 'batch-operation' : 'system');
            break;

          case 'reject':
            await this.reviewSubmission({
              id: submissionId,
              status: 'REJECTED',
              rejectionReason: data?.rejectionReason,
            }, 'batch-operation');
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

  /**
   * Validate submission data
   */
  private static validateSubmissionData(data: CreateSubmissionData): SubmissionValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Card name is required');
    }

    if (!data.setNumber || data.setNumber.trim().length === 0) {
      errors.push('Set number is required');
    }

    // Length validation
    if (data.name && data.name.length > 200) {
      errors.push('Card name is too long (maximum 200 characters)');
    }

    if (data.description && data.description.length > 2000) {
      warnings.push('Description is very long (over 2000 characters)');
    }

    // Numeric validation
    if (data.level !== undefined && (data.level < 0 || data.level > 10)) {
      errors.push('Level must be between 0 and 10');
    }

    if (data.cost !== undefined && (data.cost < 0 || data.cost > 20)) {
      errors.push('Cost must be between 0 and 20');
    }

    // Email validation for anonymous submissions
    if (data.submitterEmail && !this.isValidEmail(data.submitterEmail)) {
      errors.push('Invalid email format');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Transform submission to card data
   */
  private static async transformSubmissionToCardData(
    submission: CardSubmissionWithRelations
  ): Promise<CreateCardData> {
    // Ensure we have required references
    let typeId = submission.typeId;
    let rarityId = submission.rarityId;
    let setId = submission.setId;

    // Create missing references if needed
    if (!typeId) {
      typeId = await this.findOrCreateCardType('Unit'); // Default type
    }

    if (!rarityId) {
      rarityId = await this.findOrCreateRarity('Common'); // Default rarity
    }

    if (!setId) {
      setId = await this.findOrCreateSet(
        submission.setName || 'Community Submissions',
        submission.setCode || 'CS'
      );
    }

    return {
      name: submission.name,
      typeId,
      rarityId,
      setId,
      setNumber: submission.setNumber,
      imageUrl: submission.imageUrl || '',
      imageUrlSmall: undefined,
      imageUrlLarge: undefined,
      description: submission.description ?? undefined,
      officialText: submission.officialText ?? undefined,
      level: submission.level ?? undefined,
      cost: submission.cost ?? undefined,
      clashPoints: submission.clashPoints ?? undefined,
      price: submission.price ?? undefined,
      hitPoints: submission.hitPoints ?? undefined,
      attackPoints: submission.attackPoints ?? undefined,
      faction: submission.faction ?? undefined,
      pilot: submission.pilot ?? undefined,
      model: submission.model ?? undefined,
      series: submission.series ?? undefined,
      nation: submission.nation ?? undefined,
      keywords: submission.keywords,
      tags: submission.tags,
      abilities: submission.abilities ?? undefined,
      isFoil: submission.isFoil,
      isPromo: submission.isPromo,
      isAlternate: submission.isAlternate,
      language: submission.language,
    };
  }

  /**
   * Calculate average review time
   */
  private static async calculateAverageReviewTime(): Promise<number> {
    const reviewedSubmissions = await prisma.cardSubmission.findMany({
      where: {
        status: { in: ['APPROVED', 'REJECTED'] },
        reviewedAt: { not: null },
      },
      select: {
        createdAt: true,
        reviewedAt: true,
      },
      take: 100, // Last 100 reviewed submissions
      orderBy: { reviewedAt: 'desc' },
    });

    if (reviewedSubmissions.length === 0) return 0;

    const totalHours = reviewedSubmissions.reduce((sum, submission) => {
      if (submission.reviewedAt) {
        const diffMs = submission.reviewedAt.getTime() - submission.createdAt.getTime();
        return sum + (diffMs / (1000 * 60 * 60)); // Convert to hours
      }
      return sum;
    }, 0);

    return totalHours / reviewedSubmissions.length;
  }

  /**
   * Helper functions
   */
  private static async findOrCreateCardType(name: string): Promise<string> {
    let cardType = await prisma.cardType.findUnique({
      where: { name },
    });

    if (!cardType) {
      cardType = await prisma.cardType.create({
        data: {
          name,
          description: `Auto-created type: ${name}`,
        },
      });
    }

    return cardType.id;
  }

  private static async findOrCreateRarity(name: string): Promise<string> {
    let rarity = await prisma.rarity.findUnique({
      where: { name },
    });

    if (!rarity) {
      rarity = await prisma.rarity.create({
        data: {
          name,
          color: '#6B7280', // Default gray
          description: `Auto-created rarity: ${name}`,
        },
      });
    }

    return rarity.id;
  }

  private static async findOrCreateSet(name: string, code: string): Promise<string> {
    let cardSet = await prisma.set.findUnique({
      where: { code },
    });

    if (!cardSet) {
      cardSet = await prisma.set.create({
        data: {
          name,
          code,
          releaseDate: new Date(),
          description: `Auto-created set: ${name}`,
        },
      });
    }

    return cardSet.id;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}