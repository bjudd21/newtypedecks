// PWA components exports
export { PWAInstallPrompt } from './PWAInstallPrompt';
export { PWAStatus } from './PWAStatus';

// Re-export types and service
export type {
  PWAState,
  OfflineDeck,
  OfflineCollectionUpdate,
  PWAInstallPrompt as PWAInstallPromptType
} from '@/lib/services/pwaService';

export { pwaService } from '@/lib/services/pwaService';