"use client";

import { useState, useEffect, useCallback } from "react";

export interface LoadingState {
  isLoading: boolean;
  dataLoaded: boolean;
  imagesLoaded: boolean;
}

export function useGlobalLoader() {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    dataLoaded: false,
    imagesLoaded: false,
  });

  // Set minimum loading time (to prevent flash)
  const [minLoadingTime, setMinLoadingTime] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTime(true);
    }, 1000); // Minimum 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  // Update loading state based on data and images
  useEffect(() => {
    if (loadingState.dataLoaded && loadingState.imagesLoaded && minLoadingTime) {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
    }
  }, [loadingState.dataLoaded, loadingState.imagesLoaded, minLoadingTime]);

  // Mark data as loaded
  const setDataLoaded = useCallback(() => {
    setLoadingState(prev => ({ ...prev, dataLoaded: true }));
  }, []);

  // Mark images as loaded
  const setImagesLoaded = useCallback(() => {
    setLoadingState(prev => ({ ...prev, imagesLoaded: true }));
  }, []);

  // Reset loading state (useful for navigation)
  const resetLoading = useCallback(() => {
    setLoadingState({
      isLoading: true,
      dataLoaded: false,
      imagesLoaded: false,
    });
    setMinLoadingTime(false);
  }, []);

  // Helper to track image loading
  const trackImageLoading = useCallback((imageUrls: string[]) => {
    if (imageUrls.length === 0) {
      setImagesLoaded();
      return;
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded();
      }
    };

    imageUrls.forEach(url => {
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Still count as "loaded" to prevent hanging
      img.src = url;
    });
  }, [setImagesLoaded]);

  return {
    isLoading: loadingState.isLoading,
    dataLoaded: loadingState.dataLoaded,
    imagesLoaded: loadingState.imagesLoaded,
    setDataLoaded,
    setImagesLoaded,
    resetLoading,
    trackImageLoading,
  };
}

// Helper hook for simple loading (when you don't need to track images separately)
export function useSimpleLoader(initialLoading: boolean = true) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [minLoadingTime, setMinLoadingTime] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTime(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    if (!loading && minLoadingTime) {
      setIsLoading(false);
    } else if (loading) {
      setIsLoading(true);
    }
  }, [minLoadingTime]);

  return { isLoading, setLoading };
} 