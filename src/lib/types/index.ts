// Core types for the Gundam Card Game website

export interface Card {
  id: string;
  name: string;
  level: number;
  cost: number;
  type: CardType;
  rarity: Rarity;
  set: string;
  setNumber: string;
  imageUrl: string;
  imageUrlSmall?: string;
  imageUrlLarge?: string;
  description: string;
  rulings?: string;
  officialText?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardType {
  id: string;
  name: string;
  description?: string;
}

export interface Rarity {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Set {
  id: string;
  name: string;
  code: string;
  releaseDate: Date;
  description?: string;
  imageUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  name: 'USER' | 'ADMIN' | 'MODERATOR';
  permissions: string[];
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  userId: string;
  cards: DeckCard[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeckCard {
  id: string;
  deckId: string;
  cardId: string;
  quantity: number;
  category?: string;
  card: Card;
}

export interface Collection {
  id: string;
  userId: string;
  cards: CollectionCard[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionCard {
  id: string;
  collectionId: string;
  cardId: string;
  quantity: number;
  card: Card;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and filter types
export interface CardSearchFilters {
  name?: string;
  level?: number;
  cost?: number;
  type?: string;
  rarity?: string;
  set?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'level' | 'cost' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

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
