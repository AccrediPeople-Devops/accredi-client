import { useEffect, useCallback } from 'react';

interface SmoothScrollOptions {
  duration?: number;
  easing?: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear';
  offset?: number;
}

export const useSmoothScroll = () => {
  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const easeInQuad = (t: number): number => {
    return t * t;
  };

  const easeOutQuad = (t: number): number => {
    return t * (2 - t);
  };

  const linear = (t: number): number => {
    return t;
  };

  const easingFunctions = {
    easeInOut: easeInOutQuad,
    easeIn: easeInQuad,
    easeOut: easeOutQuad,
    linear: linear
  };

  const scrollToPosition = useCallback((
    targetPosition: number,
    options: SmoothScrollOptions = {}
  ) => {
    const { duration = 800, easing = 'easeInOut', offset = 0 } = options;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition - offset;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const easingFunction = easingFunctions[easing];
      const easedProgress = easingFunction(progress);
      
      window.scrollTo(0, startPosition + distance * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  const scrollToElement = useCallback((
    element: Element | string,
    options: SmoothScrollOptions = {}
  ) => {
    const targetElement = typeof element === 'string' 
      ? document.querySelector(element) 
      : element;

    if (!targetElement) {
      console.warn('Element not found for scrolling');
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const targetPosition = rect.top + window.pageYOffset;
    
    scrollToPosition(targetPosition, options);
  }, [scrollToPosition]);

  const scrollToTop = useCallback((options: SmoothScrollOptions = {}) => {
    scrollToPosition(0, options);
  }, [scrollToPosition]);

  const scrollToBottom = useCallback((options: SmoothScrollOptions = {}) => {
    const targetPosition = document.documentElement.scrollHeight - window.innerHeight;
    scrollToPosition(targetPosition, options);
  }, [scrollToPosition]);

  // Set up smooth scrolling behavior for the entire page
  useEffect(() => {
    // Enable smooth scrolling for the entire document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Optimize scroll performance
    const optimizeScrolling = () => {
      // Add will-change property to elements that will scroll
      document.body.style.willChange = 'scroll-position';
      
      // Use passive event listeners for better performance
      const handleWheel = (e: WheelEvent) => {
        // Allow default smooth scrolling behavior
      };
      
      document.addEventListener('wheel', handleWheel, { passive: true });
      
      return () => {
        document.removeEventListener('wheel', handleWheel);
        document.body.style.willChange = 'auto';
      };
    };

    const cleanup = optimizeScrolling();
    
    return () => {
      cleanup();
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Handle anchor links with smooth scrolling
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash) {
        const href = target.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          scrollToElement(href, { duration: 800, offset: 80 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [scrollToElement]);

  return {
    scrollToPosition,
    scrollToElement,
    scrollToTop,
    scrollToBottom
  };
}; 