'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  addCardToCurrentDeck,
  removeCardFromCurrentDeck,
  updateCardQuantityInCurrentDeck,
  setIsEditing,
  setCurrentDeck,
} from '@/store/slices/deckSlice';
import { AnonymousDeckHeader } from './AnonymousDeckHeader';
import { OfflineStatusBadge } from './OfflineStatusBadge';
import { DeckStats } from './DeckStats';
import { DeckValidator } from './DeckValidator';
import { ShareDeckModal } from './ShareDeckModal';
import {
  DeckNameEditor,
  CardSearchPanel,
  DeckContentsPanel,
  DeckActionsBar,
  AnonymousFeaturesNotice,
} from './AnonymousDeckBuilder/';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useAnonymousDeckStorage } from '@/hooks/useAnonymousDeckStorage';
import { useDeckSharing } from '@/hooks/useDeckSharing';
import { useDeckExport } from '@/hooks/useDeckExport';
import { calculateDeckStats, groupCardsByType } from '@/lib/utils/deckCalculations';
import type { CardWithRelations } from '@/lib/types/card';
import type { DeckCard } from '@prisma/client';

interface AnonymousDeckBuilderProps {
  className?: string;
}

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

export const AnonymousDeckBuilder: React.FC<AnonymousDeckBuilderProps> = ({
  className,
}) => {
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

  // Handle search results for drag-and-drop
  const handleSearchResults = useCallback((cards: CardWithRelations[]) => {
    setSearchResults(cards);
  }, []);

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
      setDeckName(name);
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
    (format: 'json' | 'text' | 'csv' | 'mtga') => {
      exportDeck(currentDeck, deckName, format);
    },
    [currentDeck, deckName, exportDeck]
  );

  // Calculate deck statistics
  const { totalCards, uniqueCards, totalCost } = currentDeck
    ? calculateDeckStats(currentDeck.cards)
    : { totalCards: 0, uniqueCards: 0, totalCost: 0 };

  // Group cards by type for better organization
  const cardsByType = currentDeck
    ? (groupCardsByType(currentDeck.cards) as Record<
        string,
        DeckCardWithCard[]
      >)
    : {};

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
            onDeckNameChange={handleDeckNameChange}
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
          totalCards={totalCards}
          uniqueCards={uniqueCards}
          totalCost={totalCost}
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
            totalCards={totalCards}
            uniqueCards={uniqueCards}
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
          uniqueCards={uniqueCards}
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
};
