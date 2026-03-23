/**
 * Type definitions for admin games management page
 */

export interface AdminGame {
  id: string;
  slug: string;
  name: string;
  shortName?: string | null;
  publisher?: string | null;
  isActive: boolean;
  sortOrder: number;
  config: unknown;
  cardCount: number;
  deckCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameFormData {
  slug: string;
  name: string;
  shortName: string;
  publisher: string;
  isActive: boolean;
  sortOrder: number;
  configJson: string; // raw JSON string, validated before submit
}

export const EMPTY_GAME_FORM: GameFormData = {
  slug: '',
  name: '',
  shortName: '',
  publisher: '',
  isActive: true,
  sortOrder: 0,
  configJson: JSON.stringify(
    {
      cardSchema: {
        standardFields: [],
        customFields: [],
      },
      cardTypes: [],
      deckRules: {
        minDeckSize: 50,
        maxDeckSize: 50,
        maxCopiesPerCard: 4,
        zones: [],
        specialRules: [],
      },
      legalDisclaimer: '',
      copyrightNotice: '',
      nonAffiliationStatement: '',
    },
    null,
    2
  ),
};
