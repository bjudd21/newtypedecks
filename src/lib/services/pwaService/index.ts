/**
 * PWA Service
 * Handles Progressive Web App functionality including service worker registration,
 * installation prompts, offline detection, and background sync
 */

import type {
  PWAState,
  OfflineDeck,
  OfflineCollectionUpdate,
  PWAInstallPrompt,
  BeforeInstallPromptEvent,
  PWAEventListener,
} from './types';
import { EventEmitter } from './events/eventEmitter';
import {
  registerServiceWorker,
  handleServiceWorkerMessage,
} from './serviceWorker/registration';
import {
  updateServiceWorker,
  unregisterServiceWorker,
} from './serviceWorker/management';
import { getCacheSize, clearCache } from './cache/operations';
import {
  saveOfflineDeck,
  saveOfflineCollectionUpdate,
  getOfflineDecks,
  getOfflineCollectionUpdates,
} from './offline/operations';
import { syncOfflineData } from './sync/operations';
import {
  showInstallPrompt as showPrompt,
  isInstallable as checkInstallable,
  isInstalled as checkInstalled,
} from './install/operations';
import { formatCacheSize } from './utils/formatters';

export type {
  PWAState,
  OfflineDeck,
  OfflineCollectionUpdate,
  PWAInstallPrompt,
};

class PWAService {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();

    if (typeof window !== 'undefined') {
      this.initializeEventListeners();
    }
  }

  // Initialize PWA event listeners
  private initializeEventListeners() {
    // Service Worker registration
    if ('serviceWorker' in navigator) {
      this.registerServiceWorkerAndListen();
    }

    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.emitter.emit('installable', true);
    });

    // PWA installation detection
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.emitter.emit('installed', true);
    });

    // Online/offline detection
    window.addEventListener('online', () => {
      this.emitter.emit('online', true);
      syncOfflineData(this.emitter);
    });

    window.addEventListener('offline', () => {
      this.emitter.emit('online', false);
    });

    // Custom PWA install prompt event
    window.addEventListener('pwa-install-prompt', () => {
      this.showInstallPrompt();
    });
  }

  private async registerServiceWorkerAndListen(): Promise<void> {
    this.registration = await registerServiceWorker(this.emitter);

    if (this.registration) {
      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        handleServiceWorkerMessage(event, this.emitter);
      });
    }
  }

  // Event emitter methods
  public on(event: string, callback: PWAEventListener) {
    return this.emitter.on(event, callback);
  }

  // PWA Installation
  public async showInstallPrompt(): Promise<boolean> {
    const result = await showPrompt(this.deferredPrompt);
    if (result) {
      this.deferredPrompt = null;
    }
    return result;
  }

  public isInstallable(): boolean {
    return checkInstallable(this.deferredPrompt);
  }

  public isInstalled(): boolean {
    return checkInstalled();
  }

  // Service Worker Management
  public async updateServiceWorker(): Promise<void> {
    return updateServiceWorker(this.registration);
  }

  public async unregisterServiceWorker(): Promise<boolean> {
    return unregisterServiceWorker(this.registration);
  }

  // Cache Management
  public async getCacheSize(): Promise<number> {
    return getCacheSize(this.registration);
  }

  public async clearCache(): Promise<void> {
    return clearCache(this.registration);
  }

  // Offline Data Management
  public async saveOfflineDeck(
    deck: Omit<OfflineDeck, 'synced'>
  ): Promise<void> {
    return saveOfflineDeck(deck);
  }

  public async saveOfflineCollectionUpdate(
    update: Omit<OfflineCollectionUpdate, 'synced'>
  ): Promise<void> {
    return saveOfflineCollectionUpdate(update);
  }

  public async getOfflineDecks(): Promise<OfflineDeck[]> {
    return getOfflineDecks();
  }

  public async getOfflineCollectionUpdates(): Promise<
    OfflineCollectionUpdate[]
  > {
    return getOfflineCollectionUpdates();
  }

  // Utility methods
  public isOnline(): boolean {
    return navigator.onLine;
  }

  public async getPWAState(): Promise<PWAState> {
    const cacheSize = await this.getCacheSize();

    return {
      isInstalled: this.isInstalled(),
      isInstallable: this.isInstallable(),
      isOnline: this.isOnline(),
      isServiceWorkerRegistered: this.registration !== null,
      updateAvailable: false, // This would be set by service worker events
      cacheSize,
    };
  }

  // Format cache size for display
  public formatCacheSize(bytes: number): string {
    return formatCacheSize(bytes);
  }
}

// Export singleton instance
export const pwaService = new PWAService();
