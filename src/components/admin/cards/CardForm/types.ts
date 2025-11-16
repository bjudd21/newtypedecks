/**
 * CardForm Type Definitions
 * Shared types for card form components
 */

export interface CardFormData {
  name: string;
  typeId: string;
  rarityId: string;
  setId: string;
  setNumber: string;
  imageUrl?: string;
  description?: string;
  officialText?: string;
  level?: number;
  cost?: number;
  clashPoints?: number;
  price?: number;
  hitPoints?: number;
  attackPoints?: number;
  faction?: string;
  pilot?: string;
  model?: string;
  series?: string;
  nation?: string;
  keywords?: string[];
  tags?: string[];
  isFoil?: boolean;
  isPromo?: boolean;
  isAlternate?: boolean;
  language?: string;
}

export interface ReferenceData {
  types: Array<{ id: string; name: string }>;
  rarities: Array<{ id: string; name: string; color: string }>;
  sets: Array<{ id: string; name: string; code: string }>;
}

export interface CardFormProps {
  initialData?: Partial<CardFormData>;
  onSubmit: (data: CardFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface SectionProps {
  formData: CardFormData;
  errors: Record<string, string>;
  referenceData?: ReferenceData;
  onChange: (field: keyof CardFormData, value: unknown) => void;
}
