/**
 * useAnonymousDeckStorage Hook
 * Manages anonymous deck persistence in localStorage and offline storage
 */

import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentDeck } from '@/store/slices/deckSlice';
import { urlDeckSharingService } from '@/lib/services/urlDeckSharingService';
import { pwaService } from '@/lib/services/pwaService';
import type { SaveStatus } from './useOfflineSync';
import type { CardWithRelations } from '@/lib/types/card';

const STORAGE_KEY = 'anonymous-deck';

interface DeckData {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  userId: string;
  gameId: string | null;
  visibility: 'DRAFT' | 'PRIVATE' | 'PUBLIC';
  deckCode: string | null;
  viewCount: number;
  likeCount: number;
  currentVersion: number;
  versionName: string | null;
  isTemplate: boolean;
  templateSource: string | null;
  createdAt: Date;
  updatedAt: Date;
  cards: Array<{
    id: string;
    deckId: string;
    cardId: string;
    quantity: number;
    category: string | null;
    card: CardWithRelations;
  }>;
}

export function useAnonymousDeckStorage(
  isOnline: boolean,
  setSaveStatus: (status: SaveStatus) => void,
  loadPendingSyncCount: () => Promise<void>
) {
  const dispatch = useDispatch();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Save deck to localStorage and optionally to offline storage
  const saveToLocalStorage = useCallback(
    async (deck: DeckData | null, saveOffline = false) => {
      if (deck) {
        setSaveStatus('saving');

        const deckToSave = {
          ...deck,
          updatedAt: new Date(),
        };

        // Always save to localStorage for immediate access
        localStorage.setItem(STORAGE_KEY, JSON.stringify(deckToSave));
        setLastSaved(new Date());

        // Save to offline storage if requested or if offline
        if (saveOffline || !isOnline) {
          try {
            await pwaService.saveOfflineDeck({
              id: deckToSave.id,
              name: deckToSave.name,
              cards: deckToSave.cards || [],
              createdAt: deckToSave.createdAt,
            });

            await loadPendingSyncCount();
            setSaveStatus(isOnline ? 'saved' : 'offline');
          } catch (error) {
            console.error('Failed to save deck offline:', error);
            setSaveStatus('error');
          }
        } else {
          setSaveStatus('saved');
        }
      }
    },
    [isOnline, setSaveStatus, loadPendingSyncCount]
  );

  // Initialize a new anonymous deck
  const initializeNewDeck = useCallback(() => {
    const newDeck: DeckData = {
      id: `anonymous-${Date.now()}`,
      name: 'My Anonymous Deck',
      description: 'Built without an account',
      isPublic: false,
      userId: 'anonymous',
      gameId: null,
      visibility: 'DRAFT',
      deckCode: null,
      viewCount: 0,
      likeCount: 0,
      currentVersion: 1,
      versionName: null,
      isTemplate: false,
      templateSource: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      cards: [],
    };
    dispatch(setCurrentDeck(newDeck));
    saveToLocalStorage(newDeck);
    return newDeck;
  }, [dispatch, saveToLocalStorage]);

  // Load deck from URL encoded data
  const loadDeckFromURL = useCallback(
    async (urlDeckData: unknown) => {
      try {
        const deckData = urlDeckData as {
          name?: string;
          description?: string;
          cards?: unknown[];
        };

        const newDeck: DeckData = {
          id: `shared-${Date.now()}`,
          name: deckData.name || 'Shared Deck',
          description: deckData.description || 'Loaded from shared URL',
          isPublic: false,
          userId: 'anonymous',
          gameId: null,
          visibility: 'DRAFT',
          deckCode: null,
          viewCount: 0,
          likeCount: 0,
          currentVersion: 1,
          versionName: null,
          isTemplate: false,
          templateSource: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
        };

        dispatch(setCurrentDeck(newDeck));
        await saveToLocalStorage(newDeck);

        console.warn(
          `TODO: Replace with proper UI notification - Loaded shared deck: "${deckData.name}". This deck contained ${deckData.cards?.length || 0} cards. You can now rebuild it using the card search, or import a complete deck file.`
        );
      } catch (error) {
        console.error('Failed to load deck from URL:', error);
        throw error;
      }
    },
    [dispatch, saveToLocalStorage]
  );

  // Load deck from URL or localStorage on mount
  useEffect(() => {
    const loadDeckFromSources = async () => {
      // First, check if there's a shared deck in the URL
      const urlDeckData = urlDeckSharingService.getDeckFromCurrentURL();

      if (urlDeckData) {
        try {
          const shouldLoad = true; // Auto-load for now
          if (shouldLoad) {
            await loadDeckFromURL(urlDeckData);
            urlDeckSharingService.clearDeckFromURL();
            return;
          }
        } catch (error) {
          console.error('Failed to load deck from URL:', error);
          console.warn(
            'TODO: Replace with proper UI notification - Failed to load shared deck. The URL may be corrupted or invalid.'
          );
        }
      }

      // If no URL deck or user declined, load from localStorage
      const savedDeck = localStorage.getItem(STORAGE_KEY);
      if (savedDeck) {
        try {
          const parsedDeck = JSON.parse(savedDeck);
          dispatch(setCurrentDeck(parsedDeck));
          setLastSaved(new Date(parsedDeck.updatedAt));
        } catch (error) {
          console.error('Failed to load saved deck:', error);
          initializeNewDeck();
        }
      } else {
        initializeNewDeck();
      }
    };

    loadDeckFromSources();
  }, [dispatch, initializeNewDeck, loadDeckFromURL]);

  return {
    lastSaved,
    saveToLocalStorage,
    initializeNewDeck,
  };
}
