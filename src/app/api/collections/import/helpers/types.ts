/**
 * Type Definitions for Collection Import
 *
 * Shared interfaces used across import functionality
 */

export interface ImportCard {
  cardId?: string;
  cardName?: string;
  setNumber?: string;
  setName?: string;
  quantity: number;
}

export interface ImportResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
  imported: Array<{
    cardName: string;
    quantity: number;
    action: 'added' | 'updated';
  }>;
}

export interface ImportOptions {
  updateBehavior?: 'add' | 'replace' | 'skip';
}
