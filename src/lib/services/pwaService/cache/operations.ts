/**
 * Cache Operations
 */

export async function getCacheSize(
  registration: ServiceWorkerRegistration | null
): Promise<number> {
  return new Promise((resolve) => {
    if (!registration || !navigator.serviceWorker.controller) {
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

export async function clearCache(
  registration: ServiceWorkerRegistration | null
): Promise<void> {
  return new Promise((resolve) => {
    if (!registration || !navigator.serviceWorker.controller) {
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
