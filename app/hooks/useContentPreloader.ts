"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface PreloadResource {
  type: 'image' | 'font' | 'script' | 'stylesheet' | 'video' | 'audio';
  url: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  priority?: 'high' | 'medium' | 'low';
  critical?: boolean;
  size?: number;
}

export interface PreloadOptions {
  critical?: PreloadResource[];
  images?: string[];
  fonts?: string[];
  stylesheets?: string[];
  scripts?: string[];
  videos?: string[];
  audios?: string[];
  timeout?: number;
  maxConcurrent?: number;
  viewportPreload?: boolean;
  preloadDistance?: number;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onResourceLoad?: (resource: PreloadResource) => void;
}

export function useContentPreloader(options: PreloadOptions = {}) {
  const {
    critical = [],
    images = [],
    fonts = [],
    stylesheets = [],
    scripts = [],
    videos = [],
    audios = [],
    timeout = 15000,
    maxConcurrent = 8,
    viewportPreload = true,
    preloadDistance = 1000,
    onProgress,
    onComplete,
    onError,
    onResourceLoad
  } = options;

  const [isPreloading, setIsPreloading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set());
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const queueRef = useRef<PreloadResource[]>([]);
  const loadingRef = useRef<Set<string>>(new Set());
  const viewportObserverRef = useRef<IntersectionObserver | undefined>(undefined);

  // Combine all resources with priorities
  const allResources: PreloadResource[] = [
    ...critical,
    ...images.map(url => ({ type: 'image' as const, url, priority: 'high' as const, critical: true })),
    ...fonts.map(url => ({ type: 'font' as const, url, priority: 'high' as const, critical: true })),
    ...stylesheets.map(url => ({ type: 'stylesheet' as const, url, priority: 'medium' as const })),
    ...scripts.map(url => ({ type: 'script' as const, url, priority: 'low' as const })),
    ...videos.map(url => ({ type: 'video' as const, url, priority: 'low' as const })),
    ...audios.map(url => ({ type: 'audio' as const, url, priority: 'low' as const })),
  ];

  // Sort resources by priority
  const sortedResources = allResources.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
  });

  // Enhanced preload function with better error handling
  const preloadResource = useCallback(async (resource: PreloadResource): Promise<void> => {
    if (loadedResources.has(resource.url) || loadingRef.current.has(resource.url)) {
      return;
    }

    loadingRef.current.add(resource.url);

    return new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        loadingRef.current.delete(resource.url);
      };

      const handleSuccess = () => {
        setLoadedResources(prev => new Set([...prev, resource.url]));
        setLoadedCount(prev => prev + 1);
        onResourceLoad?.(resource);
        cleanup();
        resolve();
      };

      const handleError = (error: string) => {
        setErrors(prev => [...prev, error]);
        cleanup();
        reject(new Error(error));
      };

      try {
        switch (resource.type) {
          case 'image': {
            const img = new Image();
            img.onload = handleSuccess;
            img.onerror = () => handleError(`Failed to load image: ${resource.url}`);
            if (resource.crossorigin) {
              img.crossOrigin = resource.crossorigin;
            }
            img.src = resource.url;
            break;
          }
          
          case 'font': {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.href = resource.url;
            if (resource.crossorigin) {
              link.crossOrigin = resource.crossorigin;
            }
            link.onload = handleSuccess;
            link.onerror = () => handleError(`Failed to load font: ${resource.url}`);
            document.head.appendChild(link);
            break;
          }
          
          case 'stylesheet': {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource.url;
            link.onload = handleSuccess;
            link.onerror = () => handleError(`Failed to load stylesheet: ${resource.url}`);
            document.head.appendChild(link);
            break;
          }
          
          case 'script': {
            const script = document.createElement('script');
            script.src = resource.url;
            script.onload = handleSuccess;
            script.onerror = () => handleError(`Failed to load script: ${resource.url}`);
            document.head.appendChild(script);
            break;
          }
          
          case 'video': {
            const video = document.createElement('video');
            video.onloadeddata = handleSuccess;
            video.onerror = () => handleError(`Failed to load video: ${resource.url}`);
            video.preload = 'metadata';
            video.src = resource.url;
            break;
          }
          
          case 'audio': {
            const audio = new Audio();
            audio.onloadeddata = handleSuccess;
            audio.onerror = () => handleError(`Failed to load audio: ${resource.url}`);
            audio.preload = 'metadata';
            audio.src = resource.url;
            break;
          }
          
          default:
            handleError(`Unsupported resource type: ${resource.type}`);
        }
      } catch (error) {
        handleError(`Unexpected error loading ${resource.url}: ${error}`);
      }
    });
  }, [loadedResources, onResourceLoad]);

  // Enhanced concurrent loading with queue management
  const loadResourcesConcurrently = useCallback(async (resources: PreloadResource[]) => {
    const criticalResources = resources.filter(r => r.critical);
    const nonCriticalResources = resources.filter(r => !r.critical);
    
    // Load critical resources first
    if (criticalResources.length > 0) {
      const criticalPromises = criticalResources.map(resource => 
        preloadResource(resource).catch(error => {
          console.warn(`Critical resource failed to load: ${resource.url}`, error);
        })
      );
      await Promise.allSettled(criticalPromises);
    }
    
    // Load non-critical resources with concurrency control
    const loadBatch = async (batch: PreloadResource[]) => {
      const promises = batch.map(resource => 
        preloadResource(resource).catch(error => {
          console.warn(`Resource failed to load: ${resource.url}`, error);
        })
      );
      await Promise.allSettled(promises);
    };
    
    // Process in batches
    for (let i = 0; i < nonCriticalResources.length; i += maxConcurrent) {
      const batch = nonCriticalResources.slice(i, i + maxConcurrent);
      await loadBatch(batch);
    }
  }, [preloadResource, maxConcurrent]);

  // Viewport-based resource discovery
  const discoverViewportResources = useCallback(() => {
    const discoveredResources: PreloadResource[] = [];
    
    // Discover images
    const images = document.querySelectorAll('img, [data-src], [data-bg], [style*="background-image"]');
    images.forEach(img => {
      const src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-bg');
      if (src && !loadedResources.has(src)) {
        discoveredResources.push({ type: 'image', url: src, priority: 'medium' });
      }
      
      // Check for background images in style
      const style = img.getAttribute('style');
      if (style && style.includes('background-image')) {
        const matches = style.match(/url\(['"]?([^'")]+)['"]?\)/g);
        matches?.forEach(match => {
          const url = match.replace(/url\(['"]?([^'")]+)['"]?\)/, '$1');
          if (!loadedResources.has(url)) {
            discoveredResources.push({ type: 'image', url, priority: 'medium' });
          }
        });
      }
    });
    
    // Discover fonts
    const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
    fontLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !loadedResources.has(href)) {
        discoveredResources.push({ type: 'font', url: href, priority: 'high' });
      }
    });
    
    return discoveredResources;
  }, [loadedResources]);

  // Setup viewport observer for lazy loading
  const setupViewportObserver = useCallback(() => {
    if (!viewportPreload) return;
    
    viewportObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const src = element.getAttribute('data-src') || element.getAttribute('data-bg');
            
            if (src && !loadedResources.has(src)) {
              preloadResource({ type: 'image', url: src, priority: 'high' })
                .catch(error => console.warn(`Viewport preload failed: ${src}`, error));
            }
          }
        });
      },
      {
        rootMargin: `${preloadDistance}px`,
        threshold: 0.01
      }
    );
    
    // Observe elements with data-src or data-bg attributes
    const lazyElements = document.querySelectorAll('[data-src], [data-bg]');
    lazyElements.forEach(el => viewportObserverRef.current?.observe(el));
  }, [viewportPreload, preloadDistance, loadedResources, preloadResource]);

  // Main preloading effect
  useEffect(() => {
    if (sortedResources.length === 0) {
      setIsPreloading(false);
      onComplete?.();
      return;
    }

    setTotalCount(sortedResources.length);
    
    // Setup abort controller
    abortControllerRef.current = new AbortController();
    
    // Setup timeout
    timeoutRef.current = setTimeout(() => {
      setIsPreloading(false);
      onError?.(new Error('Preload timeout'));
      onComplete?.();
    }, timeout);

    // Setup viewport observer
    setupViewportObserver();
    
    // Discover additional resources
    const discoveredResources = discoverViewportResources();
    const allResourcesToLoad = [...sortedResources, ...discoveredResources];
    
    // Start loading
    loadResourcesConcurrently(allResourcesToLoad).finally(() => {
      setIsPreloading(false);
      onComplete?.();
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (viewportObserverRef.current) {
        viewportObserverRef.current.disconnect();
      }
    };
  }, [sortedResources, timeout, onComplete, onError, loadResourcesConcurrently, discoverViewportResources, setupViewportObserver]);

  // Update progress
  useEffect(() => {
    if (totalCount > 0) {
      const newProgress = Math.round((loadedCount / totalCount) * 100);
      setProgress(newProgress);
      onProgress?.(newProgress);
    }
  }, [loadedCount, totalCount, onProgress]);

  return {
    isPreloading,
    progress,
    loadedCount,
    totalCount,
    errors,
    loadedResources,
    // Utility functions
    preloadResource,
    discoverViewportResources,
  };
}

