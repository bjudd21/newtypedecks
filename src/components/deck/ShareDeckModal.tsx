/**
 * ShareDeckModal Component
 * Modal for sharing decks via URL with clipboard functionality
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui';

interface ShareDeckModalProps {
  show: boolean;
  shareURL: string;
  shareError: string;
  copySuccess: boolean;
  onClose: () => void;
  onCopyURL: () => void;
}

export const ShareDeckModal: React.FC<ShareDeckModalProps> = ({
  show,
  shareURL,
  shareError,
  copySuccess,
  onClose,
  onCopyURL,
}) => {
  if (!show) return null;

  return (
    <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="border-border from-card to-accent w-full max-w-md rounded-xl border bg-gradient-to-br p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-foreground text-lg font-semibold">Share Deck</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {shareError ? (
          <div className="mb-4">
            <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4">
              <div className="flex items-start">
                <svg
                  className="mt-0.5 mr-2 h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-red-300">
                    Cannot Share Deck
                  </h4>
                  <p className="mt-1 text-sm text-red-400">{shareError}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-foreground mb-3 text-sm">
                Share your deck with this temporary URL. The link contains your
                complete deck data and can be opened by anyone.
              </p>
              <div className="border-border bg-background/50 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareURL}
                    readOnly
                    className="flex-1 border-none bg-transparent text-sm text-gray-200 outline-none"
                  />
                  <Button
                    onClick={onCopyURL}
                    variant="outline"
                    className="text-sm"
                  >
                    {copySuccess ? '✓ Copied!' : '📋 Copy'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-primary/30 from-card to-accent mb-4 rounded-lg border bg-gradient-to-r p-3">
              <div className="flex items-start">
                <svg
                  className="text-primary/80 mt-0.5 mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-primary/80 text-xs font-semibold">
                    Temporary Share Link
                  </h4>
                  <p className="text-foreground mt-1 text-xs">
                    This URL contains your deck data and works without an
                    account. For permanent sharing and deck libraries, sign in
                    to save decks to your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1">
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
  );
};
