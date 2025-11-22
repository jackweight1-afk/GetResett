import { useEffect } from 'react';

// Preload critical resources for faster navigation
export function usePreloader() {
  useEffect(() => {
    // Preloading removed - not needed for current app structure
  }, []);
}

// Optimize critical resource hints in document head
export function ResourceHints() {
  useEffect(() => {
    // External domain prefetching removed - not needed
  }, []);

  return null;
}