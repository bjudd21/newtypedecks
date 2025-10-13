'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  setCurrentDeck,
  addCardToCurrentDeck,
  removeCardFromCurrentDeck,
  updateCardQuantityInCurrentDeck,
  setIsEditing
} from '@/store/slices/deckSlice';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '@/components/ui';
import { DeckCardSearch } from './DeckCardSearch';
import { DraggableCard } from './DraggableCard';
import { DeckDropZone } from './DeckDropZone';
import { DeckValidator } from './DeckValidator';
import { deckExporter } from '@/lib/services/deckExportService';
import { urlDeckSharingService } from '@/lib/services/urlDeckSharingService';
import { pwaService } from '@/lib/services/pwaService';
import type { CardWithRelations } from '@/lib/types/card';

interface AnonymousDeckBuilderProps {
  className?: string;
}

export const AnonymousDeckBuilder: React.FC<AnonymousDeckBuilderProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { currentDeck, isEditing } = useSelector((state: RootState) => state.decks);

  const [deckName, setDeckName] = useState('');
  const [searchResults, setSearchResults] = useState<CardWithRelations[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [shareURL, setShareURL] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareError, setShareError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'offline' | 'error'>('saved');

  // Local storage key for anonymous decks
  const STORAGE_KEY = 'anonymous-deck';

  // Setup PWA event listeners
  useEffect(() => {
    // Initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setSaveStatus('saved');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSaveStatus('offline');
    };

    // Listen for PWA service events
    const unsubscribeOnline = pwaService.on('online', handleOnline);
    const unsubscribeOffline = pwaService.on('online', (online: boolean) => {
      if (!online) handleOffline();
    });

    const unsubscribeDeckSynced = pwaService.on('deckSynced', (deck: any) => {
      console.log('Deck synced:', deck.name);
      loadPendingSyncCount();
    });

    // Browser events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load initial pending sync count
    loadPendingSyncCount();

    return () => {
      unsubscribeOnline();
      unsubscribeOffline();
      unsubscribeDeckSynced();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load pending sync count
  const loadPendingSyncCount = async () => {
    try {
      const offlineDecks = await pwaService.getOfflineDecks();
      setPendingSyncCount(offlineDecks.length);
    } catch (error) {
      console.error('Failed to load pending sync count:', error);
    }
  };

  // Load deck from URL or localStorage on component mount
  useEffect(() => {
    const loadDeckFromSources = async () => {
      // First, check if there's a shared deck in the URL
      const urlDeckData = urlDeckSharingService.getDeckFromCurrentURL();

      if (urlDeckData) {
        try {
          // Ask user if they want to load the shared deck
          const shouldLoad = window.confirm(
            `This URL contains a shared deck "${urlDeckData.name}". ` +
            'Would you like to load it? This will replace your current deck.'
          );

          if (shouldLoad) {
            await loadDeckFromURL(urlDeckData);
            // Clear URL parameter after loading
            urlDeckSharingService.clearDeckFromURL();
            return;
          }
        } catch (error) {
          console.error('Failed to load deck from URL:', error);
          alert('Failed to load shared deck. The URL may be corrupted or invalid.');
        }
      }

      // If no URL deck or user declined, load from localStorage
      const savedDeck = localStorage.getItem(STORAGE_KEY);
      if (savedDeck) {
        try {
          const parsedDeck = JSON.parse(savedDeck);
          dispatch(setCurrentDeck(parsedDeck));
          setDeckName(parsedDeck.name);
          setLastSaved(new Date(parsedDeck.updatedAt));
        } catch (error) {
          console.error('Failed to load saved deck:', error);
          initializeNewDeck();
        }
      } else {
        initializeNewDeck();
      }
    };

    loadDeckFromSources();
  }, [dispatch]);

  // Initialize a new anonymous deck
  const initializeNewDeck = useCallback(() => {
    const newDeck = {
      id: `anonymous-${Date.now()}`,
      name: 'My Anonymous Deck',
      description: 'Built without an account',
      isPublic: false,
      userId: 'anonymous',
      currentVersion: 1,
      versionName: null,
      isTemplate: false,
      templateSource: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards: []
    };
    dispatch(setCurrentDeck(newDeck));
    setDeckName(newDeck.name);
    saveToLocalStorage(newDeck);
  }, [dispatch]);

  // Save current deck to localStorage and optionally to offline storage
  const saveToLocalStorage = useCallback(async (deck: typeof currentDeck, saveOffline = false) => {
    if (deck) {
      setSaveStatus('saving');

      const deckToSave = {
        ...deck,
        updatedAt: new Date().toISOString()
      };

      // Always save to localStorage for immediate access
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deckToSave));
      setLastSaved(new Date());

      // Save to offline storage if requested or if offline
      if (saveOffline || !isOnline) {
        try {
          await pwaService.saveOfflineDeck({
            id: deckToSave.id,
            name: deckToSave.name,
            cards: deckToSave.cards || [],
            createdAt: deckToSave.createdAt
          });

          await loadPendingSyncCount();
          setSaveStatus(isOnline ? 'saved' : 'offline');
        } catch (error) {
          console.error('Failed to save deck offline:', error);
          setSaveStatus('error');
        }
      } else {
        setSaveStatus('saved');
      }
    }
  }, [isOnline]);

  // Load deck from URL encoded data
  const loadDeckFromURL = useCallback(async (urlDeckData: any) => {
    try {
      // Create a temporary deck structure from URL data
      // Note: We only have card IDs, not full card data, so we'd need to fetch the cards
      // For now, we'll create a simplified version and let the user search/add cards manually
      const newDeck = {
        id: `shared-${Date.now()}`,
        name: urlDeckData.name || 'Shared Deck',
        description: urlDeckData.description || 'Loaded from shared URL',
        isPublic: false,
        userId: 'anonymous',
        currentVersion: 1,
        versionName: null,
        isTemplate: false,
        templateSource: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cards: [] // We'll start with empty and let user rebuild
      };

      dispatch(setCurrentDeck(newDeck));
      setDeckName(newDeck.name);
      saveToLocalStorage(newDeck);

      // Show information about the shared deck
      alert(
        `Loaded shared deck: "${urlDeckData.name}"\n\n` +
        `This deck contained ${urlDeckData.cards?.length || 0} cards. ` +
        'You can now rebuild it using the card search, or import a complete deck file.'
      );

    } catch (error) {
      console.error('Failed to load deck from URL:', error);
      throw error;
    }
  }, [dispatch, saveToLocalStorage]);

  // Auto-save deck changes to localStorage
  useEffect(() => {
    if (currentDeck && currentDeck.id.startsWith('anonymous-')) {
      saveToLocalStorage(currentDeck);
    }
  }, [currentDeck, saveToLocalStorage]);

  // Handle card selection from search
  const handleCardSelect = useCallback((card: CardWithRelations) => {
    if (currentDeck) {
      dispatch(addCardToCurrentDeck({
        card,
        quantity: 1,
        category: 'main'
      }));
    }
  }, [currentDeck, dispatch]);

  // Handle card quantity updates
  const handleQuantityChange = useCallback((cardId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeCardFromCurrentDeck(cardId));
    } else {
      dispatch(updateCardQuantityInCurrentDeck({ cardId, quantity }));
    }
  }, [dispatch]);

  // Handle search results for drag-and-drop
  const handleSearchResults = useCallback((cards: CardWithRelations[]) => {
    setSearchResults(cards);
  }, []);

  // Handle card drops into deck areas
  const handleCardDrop = useCallback((cardId: string, action: 'move' | 'copy') => {
    const card = searchResults.find(c => c.id === cardId);
    if (card) {
      handleCardSelect(card);
    }
  }, [searchResults, handleCardSelect]);

  // Handle deck name change
  const handleDeckNameChange = useCallback((name: string) => {
    setDeckName(name);
    if (currentDeck) {
      const updatedDeck = { ...currentDeck, name };
      dispatch(setCurrentDeck(updatedDeck));
    }
  }, [currentDeck, dispatch]);

  // Handle deck export
  const handleExport = useCallback((format: 'json' | 'text' | 'csv' | 'mtga') => {
    if (!currentDeck || currentDeck.cards.length === 0) return;

    const exportableDeck = {
      name: deckName,
      description: 'Anonymous deck from Gundam Card Game Builder',
      cards: currentDeck.cards.map(deckCard => ({
        card: deckCard.card,
        quantity: deckCard.quantity,
        category: deckCard.category || 'main'
      })),
      createdAt: new Date()
    };

    const options = {
      format,
      includeMetadata: true,
      includeStats: format === 'text',
      groupByType: format === 'text',
      sortBy: 'name' as const,
      sortOrder: 'asc' as const
    };

    try {
      deckExporter.downloadDeck(exportableDeck, options);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  }, [currentDeck, deckName]);

  // Clear current deck and start fresh
  const handleNewDeck = useCallback(() => {
    if (currentDeck?.cards?.length && currentDeck.cards.length > 0) {
      const confirm = window.confirm('Are you sure you want to create a new deck? Your current deck will be lost unless you export it first.');
      if (!confirm) return;
    }
    initializeNewDeck();
    dispatch(setIsEditing(true));
  }, [currentDeck, initializeNewDeck, dispatch]);

  // Handle deck sharing via URL
  const handleShareDeck = useCallback(() => {
    if (!currentDeck || currentDeck.cards.length === 0) {
      alert('Cannot share an empty deck!');
      return;
    }

    try {
      setShareError('');
      setCopySuccess(false);

      // Convert deck to ShareableDeck format
      const shareableDeck = {
        id: currentDeck.id,
        name: currentDeck.name,
        description: currentDeck.description || undefined,
        format: undefined,
        cards: currentDeck.cards.map(deckCard => ({
          cardId: deckCard.cardId,
          card: deckCard.card,
          quantity: deckCard.quantity,
          category: deckCard.category || 'main'
        }))
      };

      // Check if deck can be shared via URL
      const shareCheck = urlDeckSharingService.canShareDeckViaURL(shareableDeck);
      if (!shareCheck.canShare) {
        setShareError(shareCheck.reason || 'Cannot share this deck via URL');
        setShowShareModal(true);
        return;
      }

      // Generate share URL
      const url = urlDeckSharingService.generateShareURL(shareableDeck);
      setShareURL(url);
      setShowShareModal(true);
    } catch (error) {
      console.error('Share failed:', error);
      setShareError(error instanceof Error ? error.message : 'Failed to create share URL');
      setShowShareModal(true);
    }
  }, [currentDeck]);

  // Copy share URL to clipboard
  const handleCopyShareURL = useCallback(async () => {
    try {
      await urlDeckSharingService.copyToClipboard(shareURL);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Failed to copy URL. Please copy it manually.');
    }
  }, [shareURL]);

  // Close share modal
  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
    setShareURL('');
    setShareError('');
    setCopySuccess(false);
  }, []);

  // Calculate deck statistics
  const totalCards = currentDeck?.cards.reduce((sum, deckCard) => sum + deckCard.quantity, 0) || 0;
  const uniqueCards = currentDeck?.cards.length || 0;
  const totalCost = currentDeck?.cards.reduce((sum, deckCard) =>
    sum + ((deckCard.card.cost || 0) * deckCard.quantity), 0) || 0;

  // Group cards by type for better organization
  const cardsByType = currentDeck?.cards.reduce((acc, deckCard) => {
    const type = deckCard.card.type?.name || 'Unknown';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(deckCard);
    return acc;
  }, {} as Record<string, typeof currentDeck.cards>) || {};

  return (
    <div className={className}>
      {/* Anonymous Deck Header */}
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800">Anonymous Deck Building</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your deck is saved locally in your browser.
                <span className="font-medium"> Sign in to save decks permanently and share them with others!</span>
              </p>
            </div>
          </div>
        </div>

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
              variant={isEditing ? 'primary' : 'outline'}
            >
              {isEditing ? 'Done Editing' : 'Edit Deck'}
            </Button>
          </div>

          {/* Save Status with Offline Support */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {saveStatus === 'saving' && (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && lastSaved && (
                <>
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-600">Saved {lastSaved.toLocaleTimeString()}</span>
                </>
              )}
              {saveStatus === 'offline' && lastSaved && (
                <>
                  <span className="text-orange-600">📡</span>
                  <span className="text-orange-600">Saved offline {lastSaved.toLocaleTimeString()}</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <span className="text-red-600">⚠️</span>
                  <span className="text-red-600">Save failed</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Online/Offline indicator */}
              <div className={`w-3 h-3 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-xs text-gray-600">
                {isOnline ? 'Online' : 'Offline'}
              </span>

              {/* Pending sync indicator */}
              {pendingSyncCount > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-orange-600">
                    {pendingSyncCount} pending sync
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Offline Mode Notice */}
          {!isOnline && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-orange-600">📡</span>
                <div className="text-sm">
                  <div className="font-medium text-orange-900">You're offline</div>
                  <div className="text-orange-700">
                    Your deck changes are being saved locally and will sync automatically when you're back online.
                  </div>
                  {pendingSyncCount > 0 && (
                    <div className="text-orange-600 mt-1">
                      {pendingSyncCount} deck{pendingSyncCount === 1 ? '' : 's'} waiting to sync
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Deck Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">{totalCards}</div>
            <div className="text-sm text-gray-600">Total Cards</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">{uniqueCards}</div>
            <div className="text-sm text-gray-600">Unique Cards</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">{totalCost}</div>
            <div className="text-sm text-gray-600">Total Cost</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
                  Click or drag cards to add them to your deck. All changes are saved automatically to your browser.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deck Validation */}
          <div className="mt-6">
            <DeckValidator
              cards={currentDeck?.cards.map(deckCard => ({
                card: deckCard.card,
                quantity: deckCard.quantity,
                category: deckCard.category || 'main'
              })) || []}
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
                  {uniqueCards === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-lg font-medium">Your deck is empty</p>
                      <p>Start by searching for cards to add</p>
                    </div>
                  ) : (
                    Object.entries(cardsByType).map(([typeName, cards]) => (
                      <div key={typeName} className="space-y-2">
                        <div className="flex items-center gap-2 sticky top-0 bg-white py-1">
                          <Badge variant="secondary" className="text-xs">
                            {typeName}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            ({cards.reduce((sum, card) => sum + card.quantity, 0)} cards)
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
                            onRemove={() => handleQuantityChange(deckCard.cardId, 0)}
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
      </div>

      {/* Detailed Validation Panel */}
      <div className="mt-6 hidden lg:block">
        <DeckValidator
          cards={currentDeck?.cards.map(deckCard => ({
            card: deckCard.card,
            quantity: deckCard.quantity,
            category: deckCard.category || 'main'
          })) || []}
          showDetails={true}
          onlyErrors={false}
        />
      </div>

      {/* Deck Actions */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Button variant="outline" onClick={handleNewDeck}>
          New Deck
        </Button>

        <div className="relative group">
          <Button
            variant="outline"
            disabled={uniqueCards === 0}
            onClick={() => handleExport('json')}
          >
            Export Deck
            <span className="ml-1 text-xs">▼</span>
          </Button>

          {/* Export Options Dropdown */}
          <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-white border rounded-lg shadow-lg z-10 min-w-48">
            <div className="py-1">
              <button
                onClick={() => handleExport('json')}
                disabled={uniqueCards === 0}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                📄 JSON Format
                <div className="text-xs text-gray-500">Complete deck data</div>
              </button>
              <button
                onClick={() => handleExport('text')}
                disabled={uniqueCards === 0}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                📝 Text Format
                <div className="text-xs text-gray-500">Human readable</div>
              </button>
              <button
                onClick={() => handleExport('csv')}
                disabled={uniqueCards === 0}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                📊 CSV Format
                <div className="text-xs text-gray-500">Spreadsheet compatible</div>
              </button>
            </div>
          </div>
        </div>

        {/* Share Deck Button */}
        <Button
          variant="outline"
          disabled={uniqueCards === 0}
          onClick={handleShareDeck}
        >
          🔗 Share via URL
        </Button>

        {/* Sign In Prompt */}
        <Button
          variant="primary"
          onClick={() => {
            window.location.href = '/auth/signin?callbackUrl=/decks';
          }}
        >
          🔐 Sign In to Save Permanently
        </Button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Deck</h3>
              <button
                onClick={handleCloseShareModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {shareError ? (
              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-red-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Cannot Share Deck</h4>
                      <p className="text-sm text-red-700 mt-1">{shareError}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={handleCloseShareModal}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Share your deck with this temporary URL. The link contains your complete deck data and can be opened by anyone.
                  </p>
                  <div className="bg-gray-50 border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={shareURL}
                        readOnly
                        className="flex-1 text-sm bg-transparent border-none outline-none text-gray-700"
                      />
                      <Button
                        onClick={handleCopyShareURL}
                        variant="outline"
                        className="text-sm"
                      >
                        {copySuccess ? '✓ Copied!' : '📋 Copy'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <svg className="h-4 w-4 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-xs font-medium text-blue-800">Temporary Share Link</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        This URL contains your deck data and works without an account. For permanent sharing and deck libraries, sign in to save decks to your account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleCloseShareModal}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      window.location.href = '/auth/signin?callbackUrl=/decks';
                    }}
                    variant="primary"
                    className="flex-1"
                  >
                    Sign In for More
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Anonymous Features Notice */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Anonymous Deck Building Features:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✅ Build decks with full card search and filtering</li>
          <li>✅ Automatic local saving (persists until you clear browser data)</li>
          <li>✅ Export decks in multiple formats (JSON, Text, CSV)</li>
          <li>✅ Real-time deck validation and statistics</li>
          <li>✅ Drag and drop card management</li>
          <li>✅ Share decks via temporary URLs</li>
        </ul>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Want more?</strong> Sign in to save decks permanently, share them with others, and access your deck collection from any device!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnonymousDeckBuilder;