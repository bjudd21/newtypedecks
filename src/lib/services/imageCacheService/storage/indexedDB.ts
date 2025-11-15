/**
 * IndexedDB Cache Operations
 */

import type { CachedImage, CacheConfig } from '../types';

export class IndexedDBCache {
  private dbName = 'gundam-card-images';
  private dbVersion = 1;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('images')) {
          const store = db.createObjectStore('images', { keyPath: 'url' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('size', 'size', { unique: false });
        }
      };
    });
  }

  async get(url: string, config: CacheConfig): Promise<CachedImage | null> {
    if (!config.enableIndexedDB) return null;

    try {
      const db = await this.open();
      const transaction = db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');

      return new Promise((resolve, reject) => {
        const request = store.get(url);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = request.result;
          if (!result) {
            resolve(null);
            return;
          }

          // Check if expired
          if (Date.now() - result.timestamp > config.maxAge) {
            // Delete expired item
            const deleteTransaction = db.transaction(['images'], 'readwrite');
            const deleteStore = deleteTransaction.objectStore('images');
            deleteStore.delete(url);
            resolve(null);
            return;
          }

          resolve(result);
        };
      });
    } catch (error) {
      console.warn('Failed to get from IndexedDB:', error);
      return null;
    }
  }

  async set(image: CachedImage): Promise<void> {
    try {
      const db = await this.open();
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      store.put(image);
    } catch (error) {
      console.warn('Failed to store in IndexedDB:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.open();
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      store.clear();
    } catch (error) {
      console.warn('Failed to clear IndexedDB:', error);
    }
  }

  async cleanupExpired(maxAge: number): Promise<void> {
    try {
      const db = await this.open();
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      const index = store.index('timestamp');

      const cutoff = Date.now() - maxAge;
      const range = IDBKeyRange.upperBound(cutoff);

      index.openCursor(range).onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    } catch (error) {
      console.warn('Failed to cleanup IndexedDB:', error);
    }
  }

  private async open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}
