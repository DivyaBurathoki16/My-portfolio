import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "../services/api";

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  cardBackground: string;
  primaryFont: string;
  headingFont: string;
  bodyFont: string;
  fontScale: number;
  borderRadius: string;
  cardStyle: "glass" | "elevated" | "minimal";
  navStyle: "transparent" | "solid";
  heroHeadlineColor: string;
  heroSubtitleColor: string;
  heroBackgroundType: "gradient" | "image" | "solid";
  heroGradient: string;
  heroImageURL: string;
  currentMode: "light" | "dark";
}

interface ThemeContextType {
  theme: ThemeSettings | null;
  isDark: boolean;
  loading: boolean;
  toggleTheme: () => void;
  updateTheme: (newTheme: Partial<ThemeSettings>) => Promise<void>;
  refreshTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme fallback
const defaultTheme: ThemeSettings = {
  primaryColor: "#0ea5e9",
  secondaryColor: "#8b5cf6",
  backgroundColor: "#ffffff",
  textColor: "#111111",
  accentColor: "#6366f1",
  cardBackground: "#f9fafb",
  primaryFont: "Inter",
  headingFont: "Inter",
  bodyFont: "Inter",
  fontScale: 1,
  borderRadius: "12px",
  cardStyle: "glass",
  navStyle: "transparent",
  heroHeadlineColor: "#0f172a",
  heroSubtitleColor: "#475569",
  heroBackgroundType: "gradient",
  heroGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  heroImageURL: "",
  currentMode: "light"
};

// Helper function to check if a color is dark
const isDarkColor = (color: string): boolean => {
  if (!color) return false;
  
  // Handle hex colors (#RRGGBB or #RGB)
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    
    // Handle short hex (#RGB)
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.5;
    }
    
    // Handle full hex (#RRGGBB)
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.5;
    }
  }
  
  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    const matches = color.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const r = parseInt(matches[0]);
      const g = parseInt(matches[1]);
      const b = parseInt(matches[2]);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.5;
    }
  }
  
  // For named colors or unknown formats, assume it's dark if it's a common dark color name
  const darkColorNames = ['black', '#000', '#000000', 'rgb(0,0,0)', '#111', '#111111', '#0f172a', '#1e293b'];
  if (darkColorNames.includes(color.toLowerCase())) {
    return true;
  }
  
  // Default: if we can't determine, assume it's not dark (safer for light mode)
  return false;
};

// Helper function to get light text color for dark backgrounds
const getLightTextColor = (): string => {
  return "#e2e8f0"; // Light gray for dark mode
};

// Helper function to get dark text color for light backgrounds
const getDarkTextColor = (): string => {
  return "#0f172a"; // Dark gray for light mode
};

// Apply theme to CSS variables
const applyThemeToCSS = (theme: ThemeSettings) => {
  const root = document.documentElement;
  const isDark = theme.currentMode === "dark";
  
  // Color System - adjust for dark mode
  root.style.setProperty("--primary-color", theme.primaryColor);
  root.style.setProperty("--secondary-color", theme.secondaryColor);
  
  // Background colors
  root.style.setProperty("--background-color", theme.backgroundColor);
  root.style.setProperty("--card-background", theme.cardBackground);
  
  // Text colors - ensure visibility in dark mode
  if (isDark) {
    // If text color is dark, use light color instead
    const textColor = isDarkColor(theme.textColor) ? getLightTextColor() : theme.textColor;
    root.style.setProperty("--text-color", textColor);
    
    // Hero colors - ensure visibility
    const headlineColor = isDarkColor(theme.heroHeadlineColor) ? getLightTextColor() : theme.heroHeadlineColor;
    const subtitleColor = isDarkColor(theme.heroSubtitleColor) ? "#cbd5e1" : theme.heroSubtitleColor;
    root.style.setProperty("--hero-headline-color", headlineColor);
    root.style.setProperty("--hero-subtitle-color", subtitleColor);
  } else {
    // Light mode - use theme colors as-is
    root.style.setProperty("--text-color", theme.textColor);
    root.style.setProperty("--hero-headline-color", theme.heroHeadlineColor);
    root.style.setProperty("--hero-subtitle-color", theme.heroSubtitleColor);
  }
  
  root.style.setProperty("--accent-color", theme.accentColor);
  
  // Typography
  root.style.setProperty("--primary-font", theme.primaryFont);
  root.style.setProperty("--heading-font", theme.headingFont);
  root.style.setProperty("--body-font", theme.bodyFont);
  root.style.setProperty("--font-scale", theme.fontScale.toString());
  
  // Layout
  root.style.setProperty("--border-radius", theme.borderRadius);
  root.style.setProperty("--card-style", theme.cardStyle);
  root.style.setProperty("--nav-style", theme.navStyle);
  
  // Hero Section
  root.style.setProperty("--hero-background-type", theme.heroBackgroundType);
  root.style.setProperty("--hero-gradient", theme.heroGradient);
  root.style.setProperty("--hero-image-url", theme.heroImageURL ? `url(${theme.heroImageURL})` : "none");
  
  // Mode
  root.style.setProperty("--current-mode", theme.currentMode);
  root.setAttribute("data-theme", theme.currentMode);
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Fetch theme from API
  const fetchTheme = async () => {
    try {
      setLoading(true);
      const response = await api.get("/theme");
      const themeData = response.data as ThemeSettings;
      setTheme(themeData);
      applyThemeToCSS(themeData);
      setIsDark(themeData.currentMode === "dark");
    } catch (error: any) {
      // Only log detailed errors in development mode
      if (import.meta.env.DEV) {
        const isNetworkError = error.code === "ERR_NETWORK" || error.message?.includes("Network Error");
        if (isNetworkError) {
          console.warn("API server not reachable. Using default theme. Make sure the server is running on port 5000.");
        } else {
          console.error("Failed to fetch theme, using defaults:", error);
        }
      }
      setTheme(defaultTheme);
      applyThemeToCSS(defaultTheme);
    } finally {
      setLoading(false);
    }
  };

  // Initial theme fetch
  useEffect(() => {
    fetchTheme();
  }, []);

  // Update theme function (for admin)
  const updateTheme = async (newTheme: Partial<ThemeSettings>) => {
    try {
      const updatedTheme = { ...theme, ...newTheme } as ThemeSettings;
      setTheme(updatedTheme);
      applyThemeToCSS(updatedTheme);
      setIsDark(updatedTheme.currentMode === "dark");
    } catch (error) {
      console.error("Failed to update theme:", error);
      throw error;
    }
  };

  // Refresh theme from server
  const refreshTheme = async () => {
    await fetchTheme();
  };

  // Toggle dark/light mode (legacy support)
  const toggleTheme = () => {
    const newMode = isDark ? "light" : "dark";
    if (theme) {
      updateTheme({ currentMode: newMode });
    } else {
      setIsDark(!isDark);
      localStorage.setItem("theme", newMode);
      document.documentElement.setAttribute("data-theme", newMode);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, loading, toggleTheme, updateTheme, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

