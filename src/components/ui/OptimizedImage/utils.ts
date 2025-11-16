/**
 * Utility functions for OptimizedImage
 */

// Generate sizes attribute for responsive images
export const generateSizesAttribute = (
  enableResponsive: boolean,
  width: number
): string => {
  if (!enableResponsive) {
    return `${width}px`;
  }

  // Default responsive sizes - can be customized
  return `
    (max-width: 320px) 320px,
    (max-width: 640px) 640px,
    (max-width: 1024px) 1024px,
    ${width}px
  `
    .trim()
    .replace(/\s+/g, ' ');
};

// Get dimensions for CardImage based on variant and aspect ratio
export const getCardImageDimensions = (
  variant: 'thumbnail' | 'card' | 'large' | 'hero',
  aspectRatio: 'card' | 'square' | 'wide'
): { width: number; height: number } => {
  const aspectRatios = {
    card: { width: 300, height: 420 }, // Standard card ratio
    square: { width: 300, height: 300 },
    wide: { width: 400, height: 225 }, // 16:9
  };

  const variants = {
    thumbnail: 0.4,
    card: 1,
    large: 1.5,
    hero: 2,
  };

  const base = aspectRatios[aspectRatio];
  const scale = variants[variant];

  return {
    width: Math.round(base.width * scale),
    height: Math.round(base.height * scale),
  };
};

// Get dimensions for AvatarImage based on size
export const getAvatarImageDimensions = (
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
): number => {
  const sizes = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  return sizes[size];
};
