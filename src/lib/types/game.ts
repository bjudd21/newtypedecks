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
  type: 'text' | 'number' | 'boolean' | 'select';
  /** Valid options for select-type fields (e.g. One Piece colors, attributes) */
  options?: string[];
}

export interface CardSchema {
  fields: CardSchemaField[];
  customFields: CardSchemaCustomField[];
}

export interface DeckZone {
  key: string;
  label: string;
  required: boolean;
  minSize?: number;
  maxSize?: number;
  /** When true, this zone is auto-managed (e.g. DON!! deck) and skips card-selection validation */
  autoManaged?: boolean;
}

export interface DeckRules {
  minDeckSize: number;
  maxDeckSize: number;
  maxCopiesPerCard: number;
  /** Number of cards drawn for an opening hand. Defaults to 5. */
  startingHandSize?: number;
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

/**
 * Runtime validation for GameConfig JSONB from the database.
 * Throws if the config is structurally invalid; returns typed config if valid.
 */
export function validateGameConfig(config: unknown): GameConfig {
  if (typeof config !== 'object' || config === null) {
    throw new Error('GameConfig must be an object');
  }
  const c = config as Record<string, unknown>;
  if (!c.cardSchema || typeof c.cardSchema !== 'object') {
    throw new Error('GameConfig.cardSchema is required');
  }
  if (!c.deckRules || typeof c.deckRules !== 'object') {
    throw new Error('GameConfig.deckRules is required');
  }
  return config as GameConfig;
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
