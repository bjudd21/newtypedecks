/**
 * Network Fetcher
 */

export async function fetchFromNetwork(
  url: string,
  priority: 'high' | 'normal' | 'low'
): Promise<Blob> {
  const fetchOptions: RequestInit = {
    cache: 'default',
  };

  // Set priority if supported (experimental feature, requires type assertion)
  if ('priority' in Request.prototype) {
    (fetchOptions as Record<string, unknown>).priority = priority;
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`
    );
  }

  return response.blob();
}
