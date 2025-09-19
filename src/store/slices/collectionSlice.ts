// Collection slice for Redux store
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collection, CollectionCard, Card } from '@prisma/client';

// Types
interface CollectionWithCards extends Collection {
  cards: (CollectionCard & { card: Card })[];
}

interface CollectionState {
  collection: CollectionWithCards | null;
  isLoading: boolean;
  error: string | null;
  statistics: {
    totalCards: number;
    uniqueCards: number;
    totalValue: number;
    completionPercentage: number;
  };
}

// Initial state
const initialState: CollectionState = {
  collection: null,
  isLoading: false,
  error: null,
  statistics: {
    totalCards: 0,
    uniqueCards: 0,
    totalValue: 0,
    completionPercentage: 0,
  },
};

// Async thunks (will be implemented when APIs are ready)
// For now, we'll use simple actions without async thunks to avoid TypeScript issues

// Collection slice
const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStatistics: (state) => {
      if (state.collection) {
        const totalCards = state.collection.cards.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const uniqueCards = state.collection.cards.length;

        state.statistics = {
          totalCards,
          uniqueCards,
          totalValue: 0, // Will be calculated when we have card values
          completionPercentage: 0, // Will be calculated based on total available cards
        };
      }
    },
    // Local collection editing actions (for optimistic updates)
    addCardToCollectionLocal: (
      state,
      action: PayloadAction<{ card: Card; quantity: number }>
    ) => {
      if (state.collection) {
        const existingCard = state.collection.cards.find(
          (collectionCard) => collectionCard.cardId === action.payload.card.id
        );

        if (existingCard) {
          existingCard.quantity += action.payload.quantity;
        } else {
          state.collection.cards.push({
            id: `temp-${Date.now()}`,
            collectionId: state.collection.id,
            cardId: action.payload.card.id,
            quantity: action.payload.quantity,
            card: action.payload.card,
          });
        }

        // Update statistics
        collectionSlice.caseReducers.updateStatistics(state);
      }
    },
    removeCardFromCollectionLocal: (state, action: PayloadAction<string>) => {
      if (state.collection) {
        state.collection.cards = state.collection.cards.filter(
          (collectionCard) => collectionCard.cardId !== action.payload
        );

        // Update statistics
        collectionSlice.caseReducers.updateStatistics(state);
      }
    },
    updateCardQuantityLocal: (
      state,
      action: PayloadAction<{ cardId: string; quantity: number }>
    ) => {
      if (state.collection) {
        const collectionCard = state.collection.cards.find(
          (collectionCard) => collectionCard.cardId === action.payload.cardId
        );
        if (collectionCard) {
          collectionCard.quantity = action.payload.quantity;
        }

        // Update statistics
        collectionSlice.caseReducers.updateStatistics(state);
      }
    },
  },
  // extraReducers will be added when async thunks are implemented
});

export const {
  clearError,
  updateStatistics,
  addCardToCollectionLocal,
  removeCardFromCollectionLocal,
  updateCardQuantityLocal,
} = collectionSlice.actions;
export default collectionSlice.reducer;
