/**
 * Type Definitions for Collection Export
 *
 * Shared interfaces used across export functionality
 */

export interface CollectionCardData {
  card: {
    id: string;
    name: string;
    setNumber?: string | null;
    description?: string | null;
    cost?: number | null;
    marketPrice?: number | null;
    type?: { name: string } | null;
    rarity?: { name: string } | null;
    set?: { name: string; code: string } | null;
    [key: string]: unknown;
  };
  quantity: number;
  condition?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExportOptions {
  includeMetadata?: boolean;
  includeConditions?: boolean;
  includeValues?: boolean;
  userId?: string;
  customFields?: string[];
  exportName?: string;
  onlyOwned?: boolean;
}

export interface ExportSetInfo {
  name?: string;
  code?: string;
  number?: string | null;
}

export interface ExportCardInfo {
  type?: string;
  rarity?: string;
  cost?: number | null;
  description?: string | null;
}

export interface ExportCardData {
  cardId: string;
  cardName: string;
  quantity: number;
  set: ExportSetInfo;
  cardInfo: ExportCardInfo;
  condition?: string;
  marketPrice?: number;
  totalValue?: number;
  metadata?: {
    addedDate: Date;
    lastUpdated: Date;
  };
  customData?: Record<string, unknown>;
}

export interface ExportInfo {
  format: string;
  version: string;
  exportedAt: string;
  exportedBy?: string;
  recordCount: number;
  exportOptions: ExportOptions;
}

export interface JSONExportData {
  exportInfo: ExportInfo;
  collection: ExportCardData[];
}

export interface ExportResult {
  content: string;
  contentType: string;
  filename: string;
}
