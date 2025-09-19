// Test utilities for React Testing Library
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Import slices
import authSlice from '@/store/slices/authSlice';
import cardSlice from '@/store/slices/cardSlice';
import deckSlice from '@/store/slices/deckSlice';
import collectionSlice from '@/store/slices/collectionSlice';
import uiSlice from '@/store/slices/uiSlice';

// Create a test store with initial state
export function createTestStore(preloadedState: Record<string, unknown> = {}) {
  return configureStore({
    reducer: {
      auth: authSlice,
      cards: cardSlice,
      decks: deckSlice,
      collections: collectionSlice,
      ui: uiSlice,
    },
    preloadedState,
  });
}

// Custom render function that includes Redux Provider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Record<string, unknown>;
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Mock data generators for tests only
export const mockCard = {
  id: 'test-card-1',
  name: 'Test Gundam',
  level: 3,
  cost: 2,
  typeId: 'test-type-1',
  rarityId: 'test-rarity-1',
  setId: 'test-set-1',
  setNumber: '001',
  imageUrl: '/test-image.jpg',
  imageUrlSmall: '/test-image-small.jpg',
  imageUrlLarge: '/test-image-large.jpg',
  description: 'A test Gundam card',
  rulings: 'Test rulings',
  officialText: 'Test official text',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  type: {
    id: 'test-type-1',
    name: 'Mobile Suit',
    description: 'A mobile suit card',
  },
  rarity: {
    id: 'test-rarity-1',
    name: 'Common',
    color: '#808080',
    description: 'Common rarity',
  },
  set: {
    id: 'test-set-1',
    name: 'Test Set',
    code: 'TS',
    releaseDate: new Date('2024-01-01'),
    description: 'A test set',
    imageUrl: '/test-set-image.jpg',
  },
};

export const mockUser = {
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  image: '/test-avatar.jpg',
  role: 'USER' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockDeck = {
  id: 'test-deck-1',
  name: 'Test Deck',
  description: 'A test deck',
  isPublic: false,
  userId: 'test-user-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  cards: [
    {
      id: 'test-deck-card-1',
      deckId: 'test-deck-1',
      cardId: 'test-card-1',
      quantity: 3,
      category: 'Main',
      card: mockCard,
    },
  ],
};

export const mockCollection = {
  id: 'test-collection-1',
  userId: 'test-user-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  cards: [
    {
      id: 'test-collection-card-1',
      collectionId: 'test-collection-1',
      cardId: 'test-card-1',
      quantity: 2,
      card: mockCard,
    },
  ],
};

// Helper functions for common test scenarios
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export const createMockEvent = (target: Record<string, unknown> = {}) => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  target,
});

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
