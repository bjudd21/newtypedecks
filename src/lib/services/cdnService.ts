/**
 * CDN Service
 *
 * Handles CDN integration for optimized image serving and caching
 *
 * Re-exports from modularized structure for backward compatibility
 */

export type { CDNConfig, ImageUrlOptions, ResponsiveImageSet } from './cdnService/types';

export { CDNService, cdnService } from './cdnService/CDNService';
export { cdnService as default } from './cdnService/CDNService';
