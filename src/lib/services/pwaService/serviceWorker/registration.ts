/**
 * Service Worker Registration
 */

import type { EventEmitter } from '../events/eventEmitter';

export async function registerServiceWorker(
  emitter: EventEmitter
): Promise<ServiceWorkerRegistration | null> {
  try {
    // Only register service worker in production or if sw.js exists
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Service Worker registration skipped in development');
      return null;
    }

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.warn('Service Worker registered successfully');
    emitter.emit('serviceWorkerRegistered', true);

    // Listen for service worker updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            emitter.emit('updateAvailable', true);
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

export function handleServiceWorkerMessage(
  event: MessageEvent,
  emitter: EventEmitter
): void {
  const { data } = event;

  switch (data.type) {
    case 'CACHE_SIZE':
      emitter.emit('cacheSize', data.size);
      break;

    case 'CACHE_CLEARED':
      emitter.emit('cacheCleared', true);
      break;

    case 'SYNC_COMPLETE':
      emitter.emit('syncComplete', data.type);
      break;
  }
}
