/**
 * Service Worker Management
 */

export async function updateServiceWorker(
  registration: ServiceWorkerRegistration | null
): Promise<void> {
  if (registration && registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
}

export async function unregisterServiceWorker(
  registration: ServiceWorkerRegistration | null
): Promise<boolean> {
  if (registration) {
    return await registration.unregister();
  }
  return false;
}
