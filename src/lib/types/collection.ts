/**
 * Collection-related type definitions
 */

import type { Prisma } from '@prisma/client';

// Collection Statistics
export interface CollectionStatistics {
  totalCards: number;
  uniqueCards: number;
  completionPercentage: number;
  totalValue?: number;
}

// Collection Pagination
export interface CollectionPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Preview Card for Import/Export
export interface PreviewCard {
  cardName: string;
  quantity: number;
  setName?: string;
  setNumber?: string;
  cardId?: string;
  line?: number;
}

// Export Record
export interface ExportRecord {
  id: string;
  format: string;
  date: string;
  options: {
    includeMetadata: boolean;
    includeConditions: boolean;
    includeValues: boolean;
    onlyOwned: boolean;
    customName: string;
  };
  filename: string;
  size?: number;
  recordCount?: number;
}

// Prisma Card Where Clause - use Prisma's actual type
export type PrismaCardWhere = Prisma.CardWhereInput;
