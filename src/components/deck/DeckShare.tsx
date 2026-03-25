'use client';

import React, { useState, useCallback } from 'react';
import type { DeckVisibility } from '@prisma/client';
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
  visibility: DeckVisibility;
  onVisibilityChange?: (visibility: DeckVisibility) => void;
  className?: string;
  /** Game name for share text (e.g. from useGame().name) */
  gameName?: string;
}

const VISIBILITY_OPTIONS: {
  value: DeckVisibility;
  label: string;
  description: string;
}[] = [
  { value: 'DRAFT', label: 'Draft', description: 'Only visible to you' },
  {
    value: 'PRIVATE',
    label: 'Private',
    description: 'Shareable by link only',
  },
  {
    value: 'PUBLIC',
    label: 'Public',
    description: 'Visible in deck library',
  },
];

export const DeckShare: React.FC<DeckShareProps> = ({
  deckId,
  deckName,
  visibility,
  onVisibilityChange,
  className,
  gameName = 'Card Game',
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/decks/${deckId}`;
  const isShareable = visibility === 'PRIVATE' || visibility === 'PUBLIC';

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

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: deckName,
        text: `Check out my ${gameName} deck: ${deckName}`,
        url: shareUrl,
      });
    } else {
      handleCopyUrl();
    }
  }, [deckName, gameName, shareUrl, handleCopyUrl]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Share Deck</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visibility Selector */}
        <div className="grid grid-cols-3 gap-2">
          {VISIBILITY_OPTIONS.map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => onVisibilityChange?.(value)}
              className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                visibility === value
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-border bg-card text-muted-foreground hover:border-border hover:bg-accent'
              }`}
            >
              <div className="font-medium">{label}</div>
              <div className="text-muted-foreground/70 mt-0.5 text-xs">
                {description}
              </div>
            </button>
          ))}
        </div>

        {/* Share URL (PRIVATE and PUBLIC) */}
        {isShareable && (
          <div>
            <label className="text-muted-foreground mb-2 block text-sm font-medium">
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
                {copied ? '✓ Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        )}

        {/* Social share actions (PUBLIC only) */}
        {visibility === 'PUBLIC' && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleShare} className="w-full">
              Share
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const text = `Check out my ${gameName} deck: ${deckName}\n${shareUrl}`;
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                window.open(twitterUrl, '_blank');
              }}
              className="w-full"
            >
              Tweet
            </Button>
          </div>
        )}

        {/* State hint for DRAFT */}
        {visibility === 'DRAFT' && (
          <div className="bg-accent text-muted-foreground/70 rounded p-2 text-xs">
            <strong>Draft:</strong> Set to Private or Public to share this deck.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeckShare;
