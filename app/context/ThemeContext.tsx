"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { themes, ThemeType, Theme, PureBlackTheme } from "../theme";

type ThemeContextType = {
  currentTheme: Theme;
  themeType: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: PureBlackTheme,
  themeType: "pureBlack",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Get saved theme from localStorage or default to 'pureBlack'
  const [themeType, setThemeType] = useState<ThemeType>("pureBlack");
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    themes.pureBlack
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
        applyThemeToDocument(themes.pureBlack);
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
      root.style.setProperty("--primary-text", theme.colors.primaryText || (isLightColor(theme.colors.primary) ? "#121212" : "#FFFFFF"));
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

  // Helper function to determine if a color is light or dark
  const isLightColor = (color: string): boolean => {
    // If color is in hex format, convert to rgb
    let r, g, b;
    if (color.startsWith('#')) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else if (color.startsWith('rgb')) {
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
      } else {
        return false; // Default to false if can't parse
      }
    } else {
      return false; // Default to false for unknown formats
    }
    
    // Calculate brightness using the formula: (0.299*R + 0.587*G + 0.114*B)
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return brightness > 0.5; // If brightness > 0.5, it's a light color
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themeType, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
