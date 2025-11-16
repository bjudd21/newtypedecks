/**
 * useDeckSharing Hook
 * Manages deck sharing via URL with clipboard functionality
 */

import { useState, useCallback } from 'react';
import { urlDeckSharingService } from '@/lib/services/urlDeckSharingService';
import type { CardWithRelations } from '@/lib/types/card';

interface ShareableDeck {
  id: string;
  name: string;
  description?: string;
  format?: string;
  createdAt: Date;
  cards: Array<{
    cardId: string;
    card: CardWithRelations;
    quantity: number;
    category: string;
  }>;
}

export function useDeckSharing() {
  const [shareURL, setShareURL] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareError, setShareError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Handle deck sharing via URL
  const handleShareDeck = useCallback((deck: ShareableDeck | null) => {
    if (!deck || deck.cards.length === 0) {
      console.warn(
        'TODO: Replace with proper UI notification - Cannot share an empty deck!'
      );
      return;
    }

    try {
      setShareError('');
      setCopySuccess(false);

      // Check if deck can be shared via URL
      const shareCheck = urlDeckSharingService.canShareDeckViaURL(deck);
      if (!shareCheck.canShare) {
        setShareError(shareCheck.reason || 'Cannot share this deck via URL');
        setShowShareModal(true);
        return;
      }

      // Generate share URL
      const url = urlDeckSharingService.generateShareURL(deck);
      setShareURL(url);
      setShowShareModal(true);
    } catch (error) {
      console.error('Share failed:', error);
      setShareError(
        error instanceof Error ? error.message : 'Failed to create share URL'
      );
      setShowShareModal(true);
    }
  }, []);

  // Copy share URL to clipboard
  const handleCopyShareURL = useCallback(async () => {
    try {
      await urlDeckSharingService.copyToClipboard(shareURL);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error) {
      console.error('Copy failed:', error);
      console.warn(
        'TODO: Replace with proper UI notification - Failed to copy URL. Please copy it manually.'
      );
    }
  }, [shareURL]);

  // Close share modal
  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
    setShareURL('');
    setShareError('');
    setCopySuccess(false);
  }, []);

  return {
    shareURL,
    showShareModal,
    shareError,
    copySuccess,
    handleShareDeck,
    handleCopyShareURL,
    handleCloseShareModal,
  };
}
