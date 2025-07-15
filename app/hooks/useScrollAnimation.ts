"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn' | 'settleIn';
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring';
  settleDistance?: number;
  performanceMode?: 'smooth' | 'performance';
}

// Global intersection observer manager to reduce performance impact
class IntersectionObserverManager {
  private observers: Map<string, IntersectionObserver> = new Map();
  private callbacks: Map<string, Map<Element, (entry: IntersectionObserverEntry) => void>> = new Map();

  getObserver(threshold: number, rootMargin: string): IntersectionObserver {
    const key = `${threshold}-${rootMargin}`;
    
    if (!this.observers.has(key)) {
      const observer = new IntersectionObserver(
        (entries) => {
          const callbacks = this.callbacks.get(key);
          if (callbacks) {
            entries.forEach((entry) => {
              const callback = callbacks.get(entry.target);
              if (callback) {
                callback(entry);
              }
            });
          }
        },
        {
          threshold,
          rootMargin,
          // Reduce browser work by only observing intersections at specific intervals
          ...(typeof window !== 'undefined' && 'requestIdleCallback' in window ? { delay: 16 } : {})
        }
      );
      
      this.observers.set(key, observer);
      this.callbacks.set(key, new Map());
    }
    
    return this.observers.get(key)!;
  }

  observe(element: Element, threshold: number, rootMargin: string, callback: (entry: IntersectionObserverEntry) => void) {
    const key = `${threshold}-${rootMargin}`;
    const observer = this.getObserver(threshold, rootMargin);
    const callbacks = this.callbacks.get(key)!;
    
    callbacks.set(element, callback);
    observer.observe(element);
  }

  unobserve(element: Element, threshold: number, rootMargin: string) {
    const key = `${threshold}-${rootMargin}`;
    const observer = this.observers.get(key);
    const callbacks = this.callbacks.get(key);
    
    if (observer && callbacks) {
      observer.unobserve(element);
      callbacks.delete(element);
    }
  }
}

const observerManager = new IntersectionObserverManager();

// Throttle function for performance
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Helper function to generate animation styles
function generateAnimationStyles(
  isVisible: boolean,
  animationType: ScrollAnimationOptions['animationType'],
  duration: number,
  easing: ScrollAnimationOptions['easing'],
  settleDistance: number
) {
  const getEasingFunction = (easing: string) => {
    switch (easing) {
      case 'spring':
        return 'cubic-bezier(0.34, 1.56, 0.64, 1)';
      case 'ease':
        return 'ease';
      case 'ease-in':
        return 'ease-in';
      case 'ease-out':
        return 'ease-out';
      case 'ease-in-out':
        return 'ease-in-out';
      case 'linear':
        return 'linear';
      default:
        return 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  };

  const timingFunction = getEasingFunction(easing || 'spring');
  const baseStyles = {
    transition: `all ${duration}ms ${timingFunction}`,
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    perspective: '1000px',
  };

  if (!isVisible) {
    switch (animationType) {
      case 'fadeIn':
        return {
          ...baseStyles,
          opacity: 0,
          transform: 'translateZ(0)',
        };
      case 'slideUp':
        return {
          ...baseStyles,
          opacity: 0,
          transform: `translateY(${settleDistance}px) translateZ(0)`,
        };
      case 'slideDown':
        return {
          ...baseStyles,
          opacity: 0,
          transform: `translateY(-${settleDistance}px) translateZ(0)`,
        };
      case 'slideLeft':
        return {
          ...baseStyles,
          opacity: 0,
          transform: `translateX(${settleDistance}px) translateZ(0)`,
        };
      case 'slideRight':
        return {
          ...baseStyles,
          opacity: 0,
          transform: `translateX(-${settleDistance}px) translateZ(0)`,
        };
      case 'scaleIn':
        return {
          ...baseStyles,
          opacity: 0,
          transform: 'scale(0.8) translateZ(0)',
        };
      case 'rotateIn':
        return {
          ...baseStyles,
          opacity: 0,
          transform: 'rotateY(90deg) translateZ(0)',
        };
      case 'settleIn':
        return {
          ...baseStyles,
          opacity: 0,
          transform: `translateY(${settleDistance}px) scale(0.95) translateZ(0)`,
        };
      default:
        return {
          ...baseStyles,
          opacity: 0,
          transform: 'translateZ(0)',
        };
    }
  }

  return {
    ...baseStyles,
    opacity: 1,
    transform: 'translateY(0) translateX(0) scale(1) rotateY(0deg) translateZ(0)',
  };
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -100px 0px",
    triggerOnce = true,
    delay = 0,
    duration = 800,
    animationType = 'settleIn',
    easing = 'spring',
    settleDistance = 30,
    performanceMode = 'smooth'
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Throttled visibility handler for better performance
  const baseVisibilityHandler = useCallback((entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
      if (!hasAnimated || !triggerOnce) {
        // Use requestAnimationFrame for smooth animations
        if (delay > 0) {
          timeoutRef.current = setTimeout(() => {
            animationFrameRef.current = requestAnimationFrame(() => {
              setIsVisible(true);
              if (triggerOnce) {
                setHasAnimated(true);
              }
            });
          }, delay);
        } else {
          animationFrameRef.current = requestAnimationFrame(() => {
            setIsVisible(true);
            if (triggerOnce) {
              setHasAnimated(true);
            }
          });
        }
      }
    } else {
      if (!triggerOnce) {
        animationFrameRef.current = requestAnimationFrame(() => {
          setIsVisible(false);
        });
      }
    }
  }, [hasAnimated, triggerOnce, delay]);

  const handleVisibilityChange = useCallback(
    throttle(baseVisibilityHandler, performanceMode === 'performance' ? 32 : 16),
    [baseVisibilityHandler, performanceMode]
  );

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    // Use the global observer manager
    observerManager.observe(currentElement, threshold, rootMargin, handleVisibilityChange);

    return () => {
      observerManager.unobserve(currentElement, threshold, rootMargin);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, handleVisibilityChange]);

  // Memoized animation styles for better performance
  const animationStyles = useMemo(() => {
    return generateAnimationStyles(isVisible, animationType, duration, easing, settleDistance);
  }, [isVisible, animationType, duration, easing, settleDistance]);

  return {
    ref: elementRef,
    isVisible,
    animationStyles,
    hasAnimated,
  };
}

