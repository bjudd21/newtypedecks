/**
 * TypeScript type definitions for CollectionExporter
 */

import type { ExportRecord } from '@/lib/types';
import type { ExportFormat } from './FormatSelectionGrid';

export interface CollectionExporterProps {
  collectionStats?: {
    totalCards: number;
    uniqueCards: number;
    totalValue?: number;
  };
  onExportComplete?: (result: unknown) => void;
  className?: string;
}

export interface ExportOptions {
  includeMetadata: boolean;
  includeConditions: boolean;
  includeValues: boolean;
  onlyOwned: boolean;
  customName: string;
}

export interface ExportResult {
  success: boolean;
  format: string;
  filename: string;
  size?: number;
  recordCount?: number;
}

export type { ExportFormat, ExportRecord };
