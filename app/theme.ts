// Theme definitions from the Ultimate Base Prompt
export const PurpleEleganceTheme = {
  name: "Purple Elegance",
  colors: {
    primary: "#4F46E5", // Medium purple - more vibrant 7E57C2
    primaryHover: "#3730A3", // Darker purple for hover states
    primaryText: "#FFFFFF", // Text color on primary buttons
    secondary: "#B39DDB", // Lighter purple - better contrast
    background: "#1E1E2F", // Deep blue-charcoal - easier on eyes
    text: "#F8F9FA", // Crisp white text - better readability
    mutedText: "#9CA3AF", // Muted text for secondary content
    inputBg: "#2D2D44", // Slightly lighter than background
    border: "#3D3D56", // Border color
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

// New Pure Black theme based on Purple Elegance but with completely black background
export const PureBlackTheme = {
  name: "Pure Black",
  colors: {
    primary: "#4F46E5", // Same purple as Purple Elegance
    primaryHover: "#3730A3", // Same hover state
    primaryText: "#FFFFFF", // Text color on primary buttons
    secondary: "#B39DDB", // Same secondary color
    background: "#000000", // Pure black background
    text: "#F8F9FA", // Same crisp white text
    mutedText: "#9CA3AF", // Same muted text
    inputBg: "#121212", // Dark gray input background
    border: "#333333", // Darker border for contrast
    error: "#FF5252", // Same error red
    success: "#4CAF50", // Same success green
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
  },
  shadows: {
    small: "0 2px 4px rgba(0, 0, 0, 0.3)",
    medium: "0 4px 6px rgba(0, 0, 0, 0.4)",
    large: "0 10px 15px rgba(0, 0, 0, 0.5)",
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
};

export const BlackWhiteMinimalTheme = {
  name: "Black & White Minimal",
  colors: {
    primary: "#333333", // Dark gray instead of pure black
    primaryHover: "#111111", // Darker for hover states
    primaryText: "#FFFFFF", // Text color on primary buttons
    secondary: "#757575", // Medium gray with better contrast
    background: "#FFFFFF", // Pure white
    text: "#212121", // Near-black text
    mutedText: "#6B7280", // Muted text for secondary content
    inputBg: "#F5F5F5", // Light gray input background
    border: "#E5E7EB", // Light gray border
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

// New Dark Minimal theme - reversed version of Black & White Minimal
export const DarkMinimalTheme = {
  name: "Dark Minimal",
  colors: {
    primary: "#FFFFFF", // Pure white for primary (reversed from B&W)
    primaryHover: "#E5E5E5", // Slight gray for hover
    primaryText: "#121212", // Dark text for use on white backgrounds/buttons
    secondary: "#AAAAAA", // Light gray for secondary
    background: "#121212", // Very dark gray/near-black background
    text: "#FFFFFF", // White text
    mutedText: "#9CA3AF", // Gray for muted text
    inputBg: "#222222", // Slightly lighter than background
    border: "#333333", // Dark gray border
    error: "#F44336", // Same material design red
    success: "#4CAF50", // Same material design green
  },
  borderRadius: {
    small: "2px",
    medium: "4px",
    large: "8px",
  },
  shadows: {
    small: "0 1px 3px rgba(0, 0, 0, 0.3)",
    medium: "0 2px 4px rgba(0, 0, 0, 0.4)",
    large: "0 4px 8px rgba(0, 0, 0, 0.5)",
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
};

export const WhiteSoftGrayTheme = {
  name: "White & Soft Gray",
  colors: {
    primary: "#2196F3", // Blue primary - distinct from other themes
    primaryHover: "#1565C0", // Darker blue for hover states
    primaryText: "#FFFFFF", // Text color on primary buttons
    secondary: "#90CAF9", // Light blue secondary
    background: "#FFFFFF", // White
    text: "#424242", // Dark gray text
    mutedText: "#6B7280", // Muted text for secondary content
    inputBg: "#F5F7FA", // Very light blue-gray input background
    border: "#E2E8F0", // Light blue-gray border
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
  pureBlack: PureBlackTheme,
  blackWhiteMinimal: BlackWhiteMinimalTheme,
  darkMinimal: DarkMinimalTheme,
  whiteSoftGray: WhiteSoftGrayTheme,
};

export type ThemeType =
  | "purpleElegance"
  | "pureBlack"
  | "blackWhiteMinimal"
  | "darkMinimal"
  | "whiteSoftGray";
export type Theme = typeof PurpleEleganceTheme;
