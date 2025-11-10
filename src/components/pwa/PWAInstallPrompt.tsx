'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { pwaService } from '@/lib/services/pwaService';

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  className,
}) => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check initial PWA state
    pwaService.getPWAState().then((state) => {
      setIsInstallable(state.isInstallable);
      setIsInstalled(state.isInstalled);
    });

    // Listen for PWA events
    const unsubscribeInstallable = pwaService.on('installable', (data) => {
      setIsInstallable(data as boolean);
    });
    const unsubscribeInstalled = pwaService.on('installed', (data) => {
      setIsInstalled(data as boolean);
    });

    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }

    return () => {
      unsubscribeInstallable();
      unsubscribeInstalled();
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);

    try {
      const accepted = await pwaService.showInstallPrompt();
      if (!accepted) {
        setIsInstalling(false);
      }
      // If accepted, the 'installed' event will handle the state
    } catch (error) {
      console.error('Install failed:', error);
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if not installable, already installed, or dismissed
  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  return (
    <Card
      className={`border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              📱
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="mb-1 font-semibold text-blue-900">
              Install Gundam Card Game App
            </h3>
            <p className="mb-3 text-sm text-blue-700">
              Get faster access, offline support, and a native app experience.
              Perfect for tournaments and on-the-go deck building!
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <span>✓</span>
                <span>Works offline with cached decks and cards</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <span>✓</span>
                <span>Faster loading and native app feel</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <span>✓</span>
                <span>Home screen shortcut and app icon</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={handleInstall}
            variant="default"
            size="sm"
            disabled={isInstalling}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isInstalling ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Installing...
              </>
            ) : (
              <>📱 Install App</>
            )}
          </Button>

          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-700"
          >
            Not Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallPrompt;
