/**
 * CardImage constants
 */

import type { SizeConfig, ImageSize } from './types';

export const SIZE_CONFIGS: Record<ImageSize, SizeConfig> = {
  thumbnail: { width: 64, height: 80, className: 'w-16 h-20' },
  small: { width: 120, height: 150, className: 'w-30 h-[150px]' },
  medium: { width: 200, height: 250, className: 'w-50 h-[250px]' },
  large: { width: 300, height: 375, className: 'w-75 h-[375px]' },
  fullsize: { width: 400, height: 500, className: 'w-100 h-[500px]' },
};
