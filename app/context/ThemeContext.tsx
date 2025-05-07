"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { themes, ThemeType, Theme, PurpleEleganceTheme } from "../theme";

type ThemeContextType = {
  currentTheme: Theme;
  themeType: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: PurpleEleganceTheme,
  themeType: "purpleElegance",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Get saved theme from localStorage or default to 'purpleElegance'
  const [themeType, setThemeType] = useState<ThemeType>("purpleElegance");
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    themes.purpleElegance
  );

  // Load theme from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as ThemeType | null;
      if (savedTheme && themes[savedTheme]) {
        setThemeType(savedTheme);
        setCurrentTheme(themes[savedTheme]);
        applyThemeToDocument(themes[savedTheme]);
      } else {
        // If no theme is saved, apply the default theme
        applyThemeToDocument(themes.purpleElegance);
      }
    }
  }, []);

  // Function to set a new theme
  const setTheme = (newTheme: ThemeType) => {
    if (themes[newTheme]) {
      setThemeType(newTheme);
      setCurrentTheme(themes[newTheme]);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }

      // Apply the theme to CSS variables
      applyThemeToDocument(themes[newTheme]);
    }
  };

  // Function to apply theme to document root
  const applyThemeToDocument = (theme: Theme) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;

      // Apply colors
      root.style.setProperty("--background", theme.colors.background);
      root.style.setProperty("--foreground", theme.colors.text);
      root.style.setProperty("--foreground-muted", theme.colors.mutedText || adjustColor(theme.colors.text, 0.6));
      root.style.setProperty("--primary", theme.colors.primary);
      root.style.setProperty("--primary-hover", theme.colors.primaryHover || adjustColor(theme.colors.primary, 0.8));
      root.style.setProperty("--secondary", theme.colors.secondary);
      root.style.setProperty("--input-bg", theme.colors.inputBg);
      root.style.setProperty("--error", theme.colors.error);
      root.style.setProperty("--success", theme.colors.success);
      root.style.setProperty("--border", theme.colors.border || adjustColor(theme.colors.text, 0.2));

      // Apply border radius
      root.style.setProperty("--radius-sm", theme.borderRadius.small);
      root.style.setProperty("--radius-md", theme.borderRadius.medium);
      root.style.setProperty("--radius-lg", theme.borderRadius.large);

      // Apply shadows
      root.style.setProperty("--shadow-sm", theme.shadows.small);
      root.style.setProperty("--shadow-md", theme.shadows.medium);
      root.style.setProperty("--shadow-lg", theme.shadows.large);

      // Apply typography
      root.style.setProperty("--font-family", theme.typography.fontFamily);
    }
  };

  // Helper function to adjust color opacity
  const adjustColor = (color: string, opacity: number): string => {
    // If color is in hex format, convert to rgba
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // If already rgba, adjust opacity
    if (color.startsWith('rgba')) {
      return color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, `rgba($1, $2, $3, ${opacity})`);
    }
    
    // If rgb, convert to rgba
    if (color.startsWith('rgb')) {
      return color.replace(/rgb/, 'rgba').replace(/\)/, `, ${opacity})`);
    }
    
    return color;
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themeType, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
