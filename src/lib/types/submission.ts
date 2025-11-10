/**
 * Card Submission Types
 *
 * TypeScript interfaces for the manual card upload system
 */

import type {
  CardSubmission as PrismaCardSubmission,
  SubmissionStatus,
  SubmissionPriority,
} from '@prisma/client';

// Re-export Prisma enums
export { SubmissionStatus, SubmissionPriority };

// Base submission interface (same as Prisma type)
export type CardSubmission = PrismaCardSubmission;

// Submission with relations
export interface CardSubmissionWithRelations extends CardSubmission {
  user?: {
    id: string;
    name?: string;
    email: string;
  };
  reviewer?: {
    id: string;
    name?: string;
    email: string;
  };
  publishedCard?: {
    id: string;
    name: string;
  };
  type?: {
    id: string;
    name: string;
  };
  rarity?: {
    id: string;
    name: string;
    color: string;
  };
  set?: {
    id: string;
    name: string;
    code: string;
  };
}

// Type alias for components that expect CardSubmissionWithDetails
export type CardSubmissionWithDetails = CardSubmissionWithRelations;

// Create submission data
export interface CreateSubmissionData {
  // Required fields
  name: string;
  setNumber: string;

  // Optional card data
  level?: number;
  cost?: number;
  typeId?: string;
  rarityId?: string;
  setId?: string;
  setName?: string;
  setCode?: string;

  // Content
  description?: string;
  officialText?: string;
  abilities?: string;

  // Game attributes
  clashPoints?: number;
  price?: number;
  hitPoints?: number;
  attackPoints?: number;
  faction?: string;
  pilot?: string;
  model?: string;
  series?: string;
  nation?: string;
  keywords?: string[];
  tags?: string[];

  // Flags
  isFoil?: boolean;
  isPromo?: boolean;
  isAlternate?: boolean;
  isLeak?: boolean;
  isPreview?: boolean;
  language?: string;

  // Priority
  priority?: SubmissionPriority;

  // Submitter info (for anonymous submissions)
  submitterName?: string;
  submitterEmail?: string;
}

// Update submission data
export interface UpdateSubmissionData {
  id: string;

  // Editable card data
  name?: string;
  level?: number;
  cost?: number;
  typeId?: string;
  rarityId?: string;
  setId?: string;
  setName?: string;
  setCode?: string;
  setNumber?: string;

  // Content
  description?: string;
  officialText?: string;
  abilities?: string;

  // Game attributes
  clashPoints?: number;
  price?: number;
  hitPoints?: number;
  attackPoints?: number;
  faction?: string;
  pilot?: string;
  model?: string;
  series?: string;
  nation?: string;
  keywords?: string[];
  tags?: string[];

  // Flags
  isFoil?: boolean;
  isPromo?: boolean;
  isAlternate?: boolean;
  isLeak?: boolean;
  isPreview?: boolean;
  language?: string;

  // Workflow
  priority?: SubmissionPriority;

  // Image update
  imageUrl?: string;
}

// Submission review data
export interface SubmissionReviewData {
  id: string;
  status: SubmissionStatus;
  reviewNotes?: string;
  rejectionReason?: string;
}

// Submission search filters
export interface SubmissionSearchFilters {
  status?: SubmissionStatus[];
  priority?: SubmissionPriority[];
  submittedBy?: string;
  reviewedBy?: string;
  isLeak?: boolean;
  isPreview?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  name?: string;
  faction?: string;
  series?: string;
}

// Submission search options
export interface SubmissionSearchOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
  includeRelations?: boolean;
}

// Submission search result
export interface SubmissionSearchResult {
  submissions: CardSubmissionWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Submission statistics
export interface SubmissionStatistics {
  total: number;
  byStatus: Record<SubmissionStatus, number>;
  byPriority: Record<SubmissionPriority, number>;
  recentSubmissions: number; // Last 7 days
  pendingReview: number;
  averageReviewTime: number; // In hours
}

// File upload data
export interface SubmissionFileUpload {
  file: File;
  submissionId?: string; // For existing submissions
  isMainImage?: boolean;
}

// Submission validation result
export interface SubmissionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Batch submission operations
export interface BatchSubmissionOperation {
  submissionIds: string[];
  action: 'approve' | 'reject' | 'archive' | 'priority';
  data?: {
    priority?: SubmissionPriority;
    reviewNotes?: string;
    rejectionReason?: string;
  };
}

export interface BatchSubmissionResult {
  successful: string[];
  failed: Array<{
    submissionId: string;
    error: string;
  }>;
}

// Admin dashboard data
export interface SubmissionDashboardData {
  statistics: SubmissionStatistics;
  recentSubmissions: CardSubmissionWithRelations[];
  highPrioritySubmissions: CardSubmissionWithRelations[];
  pendingReview: CardSubmissionWithRelations[];
  weeklyTrends: {
    date: string;
    submissions: number;
    approvals: number;
    rejections: number;
  }[];
}