// Enhanced batch animation hook with staggered timing
export function useBatchScrollAnimation(
  count: number,
  options: ScrollAnimationOptions & { stagger?: number } = {}
) {
  const { stagger = 100, ...animationOptions } = options;
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLElement>(null);

  const handleVisibilityChange = useCallback(
    throttle((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        // Stagger animations for better visual effect
        Array.from({ length: count }).forEach((_, index) => {
          setTimeout(() => {
            setVisibleItems(prev => new Set([...prev, index]));
          }, index * stagger);
        });
      } else {
        if (!animationOptions.triggerOnce) {
          setVisibleItems(new Set());
        }
      }
    }, animationOptions.performanceMode === 'performance' ? 32 : 16),
    [count, stagger, animationOptions.triggerOnce, animationOptions.performanceMode]
  );

  useEffect(() => {
    const currentElement = containerRef.current;
    if (!currentElement) return;

    observerManager.observe(
      currentElement,
      animationOptions.threshold || 0.15,
      animationOptions.rootMargin || "0px 0px -100px 0px",
      handleVisibilityChange
    );

    return () => {
      observerManager.unobserve(
        currentElement,
        animationOptions.threshold || 0.15,
        animationOptions.rootMargin || "0px 0px -100px 0px"
      );
    };
  }, [animationOptions.threshold, animationOptions.rootMargin, handleVisibilityChange]);

  const getItemStyles = useCallback((index: number) => {
    const isVisible = visibleItems.has(index);
    return generateAnimationStyles(
      isVisible,
      animationOptions.animationType,
      animationOptions.duration || 800,
      animationOptions.easing,
      animationOptions.settleDistance || 30
    );
  }, [visibleItems, animationOptions]);

  return {
    containerRef,
    visibleItems,
    getItemStyles,
  };
}

// Hook for viewport-based content preloading
export function useViewportContentPreloader(options: { 
  preloadDistance?: number;
  onContentLoad?: (element: Element) => void;
} = {}) {
  const { preloadDistance = 500, onContentLoad } = options;
  const [loadedElements, setLoadedElements] = useState<Set<Element>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            if (!loadedElements.has(element)) {
              // Preload images in this element
              const images = element.querySelectorAll('img[data-src]');
              images.forEach((img) => {
                const src = img.getAttribute('data-src');
                if (src) {
                  img.setAttribute('src', src);
                  img.removeAttribute('data-src');
                }
              });

              // Preload background images
              const elementsWithBg = element.querySelectorAll('[data-bg]');
              elementsWithBg.forEach((el) => {
                const bg = el.getAttribute('data-bg');
                if (bg) {
                  (el as HTMLElement).style.backgroundImage = `url(${bg})`;
                  el.removeAttribute('data-bg');
                }
              });

              setLoadedElements(prev => new Set([...prev, element]));
              onContentLoad?.(element);
            }
          }
        });
      },
      {
        rootMargin: `${preloadDistance}px`,
        threshold: 0.01,
      }
    );

    // Observe all elements that might need preloading
    const elementsToObserve = document.querySelectorAll('[data-preload]');
    elementsToObserve.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [preloadDistance, onContentLoad, loadedElements]);

  return { loadedElements };
} 