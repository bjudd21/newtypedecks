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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@/components/ui';
import { useAuth, useDecks, useCollection } from '@/hooks';
import { DeckCardSearch } from './DeckCardSearch';
import { DraggableCard } from './DraggableCard';
import { DeckDropZone } from './DeckDropZone';
import { DeckValidator } from './DeckValidator';
import { DeckVersionHistory } from './DeckVersionHistory';
import { DeckTemplateCreator } from './DeckTemplateCreator';
import { DeckHeader } from './DeckHeader';
import { DeckActions } from './DeckActions';
import { DeckStats } from './DeckStats';
import { DeckAnalyticsDisplay } from '@/components/analytics';
import { deckExporter } from '@/lib/services/deckExportService';
import { calculateDeckStats, groupCardsByType } from '@/lib/utils/deckCalculations';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckBuilderProps {
  className?: string;
}

// Helper: Create a new empty deck
const createNewDeck = (isAuthenticated: boolean, userId?: string) => ({
  id: `temp-${Date.now()}`,
  name: 'New Deck',
  description: '',
  isPublic: false,
  userId: isAuthenticated ? userId || 'authenticated' : 'anonymous',
  currentVersion: 1,
  versionName: null,
  isTemplate: false,
  templateSource: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  cards: [],
});

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
  const { getCardQuantities } = useCollection();

  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [deckFormat, setDeckFormat] = useState('Standard');
  const [isPublic, setIsPublic] = useState(false);
  const [savedDeckId, setSavedDeckId] = useState<string | null>(null);
  const [_searchQuery, _setSearchQuery] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showTemplateCreator, setShowTemplateCreator] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [collectionQuantities, setCollectionQuantities] = useState<
    Record<string, number>
  >({});

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

  // Fetch collection quantities when deck changes (for authenticated users only)
  useEffect(() => {
    if (isAuthenticated && currentDeck && currentDeck.cards.length > 0) {
      const cardIds = currentDeck.cards.map((deckCard) => deckCard.card.id);
      getCardQuantities(cardIds).then((quantities) => {
        setCollectionQuantities(quantities);
      });
    } else {
      setCollectionQuantities({});
    }
  }, [currentDeck, isAuthenticated, getCardQuantities]);

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
  const cardsByType = currentDeck ? groupCardsByType(currentDeck.cards) : {};

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
          <Card className="border-[#443a5c] bg-[#2d2640]">
            <CardHeader>
              <CardTitle className="text-[#a89ec7]">ADD CARDS</CardTitle>
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
                <div className="text-sm text-gray-400">
                  Click or drag cards to add them to your deck. Cards will be
                  added to the main deck by default.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deck Validation */}
          <div className="mt-6">
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
          </div>
        </div>

        {/* Deck Contents Panel */}
        <div className="xl:col-span-2">
          <Card className="border-[#443a5c] bg-[#2d2640]">
            <CardHeader>
              <CardTitle className="text-[#a89ec7]">
                DECK CONTENTS ({totalCards} CARDS)
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
                  {uniqueCards === 0
                    ? null
                    : Object.entries(cardsByType).map(([typeName, cards]) => (
                        <div key={typeName} className="space-y-2">
                          <div className="sticky top-0 flex items-center gap-2 bg-[#2d2640] py-1">
                            <Badge variant="secondary" className="text-xs">
                              {typeName}
                            </Badge>
                            <span className="text-sm text-gray-400">
                              (
                              {cards.reduce(
                                (sum, card) => sum + card.quantity,
                                0
                              )}{' '}
                              cards)
                            </span>
                          </div>

                          {cards.map((deckCard) => (
                            <DraggableCard
                              key={deckCard.cardId}
                              card={deckCard.card}
                              quantity={deckCard.quantity}
                              onQuantityChange={(newQuantity) =>
                                handleQuantityChange(
                                  deckCard.cardId,
                                  newQuantity
                                )
                              }
                              onRemove={() =>
                                handleQuantityChange(deckCard.cardId, 0)
                              }
                              isEditing={isEditing}
                              ownedQuantity={
                                collectionQuantities[deckCard.card.id] || 0
                              }
                            />
                          ))}
                        </div>
                      ))}
                </div>
              </DeckDropZone>
            </CardContent>
          </Card>
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

      {/* Version History Section */}
      {showVersionHistory && isAuthenticated && savedDeckId && (
        <div className="mt-6">
          <DeckVersionHistory
            deckId={savedDeckId}
            currentVersion={currentDeck?.currentVersion}
            onVersionRestore={() => {
              // Refresh the page to show restored deck
              window.location.reload();
            }}
            onVersionDelete={() => {
              // Version deleted, refresh might be needed
              console.warn('Version deleted');
            }}
          />
        </div>
      )}

      {/* Template Creator Section */}
      {showTemplateCreator && isAuthenticated && savedDeckId && (
        <div className="mt-6">
          <DeckTemplateCreator
            deckId={savedDeckId}
            deckName={deckName}
            deckDescription={deckDescription}
            cardCount={totalCards}
            onTemplateCreated={(templateId) => {
              console.warn('Template created:', templateId);
              setShowTemplateCreator(false);
            }}
          />
        </div>
      )}

      {/* Deck Analytics Section */}
      {showAnalytics && currentDeck && currentDeck.cards.length > 0 && (
        <div className="mt-6">
          <DeckAnalyticsDisplay
            deckCards={currentDeck.cards.map((deckCard) => ({
              card: deckCard.card,
              quantity: deckCard.quantity,
              category:
                (deckCard.category as 'main' | 'side' | 'extra' | undefined) ||
                'main',
            }))}
            deckName={deckName}
            onAnalysisUpdate={(analytics) => {
              // Could store analytics in state for other uses
              console.warn('Deck analytics updated:', analytics);
            }}
          />
        </div>
      )}

      {/* Deck Status Indicator */}
      {isAuthenticated && (
        <div className="mt-4 text-sm text-gray-600">
          {savedDeckId ? (
            <span className="flex items-center gap-1">
              ✅ <strong>{deckName}</strong> is saved to your collection
              {currentDeck?.currentVersion && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  v{currentDeck.currentVersion}
                </Badge>
              )}
            </span>
          ) : uniqueCards > 0 ? (
            <span className="flex items-center gap-1">
              ⚠️ <strong>{deckName}</strong> has unsaved changes
            </span>
          ) : (
            <span>Start adding cards to build your deck</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DeckBuilder;
