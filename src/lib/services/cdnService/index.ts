/**
 * CDN Service Module Exports
 */

// Export types
export type { CDNConfig, ImageUrlOptions, ResponsiveImageSet } from './types';

// Export main service
export { CDNService, cdnService } from './CDNService';

// Export utilities (for advanced usage)
export { loadConfig } from './configLoader';
export { relativizePath } from './utils';
export {
  generateCloudinaryUrl,
  generateImageKitUrl,
  generateCloudflareUrl,
  generateVercelUrl,
  generateLocalUrl,
  mapFitToCloudinary,
} from './urlGenerators';
export {
  generateResponsiveImageSet,
  generateProcessedImageUrls,
  generateDeviceOptimizedUrls,
  generatePreloadLinks,
} from './responsiveImages';
