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
  Button,
  Input,
  Badge,
  Select,
} from '@/components/ui';
import { useAuth, useDecks, useCollection } from '@/hooks';
import { DeckCardSearch } from './DeckCardSearch';
import { DraggableCard } from './DraggableCard';
import { DeckDropZone } from './DeckDropZone';
import { DeckValidator } from './DeckValidator';
import { DeckVersionHistory } from './DeckVersionHistory';
import { DeckTemplateCreator } from './DeckTemplateCreator';
import { FavoriteButton } from './FavoriteButton';
import { DeckAnalyticsDisplay } from '@/components/analytics';
import { deckExporter } from '@/lib/services/deckExportService';
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

// Type for deck cards
type DeckCard = {
  cardId: string;
  card: CardWithRelations;
  quantity: number;
  category: string | null;
};

// Helper: Calculate deck statistics
const calculateDeckStats = (cards: DeckCard[] | undefined) => {
  const totalCards = cards?.reduce((sum: number, deckCard: DeckCard) => sum + deckCard.quantity, 0) || 0;
  const uniqueCards = cards?.length || 0;
  const totalCost = cards?.reduce(
    (sum: number, deckCard: DeckCard) => sum + (deckCard.card.cost || 0) * deckCard.quantity,
    0
  ) || 0;

  return { totalCards, uniqueCards, totalCost };
};

// Helper: Group cards by type
const groupCardsByType = (cards: DeckCard[] | undefined) => {
  return cards?.reduce(
    (acc: Record<string, DeckCard[]>, deckCard: DeckCard) => {
      const type = deckCard.card.type?.name || 'Unknown';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(deckCard);
      return acc;
    },
    {} as Record<string, DeckCard[]>
  ) || {};
};

// Deck Statistics Component
interface DeckStatsProps {
  totalCards: number;
  uniqueCards: number;
  totalCost: number;
}

const DeckStats: React.FC<DeckStatsProps> = ({ totalCards, uniqueCards, totalCost }) => (
  <div className="grid grid-cols-3 gap-4">
    <div className="rounded-lg bg-gray-50 p-3 text-center">
      <div className="text-2xl font-bold text-gray-900">{totalCards}</div>
      <div className="text-sm text-gray-600">Total Cards</div>
    </div>
    <div className="rounded-lg bg-gray-50 p-3 text-center">
      <div className="text-2xl font-bold text-gray-900">{uniqueCards}</div>
      <div className="text-sm text-gray-600">Unique Cards</div>
    </div>
    <div className="rounded-lg bg-gray-50 p-3 text-center">
      <div className="text-2xl font-bold text-gray-900">{totalCost}</div>
      <div className="text-sm text-gray-600">Total Cost</div>
    </div>
  </div>
);

// Deck Settings Component
interface DeckSettingsProps {
  deckDescription: string;
  setDeckDescription: (value: string) => void;
  deckFormat: string;
  setDeckFormat: (value: string) => void;
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
}

