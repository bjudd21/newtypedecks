/**
 * TypeScript type definitions for AdvancedFilters
 */

export interface FilterRange {
  min?: number;
  max?: number;
}

export interface AdvancedFilterOptions {
  // Text filters
  textFilters: {
    name?: string;
    description?: string;
    pilot?: string;
    model?: string;
    keywords?: string[];
    tags?: string[];
  };

  // Categorical filters
  categoricalFilters: {
    typeIds?: string[];
    rarityIds?: string[];
    setIds?: string[];
    factions?: string[];
    series?: string[];
    nations?: string[];
    languages?: string[];
  };

  // Range filters
  rangeFilters: {
    level?: FilterRange;
    cost?: FilterRange;
    clashPoints?: FilterRange;
    price?: FilterRange;
    hitPoints?: FilterRange;
    attackPoints?: FilterRange;
  };

  // Boolean filters
  booleanFilters: {
    isFoil?: boolean;
    isPromo?: boolean;
    isAlternate?: boolean;
  };

  // Date filters
  dateFilters: {
    releaseDate?: {
      from?: Date;
      to?: Date;
    };
    addedDate?: {
      from?: Date;
      to?: Date;
    };
  };
}

export interface ReferenceData {
  types: Array<{ id: string; name: string; count?: number }>;
  rarities: Array<{
    id: string;
    name: string;
    color: string;
    count?: number;
  }>;
  sets: Array<{ id: string; name: string; code: string; count?: number }>;
  factions: Array<{ name: string; count?: number }>;
  series: Array<{ name: string; count?: number }>;
}

export interface AdvancedFiltersProps {
  filters: AdvancedFilterOptions;
  onFiltersChange: (filters: AdvancedFilterOptions) => void;
  referenceData?: ReferenceData;
  className?: string;
}
