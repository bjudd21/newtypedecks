/**
 * IndexedDB Operations for Offline Data
 */

import type { OfflineDeck, OfflineCollectionUpdate } from '../types';

export async function storeOfflineData(
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

export async function getOfflineData<T = OfflineDeck | OfflineCollectionUpdate>(
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

export async function removeOfflineData(
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
