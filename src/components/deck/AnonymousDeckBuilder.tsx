'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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

    const unsubscribeDeckSynced = pwaService.on('deckSynced', (deck: unknown) => {
      const deckObj = deck as { name?: string };
      console.warn('Deck synced:', deckObj.name);
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
          console.warn('TODO: Replace with proper UI dialog');
          const shouldLoad = true; // Auto-load for now

          if (shouldLoad) {
            await loadDeckFromURL(urlDeckData);
            // Clear URL parameter after loading
            urlDeckSharingService.clearDeckFromURL();
            return;
          }
        } catch (error) {
          console.error('Failed to load deck from URL:', error);
          console.warn('TODO: Replace with proper UI notification - Failed to load shared deck. The URL may be corrupted or invalid.');
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
      createdAt: new Date(),
      updatedAt: new Date(),
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
        updatedAt: new Date()
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
  const loadDeckFromURL = useCallback(async (urlDeckData: unknown) => {
    try {
      const deckData = urlDeckData as { name?: string; description?: string; cards?: unknown[] };
      // Create a temporary deck structure from URL data
      // Note: We only have card IDs, not full card data, so we'd need to fetch the cards
      // For now, we'll create a simplified version and let the user search/add cards manually
      const newDeck = {
        id: `shared-${Date.now()}`,
        name: deckData.name || 'Shared Deck',
        description: deckData.description || 'Loaded from shared URL',
        isPublic: false,
        userId: 'anonymous',
        currentVersion: 1,
        versionName: null,
        isTemplate: false,
        templateSource: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        cards: [] // We'll start with empty and let user rebuild
      };

      dispatch(setCurrentDeck(newDeck));
      setDeckName(newDeck.name);
      saveToLocalStorage(newDeck);

      // Show information about the shared deck
      console.warn(`TODO: Replace with proper UI notification - Loaded shared deck: "${deckData.name}". This deck contained ${deckData.cards?.length || 0} cards. You can now rebuild it using the card search, or import a complete deck file.`);

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
  const handleCardDrop = useCallback((cardId: string, _action: 'move' | 'copy') => {
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
      console.warn('TODO: Replace with proper UI notification - Export failed. Please try again.');
    }
  }, [currentDeck, deckName]);

  // Clear current deck and start fresh
  const handleNewDeck = useCallback(() => {
    if (currentDeck?.cards?.length && currentDeck.cards.length > 0) {
      console.warn('TODO: Replace with proper UI confirmation dialog');
      // For now, proceed without confirmation
    }
    initializeNewDeck();
    dispatch(setIsEditing(true));
  }, [currentDeck, initializeNewDeck, dispatch]);

  // Handle deck sharing via URL
  const handleShareDeck = useCallback(() => {
    if (!currentDeck || currentDeck.cards.length === 0) {
      console.warn('TODO: Replace with proper UI notification - Cannot share an empty deck!');
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
        createdAt: currentDeck.createdAt,
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
      console.warn('TODO: Replace with proper UI notification - Failed to copy URL. Please copy it manually.');
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
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Anonymous Deck Header */}
      <div className="mb-6">
        <motion.div
          className="bg-gradient-to-r from-[#2d2640] to-[#3a3050] border border-[#8b7aaa]/30 rounded-xl p-5 mb-6 shadow-lg hover:shadow-[#8b7aaa]/20 transition-all duration-300"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-[#8b7aaa]/20 flex items-center justify-center">
                <svg className="h-6 w-6 text-[#a89ec7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[#a89ec7] mb-1">Anonymous Deck Building</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Your deck is saved locally in your browser.
                <span className="font-medium text-[#8b7aaa]"> Sign in to save decks permanently and share them with others!</span>
              </p>
            </div>
          </div>
        </motion.div>

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
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 text-sm">
              {saveStatus === 'saving' && (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#8b7aaa]"></div>
                  <span className="text-[#8b7aaa]">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && lastSaved && (
                <>
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-400">Saved {lastSaved.toLocaleTimeString()}</span>
                </>
              )}
              {saveStatus === 'offline' && lastSaved && (
                <>
                  <span className="text-orange-400">📡</span>
                  <span className="text-orange-400">Saved offline {lastSaved.toLocaleTimeString()}</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <span className="text-red-400">⚠️</span>
                  <span className="text-red-400">Save failed</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Online/Offline indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${
                  isOnline ? 'bg-green-400 shadow-green-400/50' : 'bg-red-400 shadow-red-400/50'
                } animate-pulse`} />
                <span className="text-xs text-gray-400 font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Pending sync indicator */}
              {pendingSyncCount > 0 && (
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                  {pendingSyncCount} pending
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Offline Mode Notice */}
          {!isOnline && (
            <motion.div
              className="bg-gradient-to-r from-orange-900/20 to-orange-800/20 border border-orange-500/30 rounded-xl p-4 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">📡</span>
                <div className="text-sm">
                  <div className="font-semibold text-orange-300 mb-1">You&apos;re offline</div>
                  <div className="text-orange-200/80">
                    Your deck changes are being saved locally and will sync automatically when you&apos;re back online.
                  </div>
                  {pendingSyncCount > 0 && (
                    <div className="text-orange-300 mt-2 font-medium">
                      {pendingSyncCount} deck{pendingSyncCount === 1 ? '' : 's'} waiting to sync
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Deck Statistics */}
        <motion.div
          className="grid grid-cols-3 gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="bg-gradient-to-br from-[#2d2640] to-[#3a3050] rounded-xl p-5 text-center border border-[#443a5c] shadow-lg hover:shadow-[#8b7aaa]/20 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-[#8b7aaa] to-[#a89ec7] bg-clip-text text-transparent">
              {totalCards}
            </div>
            <div className="text-sm text-gray-400 mt-2 font-medium">Total Cards</div>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-[#2d2640] to-[#3a3050] rounded-xl p-5 text-center border border-[#443a5c] shadow-lg hover:shadow-[#8b7aaa]/20 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ delay: 0.05 }}
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-[#8b7aaa] to-[#a89ec7] bg-clip-text text-transparent">
              {uniqueCards}
            </div>
            <div className="text-sm text-gray-400 mt-2 font-medium">Unique Cards</div>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-[#2d2640] to-[#3a3050] rounded-xl p-5 text-center border border-[#443a5c] shadow-lg hover:shadow-[#8b7aaa]/20 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-[#8b7aaa] to-[#a89ec7] bg-clip-text text-transparent">
              {totalCost}
            </div>
            <div className="text-sm text-gray-400 mt-2 font-medium">Total Cost</div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Card Search Panel */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="bg-[#2d2640] border-[#443a5c]">
            <CardHeader>
              <CardTitle className="text-[#a89ec7] text-lg">ADD CARDS</CardTitle>
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
                <div className="text-sm text-gray-400 bg-[#1a1625]/50 p-3 rounded-lg border border-[#443a5c]/30">
                  Click or drag cards to add them to your deck. All changes are saved automatically to your browser.
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
              cards={currentDeck?.cards.map(deckCard => ({
                card: deckCard.card,
                quantity: deckCard.quantity,
                category: deckCard.category || 'main'
              })) || []}
              showDetails={false}
              onlyErrors={true}
            />
          </motion.div>
        </div>

        {/* Deck Contents Panel */}
        <div className="xl:col-span-2">
          <Card className="bg-[#2d2640] border-[#443a5c]">
            <CardHeader>
              <CardTitle className="text-[#a89ec7] text-lg flex items-center gap-2">
                DECK CONTENTS
                <Badge className="bg-[#8b7aaa]/20 text-[#a89ec7] border-[#8b7aaa]/30">
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
                      className="text-center py-12"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.svg
                        className="h-20 w-20 mx-auto mb-4 text-[#8b7aaa]/30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </motion.svg>
                      <p className="text-xl font-semibold text-[#a89ec7] mb-2">Your deck is empty</p>
                      <p className="text-gray-400">Start by searching for cards to add</p>
                    </motion.div>
                  ) : (
                    Object.entries(cardsByType).map(([typeName, cards]) => (
                      <div key={typeName} className="space-y-2">
                        <div className="flex items-center gap-2 sticky top-0 bg-[#2d2640] py-2 z-10">
                          <Badge variant="secondary" className="text-xs bg-[#8b7aaa]/20 text-[#a89ec7] border-[#8b7aaa]/30">
                            {typeName}
                          </Badge>
                          <span className="text-sm text-gray-400">
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
      </motion.div>

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
          variant="default"
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

                <div className="bg-gradient-to-r from-[#2d2640] to-[#3a3050] border border-[#8b7aaa]/30 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <svg className="h-4 w-4 text-[#a89ec7] mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-xs font-semibold text-[#a89ec7]">Temporary Share Link</h4>
                      <p className="text-xs text-gray-300 mt-1">
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
                    variant="default"
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
      <motion.div
        className="mt-8 bg-gradient-to-br from-[#2d2640] to-[#3a3050] rounded-xl p-6 border border-[#443a5c] shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h4 className="font-semibold text-[#a89ec7] text-lg mb-4">Anonymous Deck Building Features:</h4>
        <ul className="text-sm text-gray-300 space-y-2">
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
        <div className="mt-4 pt-4 border-t border-[#443a5c]">
          <p className="text-sm text-gray-300">
            <strong className="text-[#a89ec7]">Want more?</strong> Sign in to save decks permanently, share them with others, and access your deck collection from any device!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnonymousDeckBuilder;