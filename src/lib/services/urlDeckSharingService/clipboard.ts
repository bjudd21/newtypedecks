/**
 * Clipboard operations for URL sharing
 */

/**
 * Copy URL to clipboard
 */
export async function copyToClipboard(url: string): Promise<void> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
    } else {
      // Fallback for older browsers or non-HTTPS
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.prepend(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
  } catch (error) {
    console.error('Failed to copy URL to clipboard:', error);
    throw new Error('Failed to copy URL. Please copy it manually.');
  }
}
