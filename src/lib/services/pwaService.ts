/**
 * PWA Service
 * Handles Progressive Web App functionality including service worker registration,
 * installation prompts, offline detection, and background sync
 */

export interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isServiceWorkerRegistered: boolean;
  updateAvailable: boolean;
  cacheSize: number;
}

export interface OfflineDeck {
  id: string;
  name: string;
  cards: unknown[];
  createdAt: Date;
  synced: boolean;
}

export interface OfflineCollectionUpdate {
  id: string;
  cardId: string;
  quantity: number;
  timestamp: Date;
  synced: boolean;
}

export interface PWAInstallPrompt {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Event listener type for PWA events
type PWAEventListener = (data: unknown) => void;

// Extended Navigator interface with standalone property
interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

// Extended ServiceWorkerRegistration with SyncManager
interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: {
    register(tag: string): Promise<void>;
  };
}

// BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAService {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private listeners: Map<string, PWAEventListener[]> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeEventListeners();
    }
  }

  // Initialize PWA event listeners
  private initializeEventListeners() {
    // Service Worker registration
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }

    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.emit('installable', true);
    });

    // PWA installation detection
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.emit('installed', true);
    });

    // Online/offline detection
    window.addEventListener('online', () => {
      this.emit('online', true);
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.emit('online', false);
    });

    // Custom PWA install prompt event
    window.addEventListener('pwa-install-prompt', () => {
      this.showInstallPrompt();
    });
  }

  // Register service worker
  private async registerServiceWorker(): Promise<void> {
    try {
      // Only register service worker in production or if sw.js exists
      if (process.env.NODE_ENV !== 'production') {
        console.log('Service Worker registration skipped in development');
        return;
      }

      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully');
      this.emit('serviceWorkerRegistered', true);

      // Listen for service worker updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              this.emit('updateAvailable', true);
            }
          });
        }
      });

      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event);
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  // Handle service worker messages
  private handleServiceWorkerMessage(event: MessageEvent) {
    const { data } = event;

    switch (data.type) {
      case 'CACHE_SIZE':
        this.emit('cacheSize', data.size);
        break;

      case 'CACHE_CLEARED':
        this.emit('cacheCleared', true);
        break;

      case 'SYNC_COMPLETE':
        this.emit('syncComplete', data.type);
        break;
    }
  }

  // Event emitter methods
  private emit(event: string, data: unknown) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((callback) => callback(data));
  }

  public on(event: string, callback: PWAEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  // PWA Installation
  public async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      const result = await this.deferredPrompt.prompt();
      this.deferredPrompt = null;

      return result.outcome === 'accepted';
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }

  public isInstallable(): boolean {
    return this.deferredPrompt !== null;
  }

  public isInstalled(): boolean {
    // Check if running in standalone mode (installed PWA)
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as NavigatorStandalone).standalone === true
    );
  }

  // Service Worker Management
  public async updateServiceWorker(): Promise<void> {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  public async unregisterServiceWorker(): Promise<boolean> {
    if (this.registration) {
      return await this.registration.unregister();
    }
    return false;
  }

  // Cache Management
  public async getCacheSize(): Promise<number> {
    return new Promise((resolve) => {
      if (!this.registration || !navigator.serviceWorker.controller) {
        resolve(0);
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_SIZE') {
          resolve(event.data.size);
        }
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      );
    });
  }

  public async clearCache(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.registration || !navigator.serviceWorker.controller) {
        resolve();
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_CLEARED') {
          resolve();
        }
      };

      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' }, [
        messageChannel.port2,
      ]);
    });
  }

  // Offline Data Management
  public async saveOfflineDeck(
    deck: Omit<OfflineDeck, 'synced'>
  ): Promise<void> {
    const deckData: OfflineDeck = {
      ...deck,
      synced: false,
    };

    await this.storeOfflineData('pending-deck-saves', deckData);

    // Register background sync if available
    if (
      'serviceWorker' in navigator &&
      'sync' in window.ServiceWorkerRegistration.prototype
    ) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
          await (
            registration as ServiceWorkerRegistrationWithSync
          ).sync?.register('sync-deck-saves');
        }
      } catch (error) {
        console.warn('Background sync registration failed:', error);
      }
    }
  }

  public async saveOfflineCollectionUpdate(
    update: Omit<OfflineCollectionUpdate, 'synced'>
  ): Promise<void> {
    const updateData: OfflineCollectionUpdate = {
      ...update,
      synced: false,
    };

    await this.storeOfflineData('pending-collection-updates', updateData);

    // Register background sync if available
    if (
      'serviceWorker' in navigator &&
      'sync' in window.ServiceWorkerRegistration.prototype
    ) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
          await (
            registration as ServiceWorkerRegistrationWithSync
          ).sync?.register('sync-collection-updates');
        }
      } catch (error) {
        console.warn('Background sync registration failed:', error);
      }
    }
  }

  public async getOfflineDecks(): Promise<OfflineDeck[]> {
    return await this.getOfflineData('pending-deck-saves');
  }

  public async getOfflineCollectionUpdates(): Promise<
    OfflineCollectionUpdate[]
  > {
    return await this.getOfflineData('pending-collection-updates');
  }

  private async storeOfflineData(
    storeName: string,
    data: OfflineDeck | OfflineCollectionUpdate
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('GCG-Offline', 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        store.put(data);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
    });
  }

  private async getOfflineData<T = OfflineDeck | OfflineCollectionUpdate>(
    storeName: string
  ): Promise<T[]> {
    return new Promise((resolve) => {
      const request = indexedDB.open('GCG-Offline', 1);

      request.onerror = () => resolve([]);

      request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;

        if (!db.objectStoreNames.contains(storeName)) {
          resolve([]);
          return;
        }

        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
        getAllRequest.onerror = () => resolve([]);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
    });
  }

  // Sync offline data when back online
  private async syncOfflineData(): Promise<void> {
    try {
      // Sync deck saves
      const offlineDecks = await this.getOfflineDecks();
      for (const deck of offlineDecks) {
        if (!deck.synced) {
          await this.syncDeck(deck);
        }
      }

      // Sync collection updates
      const collectionUpdates = await this.getOfflineCollectionUpdates();
      for (const update of collectionUpdates) {
        if (!update.synced) {
          await this.syncCollectionUpdate(update);
        }
      }

      console.warn('Offline data sync completed');
    } catch (error) {
      console.error('Offline data sync failed:', error);
    }
  }

  private async syncDeck(deck: OfflineDeck): Promise<void> {
    try {
      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: deck.name,
          cards: deck.cards,
        }),
      });

      if (response.ok) {
        // Mark as synced and remove from offline storage
        await this.removeOfflineData('pending-deck-saves', deck.id);
        this.emit('deckSynced', deck);
      }
    } catch (error) {
      console.error('Failed to sync deck:', error);
    }
  }

  private async syncCollectionUpdate(
    update: OfflineCollectionUpdate
  ): Promise<void> {
    try {
      const response = await fetch('/api/collections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: update.cardId,
          quantity: update.quantity,
        }),
      });

      if (response.ok) {
        // Mark as synced and remove from offline storage
        await this.removeOfflineData('pending-collection-updates', update.id);
        this.emit('collectionUpdateSynced', update);
      }
    } catch (error) {
      console.error('Failed to sync collection update:', error);
    }
  }

  private async removeOfflineData(
    storeName: string,
    id: string
  ): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.open('GCG-Offline', 1);

      request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        store.delete(id);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => resolve();
      };

      request.onerror = () => resolve();
    });
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
    if (bytes === 0) return '0 B';

    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, i)).toFixed(1);

    return `${size} ${sizes[i]}`;
  }
}

// Export singleton instance
export const pwaService = new PWAService();