// Enhanced resource discovery utilities
export function extractAllPageResources(): {
  images: string[];
  fonts: string[];
  stylesheets: string[];
  scripts: string[];
  videos: string[];
  audios: string[];
} {
  const resources = {
    images: [] as string[],
    fonts: [] as string[],
    stylesheets: [] as string[],
    scripts: [] as string[],
    videos: [] as string[],
    audios: [] as string[]
  };

  // Images
  document.querySelectorAll('img, [data-src], [data-bg]').forEach(el => {
    const src = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('data-bg');
    if (src) resources.images.push(src);
  });

  // Background images from CSS
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    const bgImage = style.backgroundImage;
    if (bgImage && bgImage !== 'none') {
      const matches = bgImage.match(/url\(['"]?([^'")]+)['"]?\)/g);
      matches?.forEach(match => {
        const url = match.replace(/url\(['"]?([^'")]+)['"]?\)/, '$1');
        resources.images.push(url);
      });
    }
  });

  // Fonts
  document.querySelectorAll('link[rel="preload"][as="font"]').forEach(link => {
    const href = link.getAttribute('href');
    if (href) resources.fonts.push(href);
  });

  // Stylesheets
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.getAttribute('href');
    if (href) resources.stylesheets.push(href);
  });

  // Scripts
  document.querySelectorAll('script[src]').forEach(script => {
    const src = script.getAttribute('src');
    if (src) resources.scripts.push(src);
  });

  // Videos
  document.querySelectorAll('video source, video[src]').forEach(el => {
    const src = el.getAttribute('src');
    if (src) resources.videos.push(src);
  });

  // Audio
  document.querySelectorAll('audio source, audio[src]').forEach(el => {
    const src = el.getAttribute('src');
    if (src) resources.audios.push(src);
  });

  return resources;
}

