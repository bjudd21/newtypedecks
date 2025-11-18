'use client';
/**
 * Custom hook for deck builder event handlers
 */

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setCurrentDeck,
  addCardToCurrentDeck,
  removeCardFromCurrentDeck,
  updateCardQuantityInCurrentDeck,
  setIsEditing,
} from '@/store/slices/deckSlice';
import { deckExporter } from '@/lib/services/deckExportService';
import { createNewDeck } from '../deckFactory';
import type { CardWithRelations } from '@/lib/types/card';
import type { Deck, DeckCard } from '@prisma/client';

interface DeckWithCards extends Deck {
  cards: (DeckCard & { card: CardWithRelations })[];
}

interface UseDeckHandlersOptions {
  currentDeck: DeckWithCards | null;
  deckName: string;
  deckDescription: string;
  deckFormat: string;
  isPublic: boolean;
  savedDeckId: string | null;
  setSavedDeckId: (id: string | null) => void;
  isAuthenticated: boolean;
  userId?: string;
  createDeck: (data: {
    name: string;
    description?: string;
    format?: string;
    isPublic?: boolean;
    cards: {
      cardId: string;
      card: CardWithRelations;
      quantity: number;
      category?: string;
    }[];
  }) => Promise<unknown>;
  updateDeck: (
    id: string,
    data: {
      name?: string;
      description?: string;
      format?: string;
      isPublic?: boolean;
      cards?: {
        cardId: string;
        card: CardWithRelations;
        quantity: number;
        category?: string;
      }[];
    }
  ) => Promise<unknown>;
  clearError: () => void;
}

export function useDeckHandlers({
  currentDeck,
  deckName,
  deckDescription,
  deckFormat,
  isPublic,
  savedDeckId,
  setSavedDeckId,
  isAuthenticated,
  userId,
  createDeck,
  updateDeck,
  clearError,
}: UseDeckHandlersOptions) {
  const dispatch = useDispatch();

  // Store search results for drag-and-drop
  const [searchResults, setSearchResults] = useState<CardWithRelations[]>([]);

  // Handle card selection from search
  const handleCardSelect = useCallback(
    (card: CardWithRelations) => {
      if (currentDeck) {
        dispatch(
          addCardToCurrentDeck({
            card,
            quantity: 1,
            category: 'main',
          })
        );
      }
    },
    [currentDeck, dispatch]
  );

  // Handle card quantity updates
  const handleQuantityChange = useCallback(
    (cardId: string, quantity: number) => {
      if (quantity <= 0) {
        dispatch(removeCardFromCurrentDeck(cardId));
      } else {
        dispatch(updateCardQuantityInCurrentDeck({ cardId, quantity }));
      }
    },
    [dispatch]
  );

  // Handle search results to enable drag-and-drop
  const handleSearchResults = useCallback((cards: CardWithRelations[]) => {
    setSearchResults(cards);
  }, []);

  // Handle card drops into deck areas
  const handleCardDrop = useCallback(
    (cardId: string, _action: 'move' | 'copy') => {
      // Find the card in search results
      const card = searchResults.find((c) => c.id === cardId);
      if (card) {
        handleCardSelect(card);
      }
    },
    [searchResults, handleCardSelect]
  );

  // Handle deck name change
  const handleDeckNameChange = useCallback(
    (name: string) => {
      if (currentDeck) {
        dispatch(
          setCurrentDeck({
            ...currentDeck,
            name,
          })
        );
      }
    },
    [currentDeck, dispatch]
  );

  // Handle creating a new deck
  const handleNewDeck = useCallback(() => {
    const newDeck = createNewDeck(isAuthenticated, userId);
    dispatch(setCurrentDeck(newDeck));
    setSavedDeckId(null);
    dispatch(setIsEditing(true));
  }, [isAuthenticated, userId, dispatch, setSavedDeckId]);

  // Handle save deck
  const handleSaveDeck = useCallback(async () => {
    if (!isAuthenticated) {
      console.warn('Please sign in to save decks!');
      return;
    }

    if (!currentDeck || currentDeck.cards.length === 0) {
      console.warn('Cannot save an empty deck!');
      return;
    }

    clearError();

    const deckData = {
      name: deckName.trim() || 'Untitled Deck',
      description: deckDescription.trim(),
      format: deckFormat,
      isPublic,
      cards: currentDeck.cards.map((deckCard) => ({
        cardId: deckCard.cardId || deckCard.card.id,
        card: deckCard.card,
        quantity: deckCard.quantity,
        category: deckCard.category || 'main',
      })),
    };

    try {
      if (savedDeckId) {
        // Update existing deck
        const updatedDeck = await updateDeck(savedDeckId, deckData);
        if (updatedDeck) {
          console.warn('Deck updated successfully!');
        }
      } else {
        // Create new deck
        const newDeck = (await createDeck(deckData)) as {
          id: string;
          name: string;
          description: string | null;
        } | null;
        if (newDeck && currentDeck) {
          setSavedDeckId(newDeck.id);
          // Update current deck with saved ID
          dispatch(
            setCurrentDeck({
              ...currentDeck,
              id: newDeck.id,
              name: newDeck.name,
              description: newDeck.description,
              userId: userId || 'authenticated',
            })
          );
          console.warn('Deck saved successfully!');
        }
      }
    } catch (error) {
      console.error('Save deck error:', error);
    }
  }, [
    isAuthenticated,
    currentDeck,
    deckName,
    deckDescription,
    deckFormat,
    isPublic,
    savedDeckId,
    createDeck,
    updateDeck,
    clearError,
    dispatch,
    setSavedDeckId,
    userId,
  ]);

  // Handle deck export
  const handleExport = useCallback(
    (format: 'json' | 'text' | 'csv' | 'mtga') => {
      if (!currentDeck || currentDeck.cards.length === 0) return;

      const exportableDeck = {
        name: deckName,
        description: 'Exported from Gundam Card Game Builder',
        cards: currentDeck.cards.map((deckCard) => ({
          card: deckCard.card,
          quantity: deckCard.quantity,
          category: deckCard.category || 'main',
        })),
        createdAt: new Date(),
      };

      const options = {
        format,
        includeMetadata: true,
        includeStats: format === 'text',
        groupByType: format === 'text',
        sortBy: 'name' as const,
        sortOrder: 'asc' as const,
      };

      try {
        deckExporter.downloadDeck(exportableDeck, options);
      } catch (error) {
        console.error('Export failed:', error);
        console.warn('Export failed. Please try again.');
      }
    },
    [currentDeck, deckName]
  );

  return {
    handleCardSelect,
    handleQuantityChange,
    handleSearchResults,
    handleCardDrop,
    handleDeckNameChange,
    handleNewDeck,
    handleSaveDeck,
    handleExport,
    searchResults,
  };
}
