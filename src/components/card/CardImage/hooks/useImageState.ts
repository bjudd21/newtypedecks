/**
 * Hook for managing image state
 */

import { useState } from 'react';

export function useImageState() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const openZoom = () => setShowZoom(true);
  const closeZoom = () => setShowZoom(false);

  return {
    isLoading,
    hasError,
    showZoom,
    handleImageLoad,
    handleImageError,
    openZoom,
    closeZoom,
  };
}
