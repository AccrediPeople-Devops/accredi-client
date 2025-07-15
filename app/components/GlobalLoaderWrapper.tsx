"use client";

import { useState, useEffect } from "react";
import GlobalLoader from "./GlobalLoader";

export default function GlobalLoaderWrapper() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a minimum loading time for smooth UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return <GlobalLoader isLoading={isLoading} />;
} 