// Smart preloading based on user behavior
export function useSmartPreloader(options: {
  hoverPreload?: boolean;
  scrollPreload?: boolean;
  clickPreload?: boolean;
  preloadDistance?: number;
} = {}) {
  const {
    hoverPreload = true,
    scrollPreload = true,
    clickPreload = true,
    preloadDistance = 800
  } = options;

  const [preloadedUrls, setPreloadedUrls] = useState<Set<string>>(new Set());

  const preloadUrl = useCallback((url: string) => {
    if (preloadedUrls.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
    
    setPreloadedUrls(prev => new Set([...prev, url]));
  }, [preloadedUrls]);

  useEffect(() => {
    if (hoverPreload) {
      const handleMouseEnter = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const href = target.getAttribute('href');
        if (href) {
          preloadUrl(href);
        }
      };
      
      document.addEventListener('mouseenter', handleMouseEnter, true);
      return () => document.removeEventListener('mouseenter', handleMouseEnter, true);
    }
  }, [hoverPreload, preloadUrl]);

  useEffect(() => {
    if (scrollPreload) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              const href = target.getAttribute('href');
              if (href) {
                preloadUrl(href);
              }
            }
          });
        },
        { rootMargin: `${preloadDistance}px` }
      );
      
      document.querySelectorAll('a[href]').forEach(link => {
        observer.observe(link);
      });
      
      return () => observer.disconnect();
    }
  }, [scrollPreload, preloadDistance, preloadUrl]);

  return { preloadedUrls };
} 