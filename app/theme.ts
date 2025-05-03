// Theme definitions from the Ultimate Base Prompt
export const PurpleEleganceTheme = {
  name: "Purple Elegance",
  colors: {
    primary: "#7E57C2", // Medium purple - more vibrant
    secondary: "#B39DDB", // Lighter purple - better contrast
    background: "#1E1E2F", // Deep blue-charcoal - easier on eyes
    text: "#F8F9FA", // Crisp white text - better readability
    inputBg: "#2D2D44", // Slightly lighter than background
    error: "#FF5252", // Brighter error red
    success: "#4CAF50", // Clearer success green
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
  },
  shadows: {
    small: "0 2px 4px rgba(0, 0, 0, 0.2)",
    medium: "0 4px 6px rgba(0, 0, 0, 0.3)",
    large: "0 10px 15px rgba(0, 0, 0, 0.4)",
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
};

export const BlackWhiteMinimalTheme = {
  name: "Black & White Minimal",
  colors: {
    primary: "#333333", // Dark gray instead of pure black
    secondary: "#757575", // Medium gray with better contrast
    background: "#FFFFFF", // Pure white
    text: "#212121", // Near-black text
    inputBg: "#F5F5F5", // Light gray input background
    error: "#F44336", // Material design red
    success: "#4CAF50", // Material design green
  },
  borderRadius: {
    small: "2px",
    medium: "4px",
    large: "8px",
  },
  shadows: {
    small: "0 1px 3px rgba(0, 0, 0, 0.1)",
    medium: "0 2px 4px rgba(0, 0, 0, 0.1)",
    large: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
};

export const WhiteSoftGrayTheme = {
  name: "White & Soft Gray",
  colors: {
    primary: "#2196F3", // Blue primary - distinct from other themes
    secondary: "#90CAF9", // Light blue secondary
    background: "#FFFFFF", // White
    text: "#424242", // Dark gray text
    inputBg: "#F5F7FA", // Very light blue-gray input background
    error: "#F44336", // Material design red
    success: "#4CAF50", // Material design green
  },
  borderRadius: {
    small: "8px",
    medium: "12px",
    large: "16px",
  },
  shadows: {
    small: "0 2px 6px rgba(0, 0, 0, 0.05)",
    medium: "0 4px 12px rgba(0, 0, 0, 0.05)",
    large: "0 8px 24px rgba(0, 0, 0, 0.05)",
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
};

// Default export for the active theme
export const themes = {
  purpleElegance: PurpleEleganceTheme,
  blackWhiteMinimal: BlackWhiteMinimalTheme,
  whiteSoftGray: WhiteSoftGrayTheme,
};

export type ThemeType =
  | "purpleElegance"
  | "blackWhiteMinimal"
  | "whiteSoftGray";
export type Theme = typeof PurpleEleganceTheme;
