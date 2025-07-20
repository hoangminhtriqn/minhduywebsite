import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ConfigProvider, theme } from "antd";
import { Theme, ThemeContextType } from "@/types/theme";
import {
  themeConfig,
  defaultTheme,
  getTheme,
  createCustomTheme,
} from "@/styles/themes";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [themeName, setThemeName] = useState<string>("sivi");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme");
    const savedPrimaryColor = localStorage.getItem("app-primary-color");

    if (savedTheme) {
      if (savedTheme === "custom" && savedPrimaryColor) {
        const customTheme = createCustomTheme(savedPrimaryColor, "Custom");
        setThemeState(customTheme);
        setThemeName("custom");
      } else {
        const loadedTheme = getTheme(savedTheme);
        setThemeState(loadedTheme);
        setThemeName(savedTheme);
      }
    }
  }, []);

  // Apply CSS custom properties whenever theme changes
  useEffect(() => {
    applyThemeToCSSVariables(theme);
  }, [theme]);

  // Function to apply theme to CSS custom properties
  const applyThemeToCSSVariables = (currentTheme: Theme) => {
    const root = document.documentElement;

    // Color palette
    root.style.setProperty(
      "--theme-primary",
      currentTheme.colors.palette.primary
    );
    root.style.setProperty(
      "--theme-primary-light",
      currentTheme.colors.palette.primaryLight
    );
    root.style.setProperty(
      "--theme-primary-dark",
      currentTheme.colors.palette.primaryDark
    );
    root.style.setProperty(
      "--theme-secondary",
      currentTheme.colors.palette.secondary
    );
    root.style.setProperty(
      "--theme-secondary-light",
      currentTheme.colors.palette.secondaryLight
    );
    root.style.setProperty(
      "--theme-secondary-dark",
      currentTheme.colors.palette.secondaryDark
    );
    root.style.setProperty(
      "--theme-accent",
      currentTheme.colors.palette.accent
    );
    root.style.setProperty(
      "--theme-accent-light",
      currentTheme.colors.palette.accentLight
    );
    root.style.setProperty(
      "--theme-accent-dark",
      currentTheme.colors.palette.accentDark
    );
    root.style.setProperty(
      "--theme-success",
      currentTheme.colors.palette.success
    );
    root.style.setProperty(
      "--theme-warning",
      currentTheme.colors.palette.warning
    );
    root.style.setProperty("--theme-error", currentTheme.colors.palette.error);
    root.style.setProperty("--theme-info", currentTheme.colors.palette.info);

    // Text colors
    root.style.setProperty(
      "--theme-text-primary",
      currentTheme.colors.text.primary
    );
    root.style.setProperty(
      "--theme-text-secondary",
      currentTheme.colors.text.secondary
    );
    root.style.setProperty(
      "--theme-text-light",
      currentTheme.colors.text.light
    );
    root.style.setProperty(
      "--theme-text-white",
      currentTheme.colors.text.white
    );
    root.style.setProperty(
      "--theme-text-muted",
      currentTheme.colors.text.muted
    );
    root.style.setProperty("--theme-text-link", currentTheme.colors.text.link);
    root.style.setProperty(
      "--theme-text-link-hover",
      currentTheme.colors.text.linkHover
    );

    // Background colors
    root.style.setProperty(
      "--theme-bg-primary",
      currentTheme.colors.background.primary
    );
    root.style.setProperty(
      "--theme-bg-secondary",
      currentTheme.colors.background.secondary
    );
    root.style.setProperty(
      "--theme-bg-light",
      currentTheme.colors.background.light
    );
    root.style.setProperty(
      "--theme-bg-dark",
      currentTheme.colors.background.dark
    );
    root.style.setProperty(
      "--theme-bg-paper",
      currentTheme.colors.background.paper
    );
    root.style.setProperty(
      "--theme-bg-overlay",
      currentTheme.colors.background.overlay
    );
    root.style.setProperty(
      "--theme-bg-gradient",
      currentTheme.colors.background.gradient
    );

    // Surface colors
    root.style.setProperty(
      "--theme-border",
      currentTheme.colors.surface.border
    );
    root.style.setProperty(
      "--theme-border-light",
      currentTheme.colors.surface.borderLight
    );
    root.style.setProperty(
      "--theme-border-dark",
      currentTheme.colors.surface.borderDark
    );
    root.style.setProperty(
      "--theme-shadow",
      currentTheme.colors.surface.shadow
    );
    root.style.setProperty(
      "--theme-shadow-light",
      currentTheme.colors.surface.shadowLight
    );
    root.style.setProperty(
      "--theme-shadow-dark",
      currentTheme.colors.surface.shadowDark
    );
    root.style.setProperty(
      "--theme-divider",
      currentTheme.colors.surface.divider
    );

    // Typography
    root.style.setProperty(
      "--theme-font-family",
      currentTheme.typography.fontFamily
    );
    root.style.setProperty(
      "--theme-font-size-xs",
      currentTheme.typography.fontSize.xs
    );
    root.style.setProperty(
      "--theme-font-size-sm",
      currentTheme.typography.fontSize.sm
    );
    root.style.setProperty(
      "--theme-font-size-base",
      currentTheme.typography.fontSize.base
    );
    root.style.setProperty(
      "--theme-font-size-lg",
      currentTheme.typography.fontSize.lg
    );
    root.style.setProperty(
      "--theme-font-size-xl",
      currentTheme.typography.fontSize.xl
    );
    root.style.setProperty(
      "--theme-font-size-2xl",
      currentTheme.typography.fontSize["2xl"]
    );
    root.style.setProperty(
      "--theme-font-size-3xl",
      currentTheme.typography.fontSize["3xl"]
    );
    root.style.setProperty(
      "--theme-font-size-4xl",
      currentTheme.typography.fontSize["4xl"]
    );

    // Font weights
    root.style.setProperty(
      "--theme-font-weight-light",
      currentTheme.typography.fontWeight.light.toString()
    );
    root.style.setProperty(
      "--theme-font-weight-normal",
      currentTheme.typography.fontWeight.normal.toString()
    );
    root.style.setProperty(
      "--theme-font-weight-medium",
      currentTheme.typography.fontWeight.medium.toString()
    );
    root.style.setProperty(
      "--theme-font-weight-semibold",
      currentTheme.typography.fontWeight.semibold.toString()
    );
    root.style.setProperty(
      "--theme-font-weight-bold",
      currentTheme.typography.fontWeight.bold.toString()
    );

    // Line heights
    root.style.setProperty(
      "--theme-line-height-tight",
      currentTheme.typography.lineHeight.tight.toString()
    );
    root.style.setProperty(
      "--theme-line-height-normal",
      currentTheme.typography.lineHeight.normal.toString()
    );
    root.style.setProperty(
      "--theme-line-height-relaxed",
      currentTheme.typography.lineHeight.relaxed.toString()
    );

    // Spacing
    root.style.setProperty("--theme-spacing-xs", currentTheme.spacing.xs);
    root.style.setProperty("--theme-spacing-sm", currentTheme.spacing.sm);
    root.style.setProperty("--theme-spacing-base", currentTheme.spacing.base);
    root.style.setProperty("--theme-spacing-lg", currentTheme.spacing.lg);
    root.style.setProperty("--theme-spacing-xl", currentTheme.spacing.xl);
    root.style.setProperty("--theme-spacing-2xl", currentTheme.spacing["2xl"]);
    root.style.setProperty("--theme-spacing-3xl", currentTheme.spacing["3xl"]);
    root.style.setProperty("--theme-spacing-4xl", currentTheme.spacing["4xl"]);

    // Border radius
    root.style.setProperty(
      "--theme-border-radius-none",
      currentTheme.borderRadius.none
    );
    root.style.setProperty(
      "--theme-border-radius-sm",
      currentTheme.borderRadius.sm
    );
    root.style.setProperty(
      "--theme-border-radius-base",
      currentTheme.borderRadius.base
    );
    root.style.setProperty(
      "--theme-border-radius-lg",
      currentTheme.borderRadius.lg
    );
    root.style.setProperty(
      "--theme-border-radius-xl",
      currentTheme.borderRadius.xl
    );
    root.style.setProperty(
      "--theme-border-radius-full",
      currentTheme.borderRadius.full
    );

    // Shadows
    root.style.setProperty("--theme-shadow-sm", currentTheme.shadows.sm);
    root.style.setProperty("--theme-shadow-base", currentTheme.shadows.base);
    root.style.setProperty("--theme-shadow-lg", currentTheme.shadows.lg);
    root.style.setProperty("--theme-shadow-xl", currentTheme.shadows.xl);

    // Transitions
    root.style.setProperty(
      "--theme-transition-fast",
      currentTheme.transitions.fast
    );
    root.style.setProperty(
      "--theme-transition-base",
      currentTheme.transitions.base
    );
    root.style.setProperty(
      "--theme-transition-slow",
      currentTheme.transitions.slow
    );

    // Additional theme variables for UI components
    root.style.setProperty(
      "--theme-primary-color",
      currentTheme.colors.palette.primary
    );
    root.style.setProperty(
      "--theme-primary-text",
      currentTheme.colors.text.white
    );
    root.style.setProperty(
      "--theme-surface-primary",
      currentTheme.colors.background.paper
    );
    root.style.setProperty(
      "--theme-surface-secondary",
      currentTheme.colors.background.secondary
    );
    root.style.setProperty(
      "--theme-border-color",
      currentTheme.colors.surface.border
    );

    // Also set legacy CSS variables for backward compatibility
    root.style.setProperty(
      "--minhduy-blue",
      currentTheme.colors.palette.primary
    );
    root.style.setProperty(
      "--color-primary",
      currentTheme.colors.palette.primary
    );
    root.style.setProperty(
      "--color-secondary",
      currentTheme.colors.palette.secondary
    );
    root.style.setProperty(
      "--color-accent",
      currentTheme.colors.palette.accent
    );
  };

  // Theme switching functions
  const setTheme = (newThemeName: string) => {
    if (newThemeName === "custom") {
      const savedPrimaryColor = localStorage.getItem("app-primary-color");
      if (savedPrimaryColor) {
        const customTheme = createCustomTheme(savedPrimaryColor, "Custom");
        setThemeState(customTheme);
      }
    } else {
      const newTheme = getTheme(newThemeName);
      setThemeState(newTheme);
    }
    setThemeName(newThemeName);
    localStorage.setItem("app-theme", newThemeName);
  };

  const updatePrimaryColor = (color: string) => {
    const customTheme = createCustomTheme(color, "Custom");
    setThemeState(customTheme);
    setThemeName("custom");
    localStorage.setItem("app-theme", "custom");
    localStorage.setItem("app-primary-color", color);
  };

  const resetTheme = () => {
    setThemeState(defaultTheme);
    setThemeName("sivi");
    localStorage.setItem("app-theme", "sivi");
    localStorage.removeItem("app-primary-color");
  };

  const value: ThemeContextType = {
    theme,
    themeName,
    setTheme,
    updatePrimaryColor,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
