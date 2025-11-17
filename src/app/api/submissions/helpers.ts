/**
 * Helper functions for submissions API route
 */

import type {
  SubmissionSearchFilters,
  SubmissionSearchOptions,
} from '@/lib/types/submission';

/**
 * Valid sort fields for submission search
 */
const VALID_SORT_FIELDS = [
  'name',
  'createdAt',
  'updatedAt',
  'status',
  'priority',
] as const;

type ValidSortField = (typeof VALID_SORT_FIELDS)[number];

const VALID_SORT_ORDERS = ['asc', 'desc'] as const;
type ValidSortOrder = (typeof VALID_SORT_ORDERS)[number];

/**
 * Parse submission filters from URL search params
 */
export function parseSubmissionFilters(
  searchParams: URLSearchParams
): SubmissionSearchFilters {
  const filters: SubmissionSearchFilters = {};

  // Status filter (comma-separated array)
  const statusParam = searchParams.get('status');
  if (statusParam) {
    filters.status = statusParam.split(
      ','
    ) as import('@prisma/client').SubmissionStatus[];
  }

  // Priority filter (comma-separated array)
  const priorityParam = searchParams.get('priority');
  if (priorityParam) {
    filters.priority = priorityParam.split(
      ','
    ) as import('@prisma/client').SubmissionPriority[];
  }

  // String filters
  const submittedBy = searchParams.get('submittedBy');
  if (submittedBy) {
    filters.submittedBy = submittedBy;
  }

  const reviewedBy = searchParams.get('reviewedBy');
  if (reviewedBy) {
    filters.reviewedBy = reviewedBy;
  }

  const name = searchParams.get('name');
  if (name) {
    filters.name = name;
  }

  const faction = searchParams.get('faction');
  if (faction) {
    filters.faction = faction;
  }

  const series = searchParams.get('series');
  if (series) {
    filters.series = series;
  }

  // Boolean filters
  const isLeak = searchParams.get('isLeak');
  if (isLeak) {
    filters.isLeak = isLeak === 'true';
  }

  const isPreview = searchParams.get('isPreview');
  if (isPreview) {
    filters.isPreview = isPreview === 'true';
  }

  // Date filters
  const dateFrom = searchParams.get('dateFrom');
  if (dateFrom) {
    filters.dateFrom = new Date(dateFrom);
  }

  const dateTo = searchParams.get('dateTo');
  if (dateTo) {
    filters.dateTo = new Date(dateTo);
  }

  return filters;
}

/**
 * Parse submission search options from URL search params
 */
export function parseSubmissionOptions(
  searchParams: URLSearchParams
): SubmissionSearchOptions {
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '20', 10),
    sortBy: VALID_SORT_FIELDS.includes(sortBy as ValidSortField)
      ? (sortBy as ValidSortField)
      : 'createdAt',
    sortOrder: VALID_SORT_ORDERS.includes(sortOrder as ValidSortOrder)
      ? (sortOrder as ValidSortOrder)
      : 'desc',
    includeRelations: searchParams.get('includeRelations') !== 'false',
  };
}
