/**
 * DeckBuilder - Simplified main component using custom hooks
 */

'use client';

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setIsEditing, setCurrentDeck } from '@/store/slices/deckSlice';
import { parseDeckCategories } from '@/lib/types/deck';
import { useAuth, useDecks } from '@/hooks';
import { useGame } from '@/contexts/GameContext';
import { DeckHeader } from '../DeckHeader';
import { DeckActions } from '../DeckActions';
import { DeckStats } from '../DeckStats';
import { DeckValidator } from '../DeckValidator';
import {
  useCollectionQuantities,
  SearchPanel,
  DeckContentPanel,
  DeckStatusIndicator,
  ConditionalSections,
} from './';
import { useDeckState } from './hooks/useDeckState';
import { useDeckHandlers } from './hooks/useDeckHandlers';
import { useDeckCalculations } from './hooks/useDeckCalculations';
import { useViewMode } from './hooks/useViewMode';

interface DeckBuilderProps {
  className?: string;
}

export const DeckBuilderComponent: React.FC<DeckBuilderProps> = ({
  className,
}) => {
  const dispatch = useDispatch();
  const { currentDeck, isEditing } = useSelector(
    (state: RootState) => state.decks
  );
  const { isAuthenticated, user } = useAuth();
  const game = useGame();
  const {
    createDeck,
    updateDeck,
    error: deckError,
    isLoading: deckLoading,
    clearError,
  } = useDecks();

  // Custom hooks for state, handlers, and calculations
  const {
    deckName,
    setDeckName,
    deckDescription,
    setDeckDescription,
    deckFormat,
    setDeckFormat,
    visibility,
    setVisibility,
    ruleset,
    setRuleset,
    savedDeckId,
    setSavedDeckId,
    showVersionHistory,
    setShowVersionHistory,
    showTemplateCreator,
    setShowTemplateCreator,
    showAnalytics,
    setShowAnalytics,
    showHandSimulator,
    setShowHandSimulator,
    deckCode,
    setDeckCode,
  } = useDeckState({
    currentDeck,
    isAuthenticated,
    userId: user?.id,
  });

  const {
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
    searchResults: _searchResults,
  } = useDeckHandlers({
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
    userId: user?.id,
    createDeck,
    updateDeck,
    clearError,
  });

  const { totalCards, uniqueCards, totalCost, cardsByType } =
    useDeckCalculations({ currentDeck });

  const { viewMode, setViewMode } = useViewMode();

  // Parse deck-level categories from the current deck (Prisma Json? field)
  const deckCategories = parseDeckCategories(
    (currentDeck as unknown as Record<string, unknown>)?.categories
  );

  const handleImportByCode = useCallback(
    (
      cards: {
        cardId: string;
        card: unknown;
        quantity: number;
        category: string;
      }[],
      deckName: string
    ) => {
      if (currentDeck) {
        dispatch(
          setCurrentDeck({
            ...currentDeck,
            id: `temp-${Date.now()}`,
            name: deckName,
            cards: cards as typeof currentDeck.cards,
          })
        );
        setDeckName(deckName);
        setSavedDeckId(null);
        setDeckCode(null);
      }
    },
    [currentDeck, dispatch, setDeckName, setSavedDeckId, setDeckCode]
  );

  const collectionQuantities = useCollectionQuantities(
    isAuthenticated,
    currentDeck
  );

  return (
    <div className={className}>
      {/* Deck Header */}
      <div className="mb-6">
        <DeckHeader
          deckName={deckName}
          onDeckNameChange={(name) => {
            setDeckName(name);
            handleDeckNameChange(name);
          }}
          isEditing={isEditing}
          onToggleEditing={() => {
            // When entering edit mode, initialize default categories if none exist
            if (!isEditing) handleInitDefaultCategories();
            dispatch(setIsEditing(!isEditing));
          }}
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
          visibility={visibility}
          setVisibility={setVisibility}
          ruleset={ruleset}
          setRuleset={setRuleset}
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
            isAuthenticated={isAuthenticated}
            collectionQuantities={collectionQuantities}
            onCardDrop={handleCardDrop}
            onQuantityChange={handleQuantityChange}
            deckCards={currentDeck?.cards || []}
            deckRules={game?.config?.deckRules}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            categories={deckCategories}
            onCategoriesChange={handleCategoriesChange}
            onUserCategoryChange={handleUserCategoryChange}
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
          ruleset={ruleset}
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
        showHandSimulator={showHandSimulator}
        onToggleHandSimulator={() => setShowHandSimulator(!showHandSimulator)}
        onExport={handleExport}
        onImportByCode={handleImportByCode}
      />

      {/* Conditional Sections: Version History, Template Creator, Analytics */}
      <ConditionalSections
        showVersionHistory={showVersionHistory}
        showTemplateCreator={showTemplateCreator}
        showAnalytics={showAnalytics}
        showHandSimulator={showHandSimulator}
        handSize={game?.config?.deckRules?.startingHandSize ?? 5}
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
        deckCode={deckCode}
      />
    </div>
  );
};

export default DeckBuilderComponent;
