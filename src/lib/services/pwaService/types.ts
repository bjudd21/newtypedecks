/**
 * PWA Service Types
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
export type PWAEventListener = (data: unknown) => void;

// Extended Navigator interface with standalone property
export interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

// Extended ServiceWorkerRegistration with SyncManager
export interface ServiceWorkerRegistrationWithSync
  extends ServiceWorkerRegistration {
  sync?: {
    register(tag: string): Promise<void>;
  };
}

// BeforeInstallPromptEvent interface
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
