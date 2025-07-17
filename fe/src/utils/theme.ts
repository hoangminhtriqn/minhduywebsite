import { Theme } from '../types/theme';

/**
 * Utility functions for theme operations
 */

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convert RGB to hex
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Lighten a color by a percentage
 */
export const lightenColor = (color: string, percent: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const { r, g, b } = rgb;
  const newR = Math.min(255, Math.round(r + (255 - r) * percent / 100));
  const newG = Math.min(255, Math.round(g + (255 - g) * percent / 100));
  const newB = Math.min(255, Math.round(b + (255 - b) * percent / 100));
  
  return rgbToHex(newR, newG, newB);
};

/**
 * Darken a color by a percentage
 */
export const darkenColor = (color: string, percent: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const { r, g, b } = rgb;
  const newR = Math.max(0, Math.round(r - r * percent / 100));
  const newG = Math.max(0, Math.round(g - g * percent / 100));
  const newB = Math.max(0, Math.round(b - b * percent / 100));
  
  return rgbToHex(newR, newG, newB);
};

/**
 * Check if a color is light or dark
 */
export const isLightColor = (color: string): boolean => {
  const rgb = hexToRgb(color);
  if (!rgb) return false;
  
  const { r, g, b } = rgb;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

/**
 * Get contrast color (black or white) for a given background color
 */
export const getContrastColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
};

/**
 * Generate a color palette from a base color
 */
export const generateColorPalette = (baseColor: string) => {
  return {
    primary: baseColor,
    primaryLight: lightenColor(baseColor, 20),
    primaryDark: darkenColor(baseColor, 20),
    primaryLighter: lightenColor(baseColor, 40),
    primaryDarker: darkenColor(baseColor, 40),
  };
};

/**
 * Apply theme to CSS custom properties
 */
export const applyThemeToCSS = (theme: Theme): void => {
  const root = document.documentElement;
  
  // Apply all theme properties to CSS custom properties
  Object.entries(theme.colors.palette).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
  
  Object.entries(theme.colors.text).forEach(([key, value]) => {
    root.style.setProperty(`--theme-text-${key}`, value);
  });
  
  Object.entries(theme.colors.background).forEach(([key, value]) => {
    root.style.setProperty(`--theme-bg-${key}`, value);
  });
  
  Object.entries(theme.colors.surface).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
};

/**
 * Create CSS variables object for React style props
 */
export const createCSSVariables = (theme: Theme): Record<string, string> => {
  return {
    '--theme-primary': theme.colors.palette.primary,
    '--theme-primary-light': theme.colors.palette.primaryLight,
    '--theme-primary-dark': theme.colors.palette.primaryDark,
    '--theme-secondary': theme.colors.palette.secondary,
    '--theme-accent': theme.colors.palette.accent,
    '--theme-text-primary': theme.colors.text.primary,
    '--theme-text-secondary': theme.colors.text.secondary,
    '--theme-bg-primary': theme.colors.background.primary,
    '--theme-bg-secondary': theme.colors.background.secondary,
    '--theme-border': theme.colors.surface.border,
    '--theme-shadow': theme.colors.surface.shadow,
  };
};

/**
 * Get CSS custom property value
 */
export const getCSSCustomProperty = (propertyName: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(propertyName).trim();
};

/**
 * Set CSS custom property value
 */
export const setCSSCustomProperty = (propertyName: string, value: string): void => {
  document.documentElement.style.setProperty(propertyName, value);
};

/**
 * Remove CSS custom property
 */
export const removeCSSCustomProperty = (propertyName: string): void => {
  document.documentElement.style.removeProperty(propertyName);
};

/**
 * Validate hex color
 */
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * Generate random hex color
 */
export const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Blend two colors
 */
export const blendColors = (color1: string, color2: string, ratio: number): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
  
  return rgbToHex(r, g, b);
};

/**
 * Get theme-aware inline styles
 */
export const getThemeStyles = (theme: Theme) => ({
  primary: {
    backgroundColor: theme.colors.palette.primary,
    color: getContrastColor(theme.colors.palette.primary),
  },
  secondary: {
    backgroundColor: theme.colors.palette.secondary,
    color: getContrastColor(theme.colors.palette.secondary),
  },
  accent: {
    backgroundColor: theme.colors.palette.accent,
    color: getContrastColor(theme.colors.palette.accent),
  },
  surface: {
    backgroundColor: theme.colors.background.paper,
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.surface.border}`,
  },
  card: {
    backgroundColor: theme.colors.background.paper,
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.surface.border}`,
    borderRadius: theme.borderRadius.base,
    boxShadow: theme.shadows.base,
  },
}); 