'use client';

import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from '@/components/ui';

interface DeckShareProps {
  deckId: string;
  deckName: string;
  isPublic: boolean;
  onVisibilityChange?: (isPublic: boolean) => void;
  className?: string;
}

export const DeckShare: React.FC<DeckShareProps> = ({
  deckId,
  deckName,
  isPublic,
  onVisibilityChange,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/decks/${deckId}`;

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const handleVisibilityToggle = useCallback(() => {
    const newVisibility = !isPublic;
    onVisibilityChange?.(newVisibility);
  }, [isPublic, onVisibilityChange]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: deckName,
        text: `Check out my Gundam Card Game deck: ${deckName}`,
        url: shareUrl,
      });
    } else {
      handleCopyUrl();
    }
  }, [deckName, shareUrl, handleCopyUrl]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Share Deck</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visibility Controls */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div>
            <h3 className="font-medium text-gray-900">
              {isPublic ? 'Public Deck' : 'Private Deck'}
            </h3>
            <p className="text-sm text-gray-600">
              {isPublic
                ? 'Anyone can view and copy this deck'
                : 'Only you can view this deck'}
            </p>
          </div>
          <Button
            variant={isPublic ? 'primary' : 'outline'}
            size="sm"
            onClick={handleVisibilityToggle}
          >
            {isPublic ? 'Make Private' : 'Make Public'}
          </Button>
        </div>

        {/* Share URL (only if public) */}
        {isPublic && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Share URL
            </label>
            <div className="flex space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                variant="outline"
                onClick={handleCopyUrl}
                className="px-3"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </Button>
            </div>
          </div>
        )}

        {/* Share Actions */}
        {isPublic && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleShare} className="w-full">
              📤 Share
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const text = `Check out my Gundam Card Game deck: ${deckName}\n${shareUrl}`;
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                window.open(twitterUrl, '_blank');
              }}
              className="w-full"
            >
              🐦 Tweet
            </Button>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="rounded bg-blue-50 p-2 text-xs text-gray-500">
          {isPublic ? (
            <>
              <strong>🌍 Public:</strong> This deck will appear in community
              deck lists and be accessible to anyone with the link.
            </>
          ) : (
            <>
              <strong>🔒 Private:</strong> This deck is only visible to you.
              Make it public to share with others.
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckShare;
