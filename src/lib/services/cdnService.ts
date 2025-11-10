/**
 * CDN Service
 *
 * Handles CDN integration for optimized image serving and caching
 */

import { env } from '@/lib/config/environment';
import type { ProcessedImage } from '@/lib/storage/imageProcessing';

export interface CDNConfig {
  provider: 'cloudinary' | 'imagekit' | 'cloudflare' | 'aws' | 'vercel' | 'local';
  baseUrl: string;
  apiKey?: string;
  apiSecret?: string;
  cloudName?: string; // For Cloudinary
  transformationOptions?: {
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
    progressive?: boolean;
    optimization?: boolean;
  };
}

export interface ImageUrlOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  devicePixelRatio?: 1 | 2 | 3;
  progressive?: boolean;
}

export interface ResponsiveImageSet {
  src: string;
  srcSet: string;
  sizes: string;
  formats: {
    webp?: string;
    avif?: string;
    jpeg?: string;
    png?: string;
  };
}

export class CDNService {
  private static instance: CDNService;
  private config: CDNConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): CDNService {
    if (!CDNService.instance) {
      CDNService.instance = new CDNService();
    }
    return CDNService.instance;
  }

  /**
   * Load CDN configuration from environment
   */
  private loadConfig(): CDNConfig {
    const provider = (env.CDN_PROVIDER as CDNConfig['provider']) || 'local';

    return {
      provider,
      baseUrl: env.CDN_BASE_URL || (env.NODE_ENV === 'production'
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

    switch (this.config.provider) {
      case 'cloudinary':
        return this.generateCloudinaryUrl(imagePath, {
          width: actualWidth,
          height: actualHeight,
          quality,
          format,
          fit,
          progressive,
        });

      case 'imagekit':
        return this.generateImageKitUrl(imagePath, {
          width: actualWidth,
          height: actualHeight,
          quality,
          format,
          fit,
          progressive,
        });

      case 'cloudflare':
        return this.generateCloudflareUrl(imagePath, {
          width: actualWidth,
          height: actualHeight,
          quality,
          format,
          fit,
        });

      case 'vercel':
        return this.generateVercelUrl(imagePath, {
          width: actualWidth,
          height: actualHeight,
          quality,
          format,
        });

      case 'local':
      default:
        return this.generateLocalUrl(imagePath);
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
    // Generate srcSet for different sizes
    const srcSet = sizes
      .map(size => {
        const url = this.generateImageUrl(imagePath, { width: size.width });
        return `${url} ${size.width}w`;
      })
      .join(', ');

    // Generate different format URLs
    const formats = {
      webp: this.generateImageUrl(imagePath, { format: 'webp' }),
      avif: this.generateImageUrl(imagePath, { format: 'avif' }),
      jpeg: this.generateImageUrl(imagePath, { format: 'jpeg' }),
    };

    // Default sizes attribute (can be customized)
    const sizesAttr = `
      (max-width: 320px) 320px,
      (max-width: 640px) 640px,
      (max-width: 1024px) 1024px,
      1920px
    `.trim().replace(/\s+/g, ' ');

    return {
      src: this.generateImageUrl(imagePath),
      srcSet,
      sizes: sizesAttr,
      formats,
    };
  }

  /**
   * Generate URLs for processed image variants
   */
  generateProcessedImageUrls(processedImage: ProcessedImage): {
    original: ResponsiveImageSet;
    thumbnail: ResponsiveImageSet;
    large: ResponsiveImageSet;
  } {
    return {
      original: this.generateResponsiveImageSet(this.relativizePath(processedImage.original.path)),
      thumbnail: this.generateResponsiveImageSet(this.relativizePath(processedImage.thumbnail.path)),
      large: this.generateResponsiveImageSet(this.relativizePath(processedImage.large.path)),
    };
  }

  /**
   * Generate Cloudinary URL
   */
  private generateCloudinaryUrl(imagePath: string, options: ImageUrlOptions): string {
    const { width, height, quality, format, fit, progressive } = options;

    const transformations: string[] = [];

    if (width || height) {
      const crop = this.mapFitToCloudinary(fit);
      transformations.push(`c_${crop}`);
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
    }

    if (quality) {
      const qualityValue = typeof quality === 'string' && quality === 'auto' ? 'auto:good' : quality;
      transformations.push(`q_${qualityValue}`);
    }

    if (format && format !== 'auto') {
      transformations.push(`f_${format}`);
    } else {
      transformations.push('f_auto');
    }

    if (progressive) {
      transformations.push('fl_progressive');
    }

    const transformationString = transformations.length > 0
      ? `/${transformations.join(',')}`
      : '';

    return `${this.config.baseUrl}/image/upload${transformationString}/${imagePath}`;
  }

  /**
   * Generate ImageKit URL
   */
  private generateImageKitUrl(imagePath: string, options: ImageUrlOptions): string {
    const { width, height, quality, format, fit } = options;

    const params = new URLSearchParams();

    if (width) params.set('tr', `w-${width}`);
    if (height) params.set('tr', `${params.get('tr') || ''},h-${height}`);
    if (quality) params.set('tr', `${params.get('tr') || ''},q-${quality}`);
    if (format && format !== 'auto') params.set('tr', `${params.get('tr') || ''},f-${format}`);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return `${this.config.baseUrl}/${imagePath}${queryString}`;
  }

  /**
   * Generate Cloudflare Images URL
   */
  private generateCloudflareUrl(imagePath: string, options: ImageUrlOptions): string {
    const { width, height, quality, format, fit } = options;

    const params = new URLSearchParams();

    if (width) params.set('width', width.toString());
    if (height) params.set('height', height.toString());
    if (quality) params.set('quality', quality.toString());
    if (format && format !== 'auto') params.set('format', format);
    if (fit) params.set('fit', fit);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return `${this.config.baseUrl}/${imagePath}${queryString}`;
  }

  /**
   * Generate Vercel Image Optimization URL
   */
  private generateVercelUrl(imagePath: string, options: ImageUrlOptions): string {
    const { width, quality } = options;

    const params = new URLSearchParams();
    params.set('url', imagePath);

    if (width) params.set('w', width.toString());
    if (quality) params.set('q', quality.toString());

    return `${this.config.baseUrl}/_next/image?${params.toString()}`;
  }

  /**
   * Generate local URL (for development)
   */
  private generateLocalUrl(imagePath: string): string {
    return `${this.config.baseUrl}/${imagePath}`;
  }

  /**
   * Map fit options to Cloudinary crop modes
   */
  private mapFitToCloudinary(fit?: string): string {
    switch (fit) {
      case 'cover': return 'fill';
      case 'contain': return 'fit';
      case 'fill': return 'scale';
      case 'inside': return 'fit';
      case 'outside': return 'fill';
      default: return 'fill';
    }
  }

  /**
   * Convert absolute path to relative path for URL generation
   */
  private relativizePath(absolutePath: string): string {
    // Remove the uploads directory prefix for URL generation
    const uploadsPrefix = /.*\/uploads\//;
    return absolutePath.replace(uploadsPrefix, '');
  }

  /**
   * Preload critical images
   */
  generatePreloadLinks(imagePaths: string[], options: ImageUrlOptions = {}): string[] {
    return imagePaths.map(imagePath => {
      const url = this.generateImageUrl(imagePath, options);
      return `<link rel="preload" as="image" href="${url}">`;
    });
  }

  /**
   * Generate optimized image for different device types
   */
  generateDeviceOptimizedUrls(imagePath: string): {
    desktop: ResponsiveImageSet;
    tablet: ResponsiveImageSet;
    mobile: ResponsiveImageSet;
  } {
    return {
      desktop: this.generateResponsiveImageSet(imagePath, [
        { width: 1920, suffix: 'xl' },
        { width: 1440, suffix: 'lg' },
        { width: 1024, suffix: 'md' },
      ]),
      tablet: this.generateResponsiveImageSet(imagePath, [
        { width: 1024, suffix: 'lg' },
        { width: 768, suffix: 'md' },
        { width: 640, suffix: 'sm' },
      ]),
      mobile: this.generateResponsiveImageSet(imagePath, [
        { width: 640, suffix: 'md' },
        { width: 480, suffix: 'sm' },
        { width: 320, suffix: 'xs' },
      ]),
    };
  }
}