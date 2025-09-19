// UI slice for Redux store
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  loading: {
    global: boolean;
    cards: boolean;
    decks: boolean;
    collections: boolean;
  };
  notifications: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }[];
  modals: {
    cardDetail: boolean;
    deckBuilder: boolean;
    collectionManager: boolean;
    userProfile: boolean;
  };
  search: {
    query: string;
    filters: Record<string, unknown>;
    results: unknown[];
    isSearching: boolean;
  };
}

// Initial state
const initialState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  mobileMenuOpen: false,
  loading: {
    global: false,
    cards: false,
    decks: false,
    collections: false,
  },
  notifications: [],
  modals: {
    cardDetail: false,
    deckBuilder: false,
    collectionManager: false,
    userProfile: false,
  },
  search: {
    query: '',
    filters: {},
    results: [],
    isSearching: false,
  },
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // Sidebar actions
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Mobile menu actions
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    // Loading actions
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setCardsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.cards = action.payload;
    },
    setDecksLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.decks = action.payload;
    },
    setCollectionsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.collections = action.payload;
    },

    // Notification actions
    addNotification: (
      state,
      action: PayloadAction<{
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        duration?: number;
      }>
    ) => {
      const notification = {
        id: `notification-${Date.now()}-${Math.random()}`,
        ...action.payload,
        duration: action.payload.duration || 5000,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modal actions
    setModalOpen: (
      state,
      action: PayloadAction<{
        modal: keyof UIState['modals'];
        open: boolean;
      }>
    ) => {
      state.modals[action.payload.modal] = action.payload.open;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modal) => {
        state.modals[modal as keyof UIState['modals']] = false;
      });
    },

    // Search actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.search.query = action.payload;
    },
    setSearchFilters: (
      state,
      action: PayloadAction<Record<string, unknown>>
    ) => {
      state.search.filters = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<unknown[]>) => {
      state.search.results = action.payload;
    },
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.search.isSearching = action.payload;
    },
    clearSearch: (state) => {
      state.search.query = '';
      state.search.filters = {};
      state.search.results = [];
      state.search.isSearching = false;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setMobileMenuOpen,
  toggleMobileMenu,
  setGlobalLoading,
  setCardsLoading,
  setDecksLoading,
  setCollectionsLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  setModalOpen,
  closeAllModals,
  setSearchQuery,
  setSearchFilters,
  setSearchResults,
  setSearching,
  clearSearch,
} = uiSlice.actions;
export default uiSlice.reducer;
