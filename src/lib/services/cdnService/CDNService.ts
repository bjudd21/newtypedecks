/**
 * CDN Service Main Orchestrator
 * Coordinates all CDN operations using extracted modules
 */

import type { ProcessedImage } from '@/lib/storage/imageProcessing';
import type { CDNConfig, ImageUrlOptions, ResponsiveImageSet } from './types';
import { loadConfig } from './configLoader';
import {
  generateCloudinaryUrl,
  generateImageKitUrl,
  generateCloudflareUrl,
  generateVercelUrl,
  generateLocalUrl,
} from './urlGenerators';
import { relativizePath } from './utils';
import {
  generateResponsiveImageSet as createResponsiveImageSet,
  generateProcessedImageUrls as createProcessedImageUrls,
  generateDeviceOptimizedUrls as createDeviceOptimizedUrls,
  generatePreloadLinks as createPreloadLinks,
} from './responsiveImages';

export class CDNService {
  private static instance: CDNService;
  private config: CDNConfig;

  private constructor() {
    this.config = loadConfig();
  }

  public static getInstance(): CDNService {
    if (!CDNService.instance) {
      CDNService.instance = new CDNService();
    }
    return CDNService.instance;
  }

  /**
   * Generate optimized image URL
   */
  generateImageUrl(imagePath: string, options: ImageUrlOptions = {}): string {
    const {
      width,
      height,
      quality,
      format = 'auto',
      fit = 'cover',
      devicePixelRatio = 1,
      progressive = true,
    } = options;

    // Adjust dimensions for device pixel ratio
    const actualWidth = width ? width * devicePixelRatio : undefined;
    const actualHeight = height ? height * devicePixelRatio : undefined;

    const adjustedOptions: ImageUrlOptions = {
      width: actualWidth,
      height: actualHeight,
      quality,
      format,
      fit,
      progressive,
    };

    switch (this.config.provider) {
      case 'cloudinary':
        return generateCloudinaryUrl(imagePath, adjustedOptions, this.config);

      case 'imagekit':
        return generateImageKitUrl(imagePath, adjustedOptions, this.config);

      case 'cloudflare':
        return generateCloudflareUrl(imagePath, adjustedOptions, this.config);

      case 'vercel':
        return generateVercelUrl(imagePath, adjustedOptions, this.config);

      case 'local':
      default:
        return generateLocalUrl(imagePath, this.config);
    }
  }

  /**
   * Generate responsive image set with multiple formats and sizes
   */
  generateResponsiveImageSet(
    imagePath: string,
    sizes: { width: number; suffix?: string }[] = [
      { width: 320, suffix: 'sm' },
      { width: 640, suffix: 'md' },
      { width: 1024, suffix: 'lg' },
      { width: 1920, suffix: 'xl' },
    ]
  ): ResponsiveImageSet {
    return createResponsiveImageSet(
      imagePath,
      sizes,
      (path: string, options: { width?: number; format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png' }) =>
        this.generateImageUrl(path, options as ImageUrlOptions)
    );
  }

  /**
   * Generate URLs for processed image variants
   */
  generateProcessedImageUrls(processedImage: ProcessedImage): {
    original: ResponsiveImageSet;
    thumbnail: ResponsiveImageSet;
    large: ResponsiveImageSet;
  } {
    return createProcessedImageUrls(processedImage, (path: string) =>
      this.generateResponsiveImageSet(relativizePath(path))
    );
  }

  /**
   * Preload critical images
   */
  generatePreloadLinks(
    imagePaths: string[],
    options: ImageUrlOptions = {}
  ): string[] {
    return createPreloadLinks(
      imagePaths,
      (path: string, opts: object) => this.generateImageUrl(path, opts),
      options
    );
  }

  /**
   * Generate optimized image for different device types
   */
  generateDeviceOptimizedUrls(imagePath: string): {
    desktop: ResponsiveImageSet;
    tablet: ResponsiveImageSet;
    mobile: ResponsiveImageSet;
  } {
    return createDeviceOptimizedUrls(
      imagePath,
      (path: string, sizes: { width: number; suffix?: string }[]) =>
        this.generateResponsiveImageSet(path, sizes)
    );
  }
}

// Export singleton instance
export const cdnService = CDNService.getInstance();
