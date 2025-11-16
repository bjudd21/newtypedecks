/**
 * TypeScript type definitions for CollectionImporter
 */

import type { ImportResult } from './';

export type ImportFormat = 'csv' | 'json' | 'decklist' | 'mtga';
export type UpdateBehavior = 'add' | 'replace' | 'skip';

export interface CollectionImporterProps {
  onImportComplete?: (result: ImportResult) => void;
  className?: string;
}

export interface PreviewCardData {
  cardName: string;
  quantity: number;
  setName?: string;
  setNumber?: string;
  cardId?: string;
}

export interface ImportOptions {
  updateBehavior: UpdateBehavior;
}

export interface ImportRequestBody {
  format: ImportFormat;
  data: string | unknown[];
  options: ImportOptions;
}
