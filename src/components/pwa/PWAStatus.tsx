/**
 * PWAStatus - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./PWAStatus/ directory.
 */

export { PWAStatusComponent as PWAStatus } from './PWAStatus/PWAStatusComponent';
export { usePWAState } from './PWAStatus/hooks/usePWAState';
export { usePWAHandlers } from './PWAStatus/hooks/usePWAHandlers';
export { CompactView } from './PWAStatus/components/CompactView';
export { StatusItem } from './PWAStatus/components/StatusItem';
export { OfflineFeatures } from './PWAStatus/components/OfflineFeatures';
export { OfflineModeAlert } from './PWAStatus/components/OfflineModeAlert';
export { LoadingState } from './PWAStatus/components/LoadingState';
export type { PWAStatusProps } from './PWAStatus/types';
export { PWAStatusComponent as default } from './PWAStatus/PWAStatusComponent';
