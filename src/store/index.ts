// Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Import slices
import authSlice from './slices/authSlice';
import cardSlice from './slices/cardSlice';
import deckSlice from './slices/deckSlice';
import collectionSlice from './slices/collectionSlice';
import uiSlice from './slices/uiSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    cards: cardSlice,
    decks: deckSlice,
    collections: collectionSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'meta.arg',
          'payload.timestamp',
          'payload.createdAt',
          'payload.updatedAt',
          'payload.emailVerified',
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'items.dates',
          'auth.user.createdAt',
          'auth.user.updatedAt',
          'auth.user.emailVerified',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
