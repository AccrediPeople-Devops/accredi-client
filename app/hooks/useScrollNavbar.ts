import { useState, useEffect, useRef } from 'react';

interface UseScrollNavbarOptions {
  threshold?: number;
  debounceMs?: number;
}

export const useScrollNavbar = (options: UseScrollNavbarOptions = {}) => {
  const { threshold = 100, debounceMs = 10 } = options;
  
  const [isVisible, setIsVisible] = useState(true);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollDirection = () => {
    const currentScrollY = window.scrollY;
    
    // Always show navbar at top
    if (currentScrollY <= threshold) {
      setIsVisible(true);
      setIsScrollingUp(false);
    } else {
      // Show navbar when scrolling up, hide when scrolling down
      const scrollingUp = currentScrollY < lastScrollY.current;
      const scrollingDown = currentScrollY > lastScrollY.current;
      
      if (scrollingUp && !isScrollingUp) {
        setIsVisible(true);
        setIsScrollingUp(true);
      } else if (scrollingDown && isScrollingUp) {
        setIsVisible(false);
        setIsScrollingUp(false);
      }
    }
    
    setScrollY(currentScrollY);
    lastScrollY.current = currentScrollY;
    ticking.current = false;
  };

  const requestTick = () => {
    if (!ticking.current) {
      requestAnimationFrame(updateScrollDirection);
      ticking.current = true;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      requestTick();
    };

    // Throttle scroll events
    let timeoutId: NodeJS.Timeout;
    const throttledScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(handleScroll, debounceMs);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Set initial scroll position
    setScrollY(window.scrollY);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [debounceMs, threshold, isScrollingUp]);

  return {
    isVisible,
    isScrollingUp,
    scrollY,
    isAtTop: scrollY <= threshold,
  };
}; 