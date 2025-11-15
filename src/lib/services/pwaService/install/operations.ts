/**
 * PWA Installation Operations
 */

import type { PWAInstallPrompt, NavigatorStandalone } from '../types';

export async function showInstallPrompt(
  deferredPrompt: PWAInstallPrompt | null
): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }

  try {
    const result = await deferredPrompt.prompt();
    return result.outcome === 'accepted';
  } catch (error) {
    console.error('Install prompt failed:', error);
    return false;
  }
}

export function isInstallable(deferredPrompt: PWAInstallPrompt | null): boolean {
  return deferredPrompt !== null;
}

export function isInstalled(): boolean {
  // Check if running in standalone mode (installed PWA)
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as NavigatorStandalone).standalone === true
  );
}
