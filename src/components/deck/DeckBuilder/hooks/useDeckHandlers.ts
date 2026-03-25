'use client';
/**
 * Custom hook for deck builder event handlers
 */

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGame } from '@/contexts/GameContext';
import {
  setCurrentDeck,
  addCardToCurrentDeck,
  removeCardFromCurrentDeck,
  updateCardQuantityInCurrentDeck,
  updateCardUserCategoryInCurrentDeck,
  setDeckCategories,
  setIsEditing,
} from '@/store/slices/deckSlice';
import {
  defaultCategoriesFromCardTypes,
  parseDeckCategories,
  type DeckCategory,
} from '@/lib/types/deck';
import { deckExporter } from '@/lib/services/deckExportService';
import { createNewDeck } from '../deckFactory';
import type { CardWithRelations } from '@/lib/types/card';
import type {
  Deck,
  DeckCard,
  DeckVisibility,
  DeckRuleset,
} from '@prisma/client';

interface DeckWithCards extends Deck {
  cards: (DeckCard & { card: CardWithRelations })[];
}

interface UseDeckHandlersOptions {
  currentDeck: DeckWithCards | null;
  deckName: string;
  deckDescription: string;
  deckFormat: string;
  visibility: DeckVisibility;
  ruleset: DeckRuleset;
  savedDeckId: string | null;
  setSavedDeckId: (id: string | null) => void;
  setDeckCode: (code: string | null) => void;
  isAuthenticated: boolean;
  userId?: string;
  createDeck: (data: {
    name: string;
    description?: string;
    format?: string;
    visibility?: DeckVisibility;
    ruleset?: DeckRuleset;
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
      visibility?: DeckVisibility;
      ruleset?: DeckRuleset;
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
  visibility,
  ruleset,
  savedDeckId,
  setSavedDeckId,
  setDeckCode,
  isAuthenticated,
  userId,
  createDeck,
  updateDeck,
  clearError,
}: UseDeckHandlersOptions) {
  const dispatch = useDispatch();
  const game = useGame();

  // Store search results for drag-and-drop
  const [searchResults, setSearchResults] = useState<CardWithRelations[]>([]);

  // Handle card selection from search — auto-route Leaders to 'leader' zone
  const handleCardSelect = useCallback(
    (card: CardWithRelations) => {
      if (currentDeck) {
        const zones = game?.config?.deckRules?.zones ?? [];
        const hasLeaderZone = zones.some((z) => z.key === 'leader');
        const isLeaderCard = card.type?.name?.toLowerCase() === 'leader';
        const category = hasLeaderZone && isLeaderCard ? 'leader' : 'main';
        dispatch(
          addCardToCurrentDeck({
            card,
            quantity: 1,
            category,
          })
        );
      }
    },
    [currentDeck, dispatch, game]
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

  // Handle creating a new deck — initialize categories from card types
  const handleNewDeck = useCallback(() => {
    const cardTypes = game?.config?.cardTypes ?? [];
    const newDeck = createNewDeck(isAuthenticated, userId, cardTypes);
    dispatch(setCurrentDeck(newDeck));
    setSavedDeckId(null);
    dispatch(setIsEditing(true));
  }, [isAuthenticated, userId, dispatch, setSavedDeckId, game]);

  // Handle save deck
  const handleSaveDeck = useCallback(async () => {
    if (!isAuthenticated) {
      console.warn('Please sign in to save decks!');
      return;
    }

    // Non-draft decks must have at least one card
    if (
      visibility !== 'DRAFT' &&
      (!currentDeck || currentDeck.cards.length === 0)
    ) {
      console.warn('Cannot save an empty deck as Private or Public!');
      return;
    }

    clearError();

    const rawCategories = (currentDeck as unknown as Record<string, unknown>)
      ?.categories;
    const deckData = {
      name: deckName.trim() || 'Untitled Deck',
      description: deckDescription.trim(),
      format: deckFormat,
      visibility,
      ruleset,
      categories: parseDeckCategories(rawCategories),
      cards: (currentDeck?.cards ?? []).map((deckCard) => ({
        cardId: deckCard.cardId || deckCard.card.id,
        card: deckCard.card,
        quantity: deckCard.quantity,
        category: deckCard.category || 'main',
        userCategory: deckCard.userCategory ?? null,
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
          deckCode?: string | null;
        } | null;
        if (newDeck && currentDeck) {
          setSavedDeckId(newDeck.id);
          setDeckCode(newDeck.deckCode ?? null);
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
    visibility,
    ruleset,
    savedDeckId,
    createDeck,
    updateDeck,
    clearError,
    dispatch,
    setSavedDeckId,
    setDeckCode,
    userId,
  ]);

  // Handle deck export
  const handleExport = useCallback(
    (format: 'json' | 'text' | 'csv' | 'mtga') => {
      if (!currentDeck || currentDeck.cards.length === 0) return;

      const exportableDeck = {
        name: deckName,
        description: `Exported from ${game.name} Builder`,
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
        gameName: game.name,
        customFields: game.config.cardSchema.customFields,
      };

      try {
        deckExporter.downloadDeck(exportableDeck, options);
      } catch (error) {
        console.error('Export failed:', error);
        console.warn('Export failed. Please try again.');
      }
    },
    [currentDeck, deckName, game]
  );

  // Reassign a card to a different user category
  const handleUserCategoryChange = useCallback(
    (cardId: string, userCategory: string | null) => {
      dispatch(updateCardUserCategoryInCurrentDeck({ cardId, userCategory }));
    },
    [dispatch]
  );

  // Replace the full category list (add / rename / delete / reorder)
  const handleCategoriesChange = useCallback(
    (categories: DeckCategory[]) => {
      dispatch(setDeckCategories(categories));
    },
    [dispatch]
  );

  // Initialize default categories from game cardTypes (called when entering edit mode on an existing deck with no categories)
  const handleInitDefaultCategories = useCallback(() => {
    const rawCategories = (currentDeck as unknown as Record<string, unknown>)
      ?.categories;
    const existing = parseDeckCategories(rawCategories);
    if (existing.length === 0) {
      const cardTypes = game?.config?.cardTypes ?? [];
      dispatch(setDeckCategories(defaultCategoriesFromCardTypes(cardTypes)));
    }
  }, [currentDeck, game, dispatch]);

  return {
    handleCardSelect,
    handleQuantityChange,
    handleSearchResults,
    handleCardDrop,
    handleDeckNameChange,
    handleNewDeck,
    handleSaveDeck,
    handleExport,
    handleUserCategoryChange,
    handleCategoriesChange,
    handleInitDefaultCategories,
    searchResults,
  };
}
