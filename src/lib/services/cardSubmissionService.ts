/**
 * Card Submission Service
 *
 * Handles manual card submissions, review workflow, and publication
 *
 * Re-exports from modularized structure for backward compatibility
 */

import type {
  CardSubmissionWithRelations,
  CreateSubmissionData,
  UpdateSubmissionData,
  SubmissionReviewData,
  SubmissionSearchFilters,
  SubmissionSearchOptions,
  SubmissionSearchResult,
  SubmissionStatistics,
  BatchSubmissionOperation,
  BatchSubmissionResult,
} from '@/lib/types/submission';
import * as operations from './cardSubmissionService/index';

export class CardSubmissionService {
  /**
   * Create a new card submission
   */
  static async createSubmission(
    data: CreateSubmissionData,
    submittedBy?: string
  ): Promise<CardSubmissionWithRelations> {
    return operations.createSubmission(data, submittedBy);
  }

  /**
   * Get submission by ID
   */
  static async getSubmissionById(
    id: string,
    includeRelations = true
  ): Promise<CardSubmissionWithRelations | null> {
    return operations.getSubmissionById(id, includeRelations);
  }

  /**
   * Update submission
   */
  static async updateSubmission(
    data: UpdateSubmissionData
  ): Promise<CardSubmissionWithRelations> {
    return operations.updateSubmission(data);
  }

  /**
   * Search submissions
   */
  static async searchSubmissions(
    filters: SubmissionSearchFilters = {},
    options: SubmissionSearchOptions = {}
  ): Promise<SubmissionSearchResult> {
    return operations.searchSubmissions(filters, options);
  }

  /**
   * Review submission (approve/reject)
   */
  static async reviewSubmission(
    reviewData: SubmissionReviewData,
    reviewedBy: string
  ): Promise<CardSubmissionWithRelations> {
    return operations.reviewSubmission(reviewData, reviewedBy);
  }

  /**
   * Publish approved submission as card
   */
  static async publishSubmission(
    submissionId: string,
    publishedBy: string
  ): Promise<{
    submission: CardSubmissionWithRelations;
    card: import('@prisma/client').Card;
  }> {
    return operations.publishSubmission(submissionId, publishedBy);
  }

  /**
   * Delete submission
   */
  static async deleteSubmission(id: string): Promise<void> {
    return operations.deleteSubmission(id);
  }

  /**
   * Upload image for submission
   */
  static async uploadSubmissionImage(
    submissionId: string,
    file: File
  ): Promise<{ imageUrl: string; imageFile: string }> {
    return operations.uploadSubmissionImage(submissionId, file);
  }

  /**
   * Get submission statistics
   */
  static async getSubmissionStatistics(): Promise<SubmissionStatistics> {
    return operations.getSubmissionStatistics();
  }

  /**
   * Batch operations on submissions
   */
  static async batchOperation(
    operation: BatchSubmissionOperation
  ): Promise<BatchSubmissionResult> {
    return operations.batchOperation(operation);
  }
}
