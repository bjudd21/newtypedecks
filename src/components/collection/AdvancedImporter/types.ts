/**
 * Types for AdvancedImporter component
 */

import type { ValidationError } from '../utils/importParsers';
import type { PreviewCard } from '@/lib/types';

export interface ImportSource {
  id: string;
  name: string;
  description: string;
  icon: string;
  format: string;
  example?: string;
}

export interface ImportOptions {
  updateBehavior: string;
  validateOnly: boolean;
  batchSize: number;
  skipDuplicates: boolean;
}

export type ImportStep = 'select' | 'data' | 'validate' | 'options' | 'import';

export interface AdvancedImporterProps {
  onImportComplete?: (result: unknown) => void;
  className?: string;
}

export type { ValidationError, PreviewCard };
