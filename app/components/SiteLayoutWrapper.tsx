"use client";

import { useEffect } from "react";
import { useContentCache } from "@/app/hooks/useContentCache";
import { useSmoothScroll } from "@/app/hooks/useSmoothScroll";

export default function SiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { preloadResources } = useContentCache();
  
  // Initialize smooth scrolling
  useSmoothScroll();

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Define critical resources to preload
        const criticalResources = {
          images: [
            '/Logo/Only_Transperent/full_trimmed_transparent_base.png',
            '/Website Images/HeroSectionHomePage/AdobeStock_258949460.jpeg',
            '/Website Images/CoursePage/PMP Training/AdobeStock_274794823.jpeg',
            '/Website Images/CategoryIcons/Agile & Scrum - Image.png',
            '/Website Images/CategoryIcons/CC- Transprt.png',
          ],
          fonts: [
            // Inter font will be loaded from Google Fonts or system fallback
          ]
        };
        
        // Preload resources
        await preloadResources(criticalResources);
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };

    loadContent();
  }, [preloadResources]);

  return <>{children}</>;
} 