/**
 * CardImage types
 */

export interface CardImageProps {
  /** Card name for alt text */
  name: string;
  /** High-resolution image URL */
  imageUrl?: string;
  /** Small/thumbnail image URL */
  imageUrlSmall?: string;
  /** Large image URL */
  imageUrlLarge?: string;
  /** Image size variant */
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'fullsize';
  /** Additional CSS classes */
  className?: string;
  /** Enable click to zoom functionality */
  clickToZoom?: boolean;
  /** Callback when image is clicked */
  onClick?: () => void;
  /** Show loading placeholder */
  showPlaceholder?: boolean;
  /** Custom placeholder content */
  placeholder?: React.ReactNode;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
  /** Show Bandai Namco attribution overlay */
  showAttribution?: boolean;
}

export interface SizeConfig {
  width: number;
  height: number;
  className: string;
}

export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'fullsize';
