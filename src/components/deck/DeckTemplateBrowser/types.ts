/**
 * Type definitions for DeckTemplateBrowser components
 */

export interface DeckTemplate {
  id: string;
  name: string;
  description?: string;
  templateSource?: string;
  creator: {
    id: string;
    name?: string;
    image?: string;
  };
  cardCount: number;
  uniqueCards: number;
  totalCost: number;
  colors: string[];
  usageCount: number;
  favoriteCount: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateCustomizations {
  name?: string;
  description?: string;
  format?: string;
  isPublic?: boolean;
  [key: string]: unknown;
}

export interface DeckTemplateBrowserProps {
  onTemplateSelect?: (template: DeckTemplate) => void;
  onCreateFromTemplate?: (
    templateId: string,
    customizations?: TemplateCustomizations
  ) => void;
  className?: string;
}

export interface TemplateFilters {
  searchQuery: string;
  sourceFilter: string;
  sortBy: string;
}
