import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  maxSize?: number;
  ttl?: number; // Time to live in ms
}

interface CachedItem {
  data: any;
  timestamp: number;
  size: number;
}

class ContentCache {
  private cache = new Map<string, CachedItem>();
  private maxSize: number;
  private ttl: number;
  private currentSize = 0;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 50 * 1024 * 1024; // 50MB default
    this.ttl = options.ttl || 30 * 60 * 1000; // 30 minutes default
  }

  private isExpired(item: CachedItem): boolean {
    return Date.now() - item.timestamp > this.ttl;
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.currentSize -= item.size;
        this.cache.delete(key);
      }
    }
  }

  private evictLRU(): void {
    if (this.cache.size === 0) return;
    
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      const item = this.cache.get(oldestKey);
      if (item) {
        this.currentSize -= item.size;
        this.cache.delete(oldestKey);
      }
    }
  }

  set(key: string, data: any, size: number = 0): void {
    this.evictExpired();
    
    // Estimate size if not provided
    if (size === 0) {
      size = JSON.stringify(data).length * 2; // Rough estimate
    }
    
    // Evict until we have space
    while (this.currentSize + size > this.maxSize && this.cache.size > 0) {
      this.evictLRU();
    }
    
    // Don't cache if item is too large
    if (size > this.maxSize) {
      return;
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      size
    });
    
    this.currentSize += size;
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (this.isExpired(item)) {
      this.currentSize -= item.size;
      this.cache.delete(key);
      return null;
    }
    
    // Update timestamp for LRU
    item.timestamp = Date.now();
    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (this.isExpired(item)) {
      this.currentSize -= item.size;
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      currentSize: this.currentSize,
      maxSize: this.maxSize
    };
  }
}

// Global cache instance
const globalCache = new ContentCache({
  maxSize: 100 * 1024 * 1024, // 100MB
  ttl: 60 * 60 * 1000 // 1 hour
});

export const useContentCache = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [preloadedResources, setPreloadedResources] = useState<Set<string>>(new Set());

  const preloadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (globalCache.has(src)) {
        const cachedImage = globalCache.get(src);
        resolve(cachedImage);
        return;
      }

      const img = new Image();
      img.onload = () => {
        globalCache.set(src, img, img.width * img.height * 4); // Estimate RGBA size
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const preloadFont = useCallback((fontFamily: string, src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (globalCache.has(`font-${fontFamily}`)) {
        resolve();
        return;
      }

      const fontFace = new FontFace(fontFamily, `url(${src})`);
      fontFace.load().then(() => {
        document.fonts.add(fontFace);
        globalCache.set(`font-${fontFamily}`, true, 1000); // Small size for font flag
        resolve();
      }).catch(reject);
    });
  }, []);

  const preloadScript = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (globalCache.has(`script-${src}`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.onload = () => {
        globalCache.set(`script-${src}`, true, 1000);
        resolve();
      };
      script.onerror = reject;
      script.src = src;
      document.head.appendChild(script);
    });
  }, []);

  const preloadResources = useCallback(async (resources: {
    images?: string[];
    fonts?: { family: string; src: string }[];
    scripts?: string[];
  }) => {
    const allResources: Promise<any>[] = [];
    let totalResources = 0;
    let loadedResources = 0;

    // Count total resources
    if (resources.images) totalResources += resources.images.length;
    if (resources.fonts) totalResources += resources.fonts.length;
    if (resources.scripts) totalResources += resources.scripts.length;

    const updateProgress = () => {
      loadedResources++;
      setLoadingProgress(Math.round((loadedResources / totalResources) * 100));
    };

    // Preload images
    if (resources.images) {
      resources.images.forEach(src => {
        const promise = preloadImage(src).then(() => {
          setPreloadedResources(prev => new Set([...prev, src]));
          updateProgress();
        }).catch(() => updateProgress());
        allResources.push(promise);
      });
    }

    // Preload fonts
    if (resources.fonts) {
      resources.fonts.forEach(({ family, src }) => {
        const promise = preloadFont(family, src).then(() => {
          setPreloadedResources(prev => new Set([...prev, `font-${family}`]));
          updateProgress();
        }).catch(() => updateProgress());
        allResources.push(promise);
      });
    }

    // Preload scripts
    if (resources.scripts) {
      resources.scripts.forEach(src => {
        const promise = preloadScript(src).then(() => {
          setPreloadedResources(prev => new Set([...prev, `script-${src}`]));
          updateProgress();
        }).catch(() => updateProgress());
        allResources.push(promise);
      });
    }

    try {
      await Promise.allSettled(allResources);
    } catch (error) {
      console.warn('Some resources failed to preload:', error);
    }
  }, [preloadImage, preloadFont, preloadScript]);

  const getCachedImage = useCallback((src: string): HTMLImageElement | null => {
    return globalCache.get(src);
  }, []);

  const isCached = useCallback((key: string): boolean => {
    return globalCache.has(key);
  }, []);

  const clearCache = useCallback(() => {
    globalCache.clear();
    setPreloadedResources(new Set());
    setLoadingProgress(0);
  }, []);

  const getCacheStats = useCallback(() => {
    return globalCache.getStats();
  }, []);

  return {
    preloadResources,
    getCachedImage,
    isCached,
    clearCache,
    getCacheStats,
    loadingProgress,
    preloadedResources
  };
}; 