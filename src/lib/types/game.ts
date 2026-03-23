/**
 * Game Definition System types
 *
 * Each TCG is a database record with a GameConfig JSONB column that drives
 * the entire app: card schema, deck rules, filter options, legal text, branding.
 */

export interface CardSchemaField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean';
  required: boolean;
}

export interface CardSchemaCustomField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean';
}

export interface CardSchema {
  fields: CardSchemaField[];
  customFields: CardSchemaCustomField[];
}

export interface DeckZone {
  key: string;
  label: string;
  required: boolean;
}

export interface DeckRules {
  minDeckSize: number;
  maxDeckSize: number;
  maxCopiesPerCard: number;
  zones: DeckZone[];
  specialRules: string[];
}

export interface GameConfig {
  cardSchema: CardSchema;
  deckRules: DeckRules;
  cardTypes: string[];
  rarities: string[];
  importFormats: string[];
  exportFormats: string[];
  legalDisclaimer: string;
  copyrightNotice: string;
  nonAffiliationStatement: string;
  keywords?: string[];
}

/** Game record with strongly-typed config (augments the Prisma Game type). */
export interface GameWithConfig {
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  publisher: string | null;
  copyrightHolder: string | null;
  logoUrl: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  config: GameConfig;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
