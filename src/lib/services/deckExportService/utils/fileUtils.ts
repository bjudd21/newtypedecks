/**
 * File Handling Utilities
 */

/**
 * Generate filename for export
 */
export function generateFilename(deckName: string, format: string): string {
  const sanitizedName = deckName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();

  const timestamp = new Date().toISOString().split('T')[0];
  const extension = getFileExtension(format);

  return `${sanitizedName}_${timestamp}.${extension}`;
}

/**
 * Get file extension for format
 */
export function getFileExtension(format: string): string {
  switch (format) {
    case 'json':
      return 'json';
    case 'text':
      return 'txt';
    case 'csv':
      return 'csv';
    case 'mtga':
      return 'txt';
    case 'cockatrice':
      return 'cod';
    default:
      return 'txt';
  }
}

/**
 * Get MIME type for format
 */
export function getMimeType(format: string): string {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'csv':
      return 'text/csv';
    case 'cockatrice':
      return 'application/xml';
    default:
      return 'text/plain';
  }
}

/**
 * Download file to user's computer
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
