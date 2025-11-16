/**
 * AnonymousDeckBuilder - Main component orchestrator
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setIsEditing } from '@/store/slices/deckSlice';
import { AnonymousDeckHeader } from '../AnonymousDeckHeader';
import { OfflineStatusBadge } from '../OfflineStatusBadge';
import { DeckStats } from '../DeckStats';
import { DeckValidator } from '../DeckValidator';
import { ShareDeckModal } from '../ShareDeckModal';
import {
  DeckNameEditor,
  CardSearchPanel,
  DeckContentsPanel,
  DeckActionsBar,
  AnonymousFeaturesNotice,
} from './';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useAnonymousDeckStorage } from '@/hooks/useAnonymousDeckStorage';
import { useDeckSharing } from '@/hooks/useDeckSharing';
import { useDeckExport } from '@/hooks/useDeckExport';
import { useDeckHandlers } from './hooks/useDeckHandlers';
import { useDeckCalculations } from './hooks/useDeckCalculations';
import type { AnonymousDeckBuilderProps } from './types';
import type { CardWithRelations } from '@/lib/types/card';

export function AnonymousDeckBuilderComponent({
  className,
}: AnonymousDeckBuilderProps) {
  const dispatch = useDispatch();
  const { currentDeck, isEditing } = useSelector(
    (state: RootState) => state.decks
  );

  const [deckName, setDeckName] = useState('');
  const [searchResults, setSearchResults] = useState<CardWithRelations[]>([]);

  // Custom hooks for state and logic management
  const {
    isOnline,
    pendingSyncCount,
    saveStatus,
    setSaveStatus,
    loadPendingSyncCount,
  } = useOfflineSync();

  const { lastSaved, saveToLocalStorage, initializeNewDeck } =
    useAnonymousDeckStorage(isOnline, setSaveStatus, loadPendingSyncCount);

  const {
    shareURL,
    showShareModal,
    shareError,
    copySuccess,
    handleShareDeck,
    handleCopyShareURL,
    handleCloseShareModal,
  } = useDeckSharing();

  const { handleExport: exportDeck } = useDeckExport();

  // Deck calculations
  const { stats, cardsByType } = useDeckCalculations();

  // Event handlers
  const {
    handleCardSelect,
    handleQuantityChange,
    handleCardDrop,
    handleDeckNameChange: updateDeckName,
    handleNewDeck,
    handleShare,
    handleExportClick,
  } = useDeckHandlers({
    searchResults,
    initializeNewDeck,
    handleShareDeck,
    exportDeck,
    deckName,
  });

  // Auto-save deck changes to localStorage
  useEffect(() => {
    if (currentDeck && currentDeck.id.startsWith('anonymous-')) {
      saveToLocalStorage(currentDeck);
    }
  }, [currentDeck, saveToLocalStorage]);

  // Sync deck name with Redux state
  useEffect(() => {
    if (currentDeck) {
      setDeckName(currentDeck.name);
    }
  }, [currentDeck]);

  // Handle search results for drag-and-drop
  const handleSearchResults = useCallback((cards: CardWithRelations[]) => {
    setSearchResults(cards);
  }, []);

  // Handle deck name change with local state sync
  const handleLocalDeckNameChange = useCallback(
    (name: string) => {
      setDeckName(name);
      updateDeckName(name);
    },
    [updateDeckName]
  );

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Anonymous Deck Header */}
      <div className="mb-6">
        <AnonymousDeckHeader />

        <div className="space-y-4">
          <DeckNameEditor
            deckName={deckName}
            isEditing={isEditing}
            onDeckNameChange={handleLocalDeckNameChange}
            onEditToggle={() => dispatch(setIsEditing(!isEditing))}
          />

          {/* Save Status with Offline Support */}
          <OfflineStatusBadge
            saveStatus={saveStatus}
            lastSaved={lastSaved}
            isOnline={isOnline}
            pendingSyncCount={pendingSyncCount}
          />
        </div>

        {/* Deck Statistics */}
        <DeckStats
          totalCards={stats.totalCards}
          uniqueCards={stats.uniqueCards}
          totalCost={stats.totalCost}
        />
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Card Search Panel */}
        <div className="space-y-6 xl:col-span-1">
          <CardSearchPanel
            onCardSelect={handleCardSelect}
            onSearchResults={handleSearchResults}
          />

          {/* Deck Validation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <DeckValidator
              cards={
                currentDeck?.cards.map((deckCard) => ({
                  card: deckCard.card,
                  quantity: deckCard.quantity,
                  category: deckCard.category || 'main',
                })) || []
              }
              showDetails={false}
              onlyErrors={true}
            />
          </motion.div>
        </div>

        {/* Deck Contents Panel */}
        <div className="xl:col-span-2">
          <DeckContentsPanel
            totalCards={stats.totalCards}
            uniqueCards={stats.uniqueCards}
            cardsByType={cardsByType}
            isEditing={isEditing}
            onCardDrop={handleCardDrop}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </motion.div>

      {/* Detailed Validation Panel */}
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
      <div className="mt-6">
        <DeckActionsBar
          uniqueCards={stats.uniqueCards}
          onNewDeck={handleNewDeck}
          onExport={handleExportClick}
          onShare={handleShare}
        />
      </div>

      {/* Share Modal */}
      <ShareDeckModal
        show={showShareModal}
        shareURL={shareURL}
        shareError={shareError}
        copySuccess={copySuccess}
        onClose={handleCloseShareModal}
        onCopyURL={handleCopyShareURL}
      />

      {/* Anonymous Features Notice */}
      <div className="mt-8">
        <AnonymousFeaturesNotice />
      </div>
    </motion.div>
  );
}
