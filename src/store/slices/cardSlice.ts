// Card slice for Redux store
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Card, CardType, Rarity, Set } from '@prisma/client';

// Types
interface CardWithRelations extends Card {
  type: CardType;
  rarity: Rarity;
  set: Set;
}

interface CardState {
  cards: CardWithRelations[];
  cardTypes: CardType[];
  rarities: Rarity[];
  sets: Set[];
  selectedCard: CardWithRelations | null;
  searchQuery: string;
  filters: {
    type?: string;
    rarity?: string;
    set?: string;
    level?: number;
    cost?: number;
  };
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Initial state
const initialState: CardState = {
  cards: [],
  cardTypes: [],
  rarities: [],
  sets: [],
  selectedCard: null,
  searchQuery: '',
  filters: {},
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
  },
};

// Async thunks (will be implemented when APIs are ready)
// For now, we'll use simple actions without async thunks to avoid TypeScript issues

// Card slice
const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<CardState['filters']>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedCard: (
      state,
      action: PayloadAction<CardWithRelations | null>
    ) => {
      state.selectedCard = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPagination: (state) => {
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: false,
      };
    },
  },
  // extraReducers will be added when async thunks are implemented
});

export const {
  setSearchQuery,
  setFilters,
  clearFilters,
  setSelectedCard,
  clearError,
  resetPagination,
} = cardSlice.actions;
export default cardSlice.reducer;