const DeckSettings: React.FC<DeckSettingsProps> = ({
  deckDescription,
  setDeckDescription,
  deckFormat,
  setDeckFormat,
  isPublic,
  setIsPublic,
}) => (
  <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-3">
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Description
      </label>
      <Input
        value={deckDescription}
        onChange={(e) => setDeckDescription(e.target.value)}
        placeholder="Deck description (optional)"
        className="text-sm"
      />
    </div>
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Format
      </label>
      <Select
        value={deckFormat}
        onChange={setDeckFormat}
        options={[
          { value: 'Standard', label: 'Standard' },
          { value: 'Advanced', label: 'Advanced' },
          { value: 'Casual', label: 'Casual' },
          { value: 'Custom', label: 'Custom' },
        ]}
      />
    </div>
    <div className="flex items-center space-x-2 pt-6">
      <input
        type="checkbox"
        id="isPublic"
        checked={isPublic}
        onChange={(e) => setIsPublic(e.target.checked)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor="isPublic" className="text-sm text-gray-700">
        Make deck public
      </label>
    </div>
  </div>
);

// Deck Header Component
interface DeckHeaderProps {
  deckName: string;
  onDeckNameChange: (name: string) => void;
  isEditing: boolean;
  onToggleEditing: () => void;
  isAuthenticated: boolean;
  savedDeckId: string | null;
  showVersionHistory: boolean;
  onToggleVersionHistory: () => void;
  deckDescription: string;
  setDeckDescription: (value: string) => void;
  deckFormat: string;
  setDeckFormat: (value: string) => void;
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
  deckError: string | null;
}

const DeckHeader: React.FC<DeckHeaderProps> = ({
  deckName,
  onDeckNameChange,
  isEditing,
  onToggleEditing,
  isAuthenticated,
  savedDeckId,
  showVersionHistory,
  onToggleVersionHistory,
  deckDescription,
  setDeckDescription,
  deckFormat,
  setDeckFormat,
  isPublic,
  setIsPublic,
  deckError,
}) => (
  <div className="mb-4 space-y-4">
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          value={deckName}
          onChange={(e) => onDeckNameChange(e.target.value)}
          placeholder="Enter deck name..."
          className="text-lg font-semibold"
        />
      </div>
      <Button
        onClick={onToggleEditing}
        variant={isEditing ? 'default' : 'outline'}
      >
        {isEditing ? 'Done Editing' : 'Edit Deck'}
      </Button>

      {isAuthenticated && savedDeckId && (
        <>
          <Button
            onClick={onToggleVersionHistory}
            variant={showVersionHistory ? 'default' : 'outline'}
          >
            {showVersionHistory ? 'Hide History' : 'Version History'}
          </Button>
          <FavoriteButton
            deckId={savedDeckId}
            deckName={deckName}
            size="md"
            variant="button"
          />
        </>
      )}
    </div>

    {isAuthenticated && (
      <DeckSettings
        deckDescription={deckDescription}
        setDeckDescription={setDeckDescription}
        deckFormat={deckFormat}
        setDeckFormat={setDeckFormat}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
      />
    )}

    {deckError && (
      <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {deckError}
      </div>
    )}
  </div>
);

// Deck Actions Component
interface DeckActionsProps {
  onNewDeck: () => void;
  isAuthenticated: boolean;
  uniqueCards: number;
  deckLoading: boolean;
  savedDeckId: string | null;
  onSaveDeck: () => void;
  showTemplateCreator: boolean;
  onToggleTemplateCreator: () => void;
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
  onExport: (format: 'json' | 'text' | 'csv' | 'mtga') => void;
}

const DeckActions: React.FC<DeckActionsProps> = ({
  onNewDeck,
  isAuthenticated,
  uniqueCards,
  deckLoading,
  savedDeckId,
  onSaveDeck,
  showTemplateCreator,
  onToggleTemplateCreator,
  showAnalytics,
  onToggleAnalytics,
  onExport,
}) => (
  <div className="mt-6 flex flex-wrap gap-4">
    <Button variant="outline" onClick={onNewDeck}>
      New Deck
    </Button>

    {isAuthenticated && (
      <Button
        variant="default"
        disabled={uniqueCards === 0 || deckLoading}
        onClick={onSaveDeck}
      >
        {deckLoading
          ? 'Saving...'
          : savedDeckId
            ? 'Update Deck'
            : 'Save Deck'}
      </Button>
    )}

    {isAuthenticated && savedDeckId && uniqueCards > 0 && (
      <Button
        variant="outline"
        onClick={onToggleTemplateCreator}
      >
        {showTemplateCreator ? 'Hide Template Creator' : 'Create Template'}
      </Button>
    )}

    {uniqueCards > 0 && (
      <Button
        variant="outline"
        onClick={onToggleAnalytics}
      >
        {showAnalytics ? 'Hide Analytics' : '📊 Deck Analytics'}
      </Button>
    )}

    <ExportDropdown onExport={onExport} disabled={uniqueCards === 0} />

    {!isAuthenticated && (
      <Button
        variant="outline"
        onClick={() => {
          console.warn('Sign in to save and share your decks!');
        }}
      >
        💾 Sign in to Save
      </Button>
    )}
  </div>
);

// Export Dropdown Component
interface ExportDropdownProps {
  onExport: (format: 'json' | 'text' | 'csv' | 'mtga') => void;
  disabled: boolean;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExport, disabled }) => (
  <div className="group relative">
    <Button
      variant="outline"
      disabled={disabled}
      onClick={() => onExport('json')}
    >
      Export Deck
      <span className="ml-1 text-xs">▼</span>
    </Button>

    <div className="absolute bottom-full left-0 z-10 mb-1 hidden min-w-48 rounded-lg border bg-white shadow-lg group-hover:block">
      <div className="py-1">
        <button
          onClick={() => onExport('json')}
          disabled={disabled}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          📄 JSON Format
          <div className="text-xs text-gray-500">Complete deck data</div>
        </button>
        <button
          onClick={() => onExport('text')}
          disabled={disabled}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          📝 Text Format
          <div className="text-xs text-gray-500">Human readable</div>
        </button>
        <button
          onClick={() => onExport('csv')}
          disabled={disabled}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          📊 CSV Format
          <div className="text-xs text-gray-500">
            Spreadsheet compatible
          </div>
        </button>
        <button
          onClick={() => onExport('mtga')}
          disabled={disabled}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          🎮 MTG Arena Format
          <div className="text-xs text-gray-500">Other deck builders</div>
        </button>
      </div>
    </div>
  </div>
);

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

  // Calculate deck statistics using helper
  const { totalCards, uniqueCards, totalCost } = calculateDeckStats(currentDeck?.cards);

  // Group cards by type using helper
  const cardsByType = groupCardsByType(currentDeck?.cards);

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
          onToggleVersionHistory={() => setShowVersionHistory(!showVersionHistory)}
          deckDescription={deckDescription}
          setDeckDescription={setDeckDescription}
          deckFormat={deckFormat}
          setDeckFormat={setDeckFormat}
          isPublic={isPublic}
          setIsPublic={setIsPublic}
          deckError={deckError}
        />

        {/* Deck Statistics */}
        <DeckStats totalCards={totalCards} uniqueCards={uniqueCards} totalCost={totalCost} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Card Search Panel */}
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add Cards</CardTitle>
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
                <div className="text-sm text-gray-600">
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
          <Card>
            <CardHeader>
              <CardTitle>Deck Contents ({totalCards} cards)</CardTitle>
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
                          <div className="sticky top-0 flex items-center gap-2 bg-white py-1">
                            <Badge variant="secondary" className="text-xs">
                              {typeName}
                            </Badge>
                            <span className="text-sm text-gray-600">
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
        onToggleTemplateCreator={() => setShowTemplateCreator(!showTemplateCreator)}
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
