// Global type definitions for the Gundam Card Game application
// This file serves as the central location for all TypeScript type definitions

// Export all card-related types
export * from './card';

// Export all collection-related types
export * from './collection';

// Re-export Prisma types for convenience
export type {
  User,
  UserRole,
  Card,
  CardType,
  Rarity,
  Set,
  Deck,
  DeckCard,
  Collection,
  CollectionCard,
  CardRuling,
} from '@prisma/client';

// Common utility types
export type ID = string;
export type Timestamp = Date;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form and validation types
export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// UI component types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Search and filter types
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

// File upload types
export interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  file?: {
    name: string;
    size: number;
    type: string;
  };
}

// Environment and configuration types
export interface AppConfig {
  apiUrl: string;
  uploadUrl: string;
  maxFileSize: number;
  supportedFormats: string[];
  features: {
    deckBuilding: boolean;
    collection: boolean;
    trading: boolean;
    tournaments: boolean;
  };
}

// Legacy types for backward compatibility
export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Environment types
export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL: string;
  REDIS_URL: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
}
