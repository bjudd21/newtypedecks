'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { pwaService } from '@/lib/services/pwaService';

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  className
}) => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check initial PWA state
    pwaService.getPWAState().then(state => {
      setIsInstallable(state.isInstallable);
      setIsInstalled(state.isInstalled);
    });

    // Listen for PWA events
    const unsubscribeInstallable = pwaService.on('installable', setIsInstallable);
    const unsubscribeInstalled = pwaService.on('installed', setIsInstalled);

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
    <Card className={`bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              📱
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-blue-900 mb-1">
              Install Gundam Card Game App
            </h3>
            <p className="text-blue-700 text-sm mb-3">
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
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Button
            onClick={handleInstall}
            variant="primary"
            size="sm"
            disabled={isInstalling}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isInstalling ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Installing...
              </>
            ) : (
              <>
                📱 Install App
              </>
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