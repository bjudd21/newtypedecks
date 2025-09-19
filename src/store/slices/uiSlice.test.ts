// Test file for UI slice
import uiSlice, {
  setTheme,
  toggleTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setModalOpen,
  closeAllModals,
  setSearchQuery,
  clearSearch,
} from './uiSlice';

describe('UI Slice', () => {
  const initialState = {
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

  it('should return the initial state', () => {
    expect(uiSlice(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setTheme', () => {
    const actual = uiSlice(initialState, setTheme('dark'));
    expect(actual.theme).toEqual('dark');
  });

  it('should handle toggleTheme', () => {
    const actual = uiSlice(initialState, toggleTheme());
    expect(actual.theme).toEqual('dark');

    const actual2 = uiSlice({ ...initialState, theme: 'dark' }, toggleTheme());
    expect(actual2.theme).toEqual('light');
  });

  it('should handle addNotification', () => {
    const notification = {
      type: 'success' as const,
      message: 'Test notification',
      duration: 5000,
    };

    const actual = uiSlice(initialState, addNotification(notification));
    expect(actual.notifications).toHaveLength(1);
    expect(actual.notifications[0]).toMatchObject({
      type: 'success',
      message: 'Test notification',
      duration: 5000,
    });
    expect(actual.notifications[0].id).toBeDefined();
  });

  it('should handle removeNotification', () => {
    const stateWithNotification = {
      ...initialState,
      notifications: [
        {
          id: 'test-id',
          type: 'success' as const,
          message: 'Test notification',
          duration: 5000,
        },
      ],
    };

    const actual = uiSlice(
      stateWithNotification,
      removeNotification('test-id')
    );
    expect(actual.notifications).toHaveLength(0);
  });

  it('should handle clearNotifications', () => {
    const stateWithNotifications = {
      ...initialState,
      notifications: [
        {
          id: 'test-id-1',
          type: 'success' as const,
          message: 'Test notification 1',
          duration: 5000,
        },
        {
          id: 'test-id-2',
          type: 'error' as const,
          message: 'Test notification 2',
          duration: 5000,
        },
      ],
    };

    const actual = uiSlice(stateWithNotifications, clearNotifications());
    expect(actual.notifications).toHaveLength(0);
  });

  it('should handle setModalOpen', () => {
    const actual = uiSlice(
      initialState,
      setModalOpen({ modal: 'cardDetail', open: true })
    );
    expect(actual.modals.cardDetail).toBe(true);
    expect(actual.modals.deckBuilder).toBe(false);
  });

  it('should handle closeAllModals', () => {
    const stateWithOpenModals = {
      ...initialState,
      modals: {
        cardDetail: true,
        deckBuilder: true,
        collectionManager: false,
        userProfile: false,
      },
    };

    const actual = uiSlice(stateWithOpenModals, closeAllModals());
    expect(actual.modals.cardDetail).toBe(false);
    expect(actual.modals.deckBuilder).toBe(false);
    expect(actual.modals.collectionManager).toBe(false);
    expect(actual.modals.userProfile).toBe(false);
  });

  it('should handle setSearchQuery', () => {
    const actual = uiSlice(initialState, setSearchQuery('test query'));
    expect(actual.search.query).toBe('test query');
  });

  it('should handle clearSearch', () => {
    const stateWithSearch = {
      ...initialState,
      search: {
        query: 'test query',
        filters: { type: 'Mobile Suit' },
        results: [{ id: '1' }],
        isSearching: true,
      },
    };

    const actual = uiSlice(stateWithSearch, clearSearch());
    expect(actual.search.query).toBe('');
    expect(actual.search.filters).toEqual({});
    expect(actual.search.results).toEqual([]);
    expect(actual.search.isSearching).toBe(false);
  });
});
