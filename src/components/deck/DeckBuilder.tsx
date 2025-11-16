'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  setCurrentDeck,
  addCardToCurrentDeck,
  removeCardFromCurrentDeck,
  updateCardQuantityInCurrentDeck,
  setIsEditing,
} from '@/store/slices/deckSlice';
import { useAuth, useDecks } from '@/hooks';
import { DeckHeader } from './DeckHeader';
import { DeckActions } from './DeckActions';
import { DeckStats } from './DeckStats';
import { DeckValidator } from './DeckValidator';
import { deckExporter } from '@/lib/services/deckExportService';
import { calculateDeckStats, groupCardsByType } from '@/lib/utils/deckCalculations';
import type { CardWithRelations } from '@/lib/types/card';
import {
  createNewDeck,
  useCollectionQuantities,
  SearchPanel,
  DeckContentPanel,
  DeckStatusIndicator,
  ConditionalSections,
} from './DeckBuilder/';

interface DeckBuilderProps {
  className?: string;
}

export const DeckBuilder: React.FC<DeckBuilderProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { currentDeck, isEditing } = useSelector(
    (state: RootState) => state.decks
  );
  const { isAuthenticated, user } = useAuth();
  const {
    createDeck,
    updateDeck,
    error: deckError,
    isLoading: deckLoading,
    clearError,
  } = useDecks();

  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [deckFormat, setDeckFormat] = useState('Standard');
  const [isPublic, setIsPublic] = useState(false);
  const [savedDeckId, setSavedDeckId] = useState<string | null>(null);
  const [_searchQuery, _setSearchQuery] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showTemplateCreator, setShowTemplateCreator] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Use custom hook for collection quantities
  const collectionQuantities = useCollectionQuantities(
    isAuthenticated,
    currentDeck
  );

  // Initialize a new deck
  useEffect(() => {
    if (!currentDeck) {
      const newDeck = createNewDeck(isAuthenticated, user?.id);
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
  }, [currentDeck, dispatch, isAuthenticated, user]);

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

  // Store search results for drag-and-drop
  const [searchResults, setSearchResults] = useState<CardWithRelations[]>([]);

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
      setDeckName(name);
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
    const newDeck = createNewDeck(isAuthenticated, user?.id);
    dispatch(setCurrentDeck(newDeck));
    setDeckName(newDeck.name);
    setDeckDescription('');
    setSavedDeckId(null);
    dispatch(setIsEditing(true));
  }, [isAuthenticated, user?.id, dispatch]);

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
        const newDeck = await createDeck(deckData);
        if (newDeck) {
          setSavedDeckId(newDeck.id);
          // Update current deck with saved ID
          dispatch(
            setCurrentDeck({
              ...currentDeck,
              id: newDeck.id,
              name: newDeck.name,
              description: newDeck.description || null,
              userId: user?.id || 'authenticated',
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
    user,
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

  // Calculate deck statistics using utility
  const { totalCards, uniqueCards, totalCost } = currentDeck
    ? calculateDeckStats(currentDeck.cards)
    : { totalCards: 0, uniqueCards: 0, totalCost: 0 };

  // Group cards by type using utility
  const cardsByType = currentDeck
    ? (groupCardsByType(currentDeck.cards) as Record<
        string,
        (typeof currentDeck.cards)[number][]
      >)
    : {};

  return (
    <div className={className}>
      {/* Deck Header */}
      <div className="mb-6">
        <DeckHeader
          deckName={deckName}
          onDeckNameChange={handleDeckNameChange}
          isEditing={isEditing}
          onToggleEditing={() => dispatch(setIsEditing(!isEditing))}
          isAuthenticated={isAuthenticated}
          savedDeckId={savedDeckId}
          showVersionHistory={showVersionHistory}
          onToggleVersionHistory={() =>
            setShowVersionHistory(!showVersionHistory)
          }
          deckDescription={deckDescription}
          setDeckDescription={setDeckDescription}
          deckFormat={deckFormat}
          setDeckFormat={setDeckFormat}
          isPublic={isPublic}
          setIsPublic={setIsPublic}
          deckError={deckError}
        />

        {/* Deck Statistics */}
        <DeckStats
          totalCards={totalCards}
          uniqueCards={uniqueCards}
          totalCost={totalCost}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Card Search Panel */}
        <div className="xl:col-span-1">
          <SearchPanel
            onCardSelect={handleCardSelect}
            onSearchResults={handleSearchResults}
            deckCards={currentDeck?.cards || []}
          />
        </div>

        {/* Deck Contents Panel */}
        <div className="xl:col-span-2">
          <DeckContentPanel
            totalCards={totalCards}
            uniqueCards={uniqueCards}
            cardsByType={cardsByType}
            isEditing={isEditing}
            collectionQuantities={collectionQuantities}
            onCardDrop={handleCardDrop}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </div>

      {/* Detailed Validation Panel (for larger screens) */}
      <div className="mt-6 hidden lg:block">
        <DeckValidator
          cards={
            currentDeck?.cards.map((deckCard) => ({
              card: deckCard.card,
              quantity: deckCard.quantity,
              category: deckCard.category || 'main',
            })) || []
          }
          showDetails={true}
          onlyErrors={false}
        />
      </div>

      {/* Deck Actions */}
      <DeckActions
        onNewDeck={handleNewDeck}
        isAuthenticated={isAuthenticated}
        uniqueCards={uniqueCards}
        deckLoading={deckLoading}
        savedDeckId={savedDeckId}
        onSaveDeck={handleSaveDeck}
        showTemplateCreator={showTemplateCreator}
        onToggleTemplateCreator={() =>
          setShowTemplateCreator(!showTemplateCreator)
        }
        showAnalytics={showAnalytics}
        onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
        onExport={handleExport}
      />

      {/* Conditional Sections: Version History, Template Creator, Analytics */}
      <ConditionalSections
        showVersionHistory={showVersionHistory}
        showTemplateCreator={showTemplateCreator}
        showAnalytics={showAnalytics}
        isAuthenticated={isAuthenticated}
        savedDeckId={savedDeckId}
        currentDeck={currentDeck}
        deckName={deckName}
        deckDescription={deckDescription}
        totalCards={totalCards}
        currentVersion={currentDeck?.currentVersion}
        onTemplateCreated={(templateId) => {
          console.warn('Template created:', templateId);
          setShowTemplateCreator(false);
        }}
        onAnalysisUpdate={(analytics) => {
          console.warn('Deck analytics updated:', analytics);
        }}
      />

      {/* Deck Status Indicator */}
      <DeckStatusIndicator
        isAuthenticated={isAuthenticated}
        savedDeckId={savedDeckId}
        deckName={deckName}
        uniqueCards={uniqueCards}
        currentVersion={currentDeck?.currentVersion}
      />
    </div>
  );
};

export default DeckBuilder;
