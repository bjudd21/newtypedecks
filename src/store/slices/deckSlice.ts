// Deck slice for Redux store
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Deck, DeckCard } from '@prisma/client';
import { CardWithRelations } from '@/lib/types/card';

// Types
interface DeckWithCards extends Deck {
  cards: (DeckCard & { card: CardWithRelations })[];
}

interface DeckState {
  decks: DeckWithCards[];
  currentDeck: DeckWithCards | null;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
}

// Initial state
const initialState: DeckState = {
  decks: [],
  currentDeck: null,
  isLoading: false,
  error: null,
  isEditing: false,
};

// Async thunks (will be implemented when APIs are ready)
// For now, we'll use simple actions without async thunks to avoid TypeScript issues

// Deck slice
const deckSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    setCurrentDeck: (state, action: PayloadAction<DeckWithCards | null>) => {
      state.currentDeck = action.payload;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Local deck editing actions (for optimistic updates)
    addCardToCurrentDeck: (
      state,
      action: PayloadAction<{
        card: CardWithRelations;
        quantity: number;
        category?: string;
      }>
    ) => {
      if (state.currentDeck) {
        const existingCard = state.currentDeck.cards.find(
          (deckCard) => deckCard.cardId === action.payload.card.id
        );

        if (existingCard) {
          existingCard.quantity += action.payload.quantity;
        } else {
          state.currentDeck.cards.push({
            id: `temp-${Date.now()}`,
            deckId: state.currentDeck.id,
            cardId: action.payload.card.id,
            quantity: action.payload.quantity,
            category: action.payload.category || null,
            card: action.payload.card,
          });
        }
      }
    },
    removeCardFromCurrentDeck: (state, action: PayloadAction<string>) => {
      if (state.currentDeck) {
        state.currentDeck.cards = state.currentDeck.cards.filter(
          (deckCard) => deckCard.cardId !== action.payload
        );
      }
    },
    updateCardQuantityInCurrentDeck: (
      state,
      action: PayloadAction<{ cardId: string; quantity: number }>
    ) => {
      if (state.currentDeck) {
        const deckCard = state.currentDeck.cards.find(
          (deckCard) => deckCard.cardId === action.payload.cardId
        );
        if (deckCard) {
          deckCard.quantity = action.payload.quantity;
        }
      }
    },
  },
  // extraReducers will be added when async thunks are implemented
});

export const {
  setCurrentDeck,
  setIsEditing,
  clearError,
  addCardToCurrentDeck,
  removeCardFromCurrentDeck,
  updateCardQuantityInCurrentDeck,
} = deckSlice.actions;
export default deckSlice.reducer;
