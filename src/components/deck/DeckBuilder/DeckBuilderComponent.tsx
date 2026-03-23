/**
 * DeckBuilder - Simplified main component using custom hooks
 */

'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setIsEditing } from '@/store/slices/deckSlice';
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
    savedDeckId,
    setSavedDeckId,
    showVersionHistory,
    setShowVersionHistory,
    showTemplateCreator,
    setShowTemplateCreator,
    showAnalytics,
    setShowAnalytics,
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
    searchResults: _searchResults,
  } = useDeckHandlers({
    currentDeck,
    deckName,
    deckDescription,
    deckFormat,
    visibility,
    savedDeckId,
    setSavedDeckId,
    isAuthenticated,
    userId: user?.id,
    createDeck,
    updateDeck,
    clearError,
  });

  const { totalCards, uniqueCards, totalCost, cardsByType } =
    useDeckCalculations({ currentDeck });

  const { viewMode, setViewMode } = useViewMode();

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
          visibility={visibility}
          setVisibility={setVisibility}
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

export default DeckBuilderComponent;
