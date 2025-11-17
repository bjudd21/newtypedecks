/**
 * Card submission CRUD operations
 */

import { prisma } from '@/lib/database';
import type {
  CardSubmissionWithRelations,
  CreateSubmissionData,
  UpdateSubmissionData,
} from '@/lib/types/submission';
import { validateSubmissionData } from './validation';

/**
 * Create a new card submission
 */
export async function createSubmission(
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
export async function getSubmissionById(
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
export async function updateSubmission(
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
 * Delete submission
 */
export async function deleteSubmission(id: string): Promise<void> {
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
