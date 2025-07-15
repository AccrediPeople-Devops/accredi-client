"use client";

import { useState, useEffect, useCallback } from "react";
import { useContentPreloader, PreloadOptions } from "./useContentPreloader";

export interface EnhancedLoaderOptions extends PreloadOptions {
  minimumLoadTime?: number;
  dataLoadingPromise?: Promise<any>;
  enablePreloading?: boolean;
}

export function useEnhancedGlobalLoader(options: EnhancedLoaderOptions = {}) {
  const {
    minimumLoadTime = 1500,
    dataLoadingPromise,
    enablePreloading = true,
    ...preloadOptions
  } = options;

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isMinimumTimeMet, setIsMinimumTimeMet] = useState(false);
  const [dataError, setDataError] = useState<Error | null>(null);

  // Content preloader
  const {
    isPreloading,
    progress: preloadProgress,
    errors: preloadErrors,
  } = useContentPreloader(enablePreloading ? preloadOptions : {});

  // Minimum loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinimumTimeMet(true);
    }, minimumLoadTime);

    return () => clearTimeout(timer);
  }, [minimumLoadTime]);

  // Handle data loading promise
  useEffect(() => {
    if (dataLoadingPromise) {
      dataLoadingPromise
        .then(() => {
          setIsDataLoaded(true);
          setDataError(null);
        })
        .catch((error) => {
          setDataError(error);
          setIsDataLoaded(true); // Still mark as loaded even on error
        });
    } else {
      setIsDataLoaded(true);
    }
  }, [dataLoadingPromise]);

  // Calculate overall loading state
  const isContentReady = !isPreloading || !enablePreloading;
  const isDataReady = isDataLoaded;
  const isTimeReady = isMinimumTimeMet;
  
  const isLoading = !(isContentReady && isDataReady && isTimeReady);

  // Calculate combined progress
  const dataProgress = isDataLoaded ? 100 : 0;
  const timeProgress = isMinimumTimeMet ? 100 : 0;
  const combinedProgress = enablePreloading
    ? Math.round((dataProgress + preloadProgress + timeProgress) / 3)
    : Math.round((dataProgress + timeProgress) / 2);

  // Manual control functions
  const setDataLoaded = useCallback(() => {
    setIsDataLoaded(true);
  }, []);

  const setImagesLoaded = useCallback(() => {
    // This is handled by the content preloader
    // Keeping for backward compatibility
  }, []);

  const trackImageLoading = useCallback((imageUrls: string[]) => {
    // This functionality is now handled by the content preloader
    // Keeping for backward compatibility
  }, []);

  const resetLoading = useCallback(() => {
    setIsDataLoaded(false);
    setIsMinimumTimeMet(false);
    setDataError(null);
  }, []);

  return {
    isLoading,
    progress: combinedProgress,
    isDataLoaded,
    isContentReady,
    isMinimumTimeMet,
    preloadProgress,
    dataError,
    preloadErrors,
    setDataLoaded,
    setImagesLoaded, // Backward compatibility
    trackImageLoading, // Backward compatibility
    resetLoading,
  };
}

// Simplified hook for basic loading without preloading
export function useSimpleEnhancedLoader(
  initialLoading: boolean = true,
  minimumLoadTime: number = 1000
) {
  const [isDataLoaded, setIsDataLoaded] = useState(!initialLoading);
  const [isMinimumTimeMet, setIsMinimumTimeMet] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinimumTimeMet(true);
    }, minimumLoadTime);

    return () => clearTimeout(timer);
  }, [minimumLoadTime]);

  const isLoading = !(isDataLoaded && isMinimumTimeMet);

  const setLoading = useCallback((loading: boolean) => {
    setIsDataLoaded(!loading);
  }, []);

  const setDataLoaded = useCallback(() => {
    setIsDataLoaded(true);
  }, []);

  return {
    isLoading,
    isDataLoaded,
    isMinimumTimeMet,
    setLoading,
    setDataLoaded,
  };
} 