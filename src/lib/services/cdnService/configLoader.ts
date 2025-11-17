/**
 * CDN Config Loader
 * Handles loading CDN configuration from environment
 */

import { env } from '@/lib/config/environment';
import type { CDNConfig } from './types';

/**
 * Load CDN configuration from environment
 */
export function loadConfig(): CDNConfig {
  const provider = (env.CDN_PROVIDER as CDNConfig['provider']) || 'local';

  return {
    provider,
    baseUrl:
      env.CDN_BASE_URL ||
      (env.NODE_ENV === 'production'
        ? 'https://cdn.yourdomain.com'
        : `${env.NEXT_PUBLIC_APP_URL}/api/uploads`),
    apiKey: env.CDN_API_KEY,
    apiSecret: env.CDN_API_SECRET,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    transformationOptions: {
      quality: 'auto',
      format: 'auto',
      progressive: true,
      optimization: true,
    },
  };
}
