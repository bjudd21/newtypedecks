'use client';
/**
 * Custom hook for managing deck builder local state
 */

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentDeck } from '@/store/slices/deckSlice';
import { createNewDeck } from '../deckFactory';
import type { Deck, DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckWithCards extends Deck {
  cards: (DeckCard & { card: CardWithRelations })[];
}

interface UseDeckStateOptions {
  currentDeck: DeckWithCards | null;
  isAuthenticated: boolean;
  userId?: string;
}

export function useDeckState({
  currentDeck,
  isAuthenticated,
  userId,
}: UseDeckStateOptions) {
  const dispatch = useDispatch();

  // Deck metadata state
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [deckFormat, setDeckFormat] = useState('Standard');
  const [isPublic, setIsPublic] = useState(false);
  const [savedDeckId, setSavedDeckId] = useState<string | null>(null);

  // UI state
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showTemplateCreator, setShowTemplateCreator] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize deck on mount or when currentDeck changes
  useEffect(() => {
    if (!currentDeck) {
      const newDeck = createNewDeck(isAuthenticated, userId);
      dispatch(setCurrentDeck(newDeck));
      setDeckName(newDeck.name);
      setDeckDescription(newDeck.description || '');
    } else {
      setDeckName(currentDeck.name);
      setDeckDescription(currentDeck.description || '');
      // Check if this is a saved deck
      if (!currentDeck.id.startsWith('temp-')) {
        setSavedDeckId(currentDeck.id);
      }
    }
  }, [currentDeck, dispatch, isAuthenticated, userId]);

  return {
    // Metadata
    deckName,
    setDeckName,
    deckDescription,
    setDeckDescription,
    deckFormat,
    setDeckFormat,
    isPublic,
    setIsPublic,
    savedDeckId,
    setSavedDeckId,

    // UI toggles
    showVersionHistory,
    setShowVersionHistory,
    showTemplateCreator,
    setShowTemplateCreator,
    showAnalytics,
    setShowAnalytics,

    // Search
    searchQuery,
    setSearchQuery,
  };
}
