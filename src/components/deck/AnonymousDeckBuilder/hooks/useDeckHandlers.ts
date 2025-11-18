'use client';
/**
 * Custom hook for deck event handlers
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  addCardToCurrentDeck,
  removeCardFromCurrentDeck,
  updateCardQuantityInCurrentDeck,
  setIsEditing,
  setCurrentDeck,
} from '@/store/slices/deckSlice';
import type { CardWithRelations } from '@/lib/types/card';
import type { ExportFormat, ShareableDeck, ExportableDeck } from '../types';

interface UseDeckHandlersOptions {
  searchResults: CardWithRelations[];
  initializeNewDeck: () => void;
  handleShareDeck: (deck: ShareableDeck | null) => void;
  exportDeck: (
    deck: ExportableDeck | null,
    deckName: string,
    format: ExportFormat
  ) => void;
  deckName: string;
}

export function useDeckHandlers({
  searchResults,
  initializeNewDeck,
  handleShareDeck,
  exportDeck,
  deckName,
}: UseDeckHandlersOptions) {
  const dispatch = useDispatch();
  const { currentDeck } = useSelector((state: RootState) => state.decks);

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

  // Handle card drops into deck areas
  const handleCardDrop = useCallback(
    (cardId: string, _action: 'move' | 'copy') => {
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
        const updatedDeck = { ...currentDeck, name };
        dispatch(setCurrentDeck(updatedDeck));
      }
    },
    [currentDeck, dispatch]
  );

  // Clear current deck and start fresh
  const handleNewDeck = useCallback(() => {
    if (currentDeck?.cards?.length && currentDeck.cards.length > 0) {
      console.warn('TODO: Replace with proper UI confirmation dialog');
    }
    initializeNewDeck();
    dispatch(setIsEditing(true));
  }, [currentDeck, initializeNewDeck, dispatch]);

  // Handle deck sharing
  const handleShare = useCallback(() => {
    if (!currentDeck) return;

    const shareableDeck = {
      id: currentDeck.id,
      name: currentDeck.name,
      description: currentDeck.description || undefined,
      format: undefined,
      createdAt: currentDeck.createdAt,
      cards: currentDeck.cards.map((deckCard) => ({
        cardId: deckCard.cardId,
        card: deckCard.card,
        quantity: deckCard.quantity,
        category: deckCard.category || 'main',
      })),
    };

    handleShareDeck(shareableDeck);
  }, [currentDeck, handleShareDeck]);

  // Handle deck export
  const handleExportClick = useCallback(
    (format: ExportFormat) => {
      exportDeck(currentDeck, deckName, format);
    },
    [currentDeck, deckName, exportDeck]
  );

  return {
    handleCardSelect,
    handleQuantityChange,
    handleCardDrop,
    handleDeckNameChange,
    handleNewDeck,
    handleShare,
    handleExportClick,
  };
}
