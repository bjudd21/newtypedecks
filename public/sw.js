// Service Worker for Newtype Decks (Gundam Card Game) PWA
const CACHE_NAME = 'gcg-database-v7-core';
const OFFLINE_URL = '/offline';

// Resources to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/cards',
  '/decks',
  '/collection',
  '/offline',
  '/manifest.json'
];

// Resources to cache dynamically
const DYNAMIC_CACHE_URLS = [
  '/api/cards',
  '/api/decks',
  '/api/collections'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static resources');
      return cache.addAll(STATIC_CACHE_URLS);
    }).then(() => {
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Serve cached page or offline fallback
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Serve offline page for navigation requests
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200 && request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Serve cached API response if available
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline response for API requests
              return new Response(
                JSON.stringify({
                  error: 'Offline',
                  message: 'This content is not available offline'
                }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Cache successful responses for static assets
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
      })
  );
});

// Background sync for offline deck saves
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);

  if (event.tag === 'sync-deck-saves') {
    event.waitUntil(syncOfflineDecks());
  }

  if (event.tag === 'sync-collection-updates') {
    event.waitUntil(syncCollectionUpdates());
  }
});

// Sync offline deck saves when back online
async function syncOfflineDecks() {
  try {
    const offlineDecks = await getOfflineData('pending-deck-saves');

    for (const deckData of offlineDecks) {
      try {
        const response = await fetch('/api/decks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(deckData)
        });

        if (response.ok) {
          console.log('[SW] Synced offline deck:', deckData.name);
          await removeOfflineData('pending-deck-saves', deckData.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync deck:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Sync collection updates when back online
async function syncCollectionUpdates() {
  try {
    const updates = await getOfflineData('pending-collection-updates');

    for (const updateData of updates) {
      try {
        const response = await fetch('/api/collections', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          console.log('[SW] Synced collection update:', updateData.cardId);
          await removeOfflineData('pending-collection-updates', updateData.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync collection update:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Collection sync failed:', error);
  }
}

// Utility functions for offline data management
async function getOfflineData(storeName) {
  return new Promise((resolve) => {
    const request = indexedDB.open('GCG-Offline', 1);

    request.onerror = () => resolve([]);

    request.onsuccess = (event) => {
      const db = event.target.result;

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
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
  });
}

async function removeOfflineData(storeName, id) {
  return new Promise((resolve) => {
    const request = indexedDB.open('GCG-Offline', 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      store.delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    };

    request.onerror = () => resolve();
  });
}

// Message handling for PWA features
self.addEventListener('message', (event) => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;

      case 'GET_CACHE_SIZE':
        getCacheSize().then((size) => {
          event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
        });
        break;

      case 'CLEAR_CACHE':
        clearAllCaches().then(() => {
          event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
        });
        break;
    }
  }
});

// Utility function to get cache size
async function getCacheSize() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  let totalSize = 0;

  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const blob = await response.blob();
      totalSize += blob.size;
    }
  }

  return totalSize;
}

// Utility function to clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}