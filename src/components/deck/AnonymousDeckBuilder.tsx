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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
} from '@/components/ui';
import { DeckCardSearch } from './DeckCardSearch';
import { DraggableCard } from './DraggableCard';
import { DeckDropZone } from './DeckDropZone';
import { DeckValidator } from './DeckValidator';
import { AnonymousDeckHeader } from './AnonymousDeckHeader';
import { OfflineStatusBadge } from './OfflineStatusBadge';
import { DeckStats } from './DeckStats';
import { ShareDeckModal } from './ShareDeckModal';
import { ExportDropdown } from './ExportDropdown';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useAnonymousDeckStorage } from '@/hooks/useAnonymousDeckStorage';
import { useDeckSharing } from '@/hooks/useDeckSharing';
import { useDeckExport } from '@/hooks/useDeckExport';
import { calculateDeckStats, groupCardsByType } from '@/lib/utils/deckCalculations';
import type { CardWithRelations } from '@/lib/types/card';

interface AnonymousDeckBuilderProps {
  className?: string;
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
  const cardsByType = currentDeck ? groupCardsByType(currentDeck.cards) : {};

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
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                value={deckName}
                onChange={(e) => handleDeckNameChange(e.target.value)}
                placeholder="Enter deck name..."
                className="text-lg font-semibold"
              />
            </div>
            <Button
              onClick={() => dispatch(setIsEditing(!isEditing))}
              variant={isEditing ? 'default' : 'outline'}
            >
              {isEditing ? 'Done Editing' : 'Edit Deck'}
            </Button>
          </div>

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
          <Card className="border-[#443a5c] bg-[#2d2640]">
            <CardHeader>
              <CardTitle className="text-lg text-[#a89ec7]">
                ADD CARDS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <DeckCardSearch
                  onCardSelect={handleCardSelect}
                  onSearchResults={handleSearchResults}
                  placeholder="Search cards to add to deck..."
                  showFilters={false}
                  limit={10}
                />
                <div className="rounded-lg border border-[#443a5c]/30 bg-[#1a1625]/50 p-3 text-sm text-gray-400">
                  Click or drag cards to add them to your deck. All changes are
                  saved automatically to your browser.
                </div>
              </div>
            </CardContent>
          </Card>

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
          <Card className="border-[#443a5c] bg-[#2d2640]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-[#a89ec7]">
                DECK CONTENTS
                <Badge className="border-[#8b7aaa]/30 bg-[#8b7aaa]/20 text-[#a89ec7]">
                  {totalCards} cards
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DeckDropZone
                onCardDrop={handleCardDrop}
                title="Main Deck"
                description="Drag cards here or use search to add them"
                minHeight={400}
                className="max-h-96 overflow-y-auto"
              >
                <div className="space-y-4">
                  {uniqueCards === 0 ? (
                    <motion.div
                      className="py-12 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.svg
                        className="mx-auto mb-4 h-20 w-20 text-[#8b7aaa]/30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </motion.svg>
                      <p className="mb-2 text-xl font-semibold text-[#a89ec7]">
                        Your deck is empty
                      </p>
                      <p className="text-gray-400">
                        Start by searching for cards to add
                      </p>
                    </motion.div>
                  ) : (
                    Object.entries(cardsByType).map(([typeName, cards]) => (
                      <div key={typeName} className="space-y-2">
                        <div className="sticky top-0 z-10 flex items-center gap-2 bg-[#2d2640] py-2">
                          <Badge
                            variant="secondary"
                            className="border-[#8b7aaa]/30 bg-[#8b7aaa]/20 text-xs text-[#a89ec7]"
                          >
                            {typeName}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            (
                            {cards.reduce((sum, card) => sum + card.quantity, 0)}{' '}
                            cards)
                          </span>
                        </div>

                        {cards.map((deckCard) => (
                          <DraggableCard
                            key={deckCard.cardId}
                            card={deckCard.card}
                            quantity={deckCard.quantity}
                            onQuantityChange={(newQuantity) =>
                              handleQuantityChange(deckCard.cardId, newQuantity)
                            }
                            onRemove={() =>
                              handleQuantityChange(deckCard.cardId, 0)
                            }
                            isEditing={isEditing}
                          />
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </DeckDropZone>
            </CardContent>
          </Card>
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
      <div className="mt-6 flex flex-wrap gap-4">
        <Button variant="outline" onClick={handleNewDeck}>
          New Deck
        </Button>

        <ExportDropdown
          uniqueCards={uniqueCards}
          onExport={handleExportClick}
        />

        {/* Share Deck Button */}
        <Button
          variant="outline"
          disabled={uniqueCards === 0}
          onClick={handleShare}
        >
          🔗 Share via URL
        </Button>

        {/* Sign In Prompt */}
        <Button
          variant="default"
          onClick={() => {
            window.location.href = '/auth/signin?callbackUrl=/decks';
          }}
        >
          🔐 Sign In to Save Permanently
        </Button>
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
      <motion.div
        className="mt-8 rounded-xl border border-[#443a5c] bg-gradient-to-br from-[#2d2640] to-[#3a3050] p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h4 className="mb-4 text-lg font-semibold text-[#a89ec7]">
          Anonymous Deck Building Features:
        </h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center gap-2">
            <span className="text-green-400">✅</span>
            Build decks with full card search and filtering
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✅</span>
            Automatic local saving (persists until you clear browser data)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✅</span>
            Export decks in multiple formats (JSON, Text, CSV)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✅</span>
            Real-time deck validation and statistics
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✅</span>
            Drag and drop card management
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✅</span>
            Share decks via temporary URLs
          </li>
        </ul>
        <div className="mt-4 border-t border-[#443a5c] pt-4">
          <p className="text-sm text-gray-300">
            <strong className="text-[#a89ec7]">Want more?</strong> Sign in to
            save decks permanently, share them with others, and access your deck
            collection from any device!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
