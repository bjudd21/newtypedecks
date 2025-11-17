/**
 * Type definitions for CDN service
 */

export interface CDNConfig {
  provider:
    | 'cloudinary'
    | 'imagekit'
    | 'cloudflare'
    | 'aws'
    | 'vercel'
    | 'local';
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
