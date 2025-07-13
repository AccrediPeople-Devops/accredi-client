"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

type SiteTheme = 'light' | 'dark' | 'system';
type ResolvedSiteTheme = 'light' | 'dark';

interface SiteThemeContextType {
  theme: SiteTheme;
  resolvedTheme: ResolvedSiteTheme;
  setTheme: (theme: SiteTheme) => void;
}

const SiteThemeContext = createContext<SiteThemeContextType | undefined>(undefined);

export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedSiteTheme>('dark');

  // Check system preference
  const getSystemTheme = (): ResolvedSiteTheme => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  // Resolve theme based on current setting
  const resolveTheme = (currentTheme: SiteTheme): ResolvedSiteTheme => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('site-theme') as SiteTheme;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    setResolvedTheme(resolveTheme(initialTheme));
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update theme
  const handleSetTheme = (newTheme: SiteTheme) => {
    setTheme(newTheme);
    setResolvedTheme(resolveTheme(newTheme));
    localStorage.setItem('site-theme', newTheme);
  };

  // Apply theme classes to site container
  useEffect(() => {
    // Find the site container and apply theme class
    const siteContainer = document.querySelector('[data-site-theme-container]');
    if (siteContainer) {
      siteContainer.classList.remove('site-light', 'site-dark');
      siteContainer.classList.add(`site-${resolvedTheme}`);
    }
  }, [resolvedTheme]);

  return (
    <SiteThemeContext.Provider value={{ theme, resolvedTheme, setTheme: handleSetTheme }}>
      {children}
    </SiteThemeContext.Provider>
  );
}

export function useSiteTheme() {
  const context = useContext(SiteThemeContext);
  if (context === undefined) {
    throw new Error('useSiteTheme must be used within a SiteThemeProvider');
  }
  return context;
} 