// Service Worker for Advanced Image Caching
// This service worker handles image requests and provides aggressive caching for performance

const CACHE_NAME = 'gcg-images-v1';
const IMAGE_CACHE_NAME = 'gcg-image-cache-v1';
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Image file extensions to cache
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];

// URLs that should be cached
const IMAGE_URL_PATTERNS = [
  /\/api\/uploads\//,
  /\/images\//,
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
];

self.addEventListener('install', (_event) => {
  console.log('Image cache service worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Image cache service worker activated');
  event.waitUntil(
    Promise.all([
      // Clear old caches
      cleanupOldCaches(),
      // Take control of all clients
      self.clients.claim(),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle image requests
  if (!isImageRequest(request)) {
    return;
  }

  event.respondWith(handleImageRequest(request));
});

// Handle image requests with caching strategy
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);

  try {
    // Try to get from cache first (cache-first strategy for images)
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Check if cached response is still valid
      const cacheDate = new Date(cachedResponse.headers.get('sw-cached-date') || 0);
      const isExpired = Date.now() - cacheDate.getTime() > MAX_CACHE_AGE;

      if (!isExpired) {
        console.log('Serving image from cache:', request.url);
        return cachedResponse;
      } else {
        // Remove expired cache entry
        await cache.delete(request);
      }
    }

    // Fetch from network
    console.log('Fetching image from network:', request.url);
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      await cacheImageResponse(cache, request, networkResponse.clone());
    }

    return networkResponse;

  } catch (error) {
    console.error('Error handling image request:', error);

    // Try to serve from cache as fallback
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return placeholder or error response
    return createPlaceholderResponse();
  }
}

// Cache image response with metadata
async function cacheImageResponse(cache, request, response) {
  try {
    // Check cache size before adding
    const cacheSize = await getCurrentCacheSize();
    if (cacheSize > MAX_CACHE_SIZE) {
      await evictLRUEntries();
    }

    // Clone response and add cache metadata
    const responseClone = response.clone();
    const newHeaders = new Headers(responseClone.headers);
    newHeaders.set('sw-cached-date', new Date().toISOString());

    const cachedResponse = new Response(responseClone.body, {
      status: responseClone.status,
      statusText: responseClone.statusText,
      headers: newHeaders,
    });

    await cache.put(request, cachedResponse);
    console.log('Cached image:', request.url);

  } catch (error) {
    console.error('Error caching image:', error);
  }
}

// Check if request is for an image
function isImageRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();

  // Check file extension
  const hasImageExtension = IMAGE_EXTENSIONS.some(ext =>
    pathname.endsWith(ext)
  );

  // Check URL patterns
  const matchesPattern = IMAGE_URL_PATTERNS.some(pattern =>
    pattern.test(request.url)
  );

  // Check content type header for fetch requests
  const acceptHeader = request.headers.get('accept') || '';
  const acceptsImages = acceptHeader.includes('image/');

  return hasImageExtension || matchesPattern || acceptsImages;
}

// Get current cache size
async function getCurrentCacheSize() {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const requests = await cache.keys();
    let totalSize = 0;

    for (const request of requests) {
      try {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      } catch (_error) {
        console.warn('Error calculating cache size for:', request.url);
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Error getting cache size:', error);
    return 0;
  }
}

// Evict least recently used entries
async function evictLRUEntries() {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const requests = await cache.keys();
    const entries = [];

    // Get cache dates for sorting
    for (const request of requests) {
      try {
        const response = await cache.match(request);
        if (response) {
          const cacheDate = new Date(response.headers.get('sw-cached-date') || 0);
          entries.push({ request, cacheDate });
        }
      } catch (_error) {
        console.warn('Error reading cache entry:', request.url);
      }
    }

    // Sort by cache date (oldest first)
    entries.sort((a, b) => a.cacheDate.getTime() - b.cacheDate.getTime());

    // Remove oldest 25% of entries
    const entriesToRemove = Math.floor(entries.length * 0.25);

    for (let i = 0; i < entriesToRemove; i++) {
      await cache.delete(entries[i].request);
      console.log('Evicted cached image:', entries[i].request.url);
    }

  } catch (error) {
    console.error('Error evicting cache entries:', error);
  }
}

// Clean up old caches
async function cleanupOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name =>
      name.startsWith('gcg-') && name !== CACHE_NAME && name !== IMAGE_CACHE_NAME
    );

    await Promise.all(
      oldCaches.map(cacheName => {
        console.log('Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      })
    );

  } catch (error) {
    console.error('Error cleaning up old caches:', error);
  }
}

// Create placeholder response for failed requests
function createPlaceholderResponse() {
  // Create a simple SVG placeholder
  const svgContent = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="system-ui">
        Image unavailable
      </text>
    </svg>
  `;

  return new Response(svgContent, {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache',
    },
  });
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'CACHE_IMAGE':
      cacheImage(data.url);
      break;

    case 'CLEAR_CACHE':
      clearImageCache();
      break;

    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
      });
      break;

    default:
      console.warn('Unknown message type:', type);
  }
});

// Proactively cache an image
async function cacheImage(url) {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const response = await fetch(url);

    if (response.ok) {
      await cacheImageResponse(cache, new Request(url), response);
    }
  } catch (error) {
    console.error('Error preemptively caching image:', error);
  }
}

// Clear all cached images
async function clearImageCache() {
  try {
    await caches.delete(IMAGE_CACHE_NAME);
    console.log('Image cache cleared');
  } catch (error) {
    console.error('Error clearing image cache:', error);
  }
}

// Get cache size and stats
async function getCacheSize() {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const requests = await cache.keys();

    return {
      size: await getCurrentCacheSize(),
      itemCount: requests.length,
      maxSize: MAX_CACHE_SIZE,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { size: 0, itemCount: 0, maxSize: MAX_CACHE_SIZE };
  }
}