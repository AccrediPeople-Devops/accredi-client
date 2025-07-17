"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const TawkToWidget = () => {
  useEffect(() => {
    // Initialize Tawk.to
    const Tawk_API = window.Tawk_API || {};
    const Tawk_LoadStart = new Date();
    
    window.Tawk_API = Tawk_API;
    window.Tawk_LoadStart = Tawk_LoadStart;

    // Create and inject the script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/6862d7374dfd70191279e147/1j0c7ui1i';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Insert the script
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default TawkToWidget; 