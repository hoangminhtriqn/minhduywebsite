import { Theme, ThemeConfig } from '../types/theme';

// Helper function to generate color variations
const generateColorVariations = (baseColor: string) => {
  return {
    primary: baseColor,
    primaryLight: `color-mix(in srgb, ${baseColor} 80%, white)`,
    primaryDark: `color-mix(in srgb, ${baseColor} 80%, black)`,
  };
};

// BMW Theme (Original)
const bmwTheme: Theme = {
  name: 'BMW',
  colors: {
    palette: {
      primary: '#0066b1',
      primaryLight: '#1976d2',
      primaryDark: '#004a87',
      secondary: '#1c1c1c',
      secondaryLight: '#333333',
      secondaryDark: '#000000',
      accent: '#f7b500',
      accentLight: '#ffcc33',
      accentDark: '#e69500',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
    },
    text: {
      primary: '#1c1c1c',
      secondary: '#333333',
      light: '#666666',
      white: '#ffffff',
      muted: '#999999',
      link: '#0066b1',
      linkHover: '#004a87',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      light: '#f5f5f5',
      dark: '#1c1c1c',
      paper: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
      gradient: 'linear-gradient(135deg, #0066b1 0%, #1c1c1c 100%)',
    },
    surface: {
      border: '#e0e0e0',
      borderLight: '#f0f0f0',
      borderDark: '#cccccc',
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowLight: 'rgba(0, 0, 0, 0.05)',
      shadowDark: 'rgba(0, 0, 0, 0.2)',
      divider: '#e5e5e5',
    },
  },
  typography: {
    fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '48px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    base: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
  },
  borderRadius: {
    none: '0',
    sm: '4px',
    base: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    base: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  transitions: {
    fast: 'all 0.15s ease-in-out',
    base: 'all 0.3s ease-in-out',
    slow: 'all 0.5s ease-in-out',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1400px',
  },
};

// SiVi Theme (Your Brand)
const siviTheme: Theme = {
  ...bmwTheme,
  name: 'Minh Duy',
  colors: {
    ...bmwTheme.colors,
    palette: {
      ...bmwTheme.colors.palette,
      primary: '#059669',
      primaryLight: '#20a77c',
      primaryDark: '#047857',
      secondary: '#2c3e50',
      secondaryLight: '#34495e',
      secondaryDark: '#1a252f',
      accent: '#e74c3c',
      accentLight: '#ec7063',
      accentDark: '#c0392b',
    },
    text: {
      ...bmwTheme.colors.text,
      link: '#059669',
      linkHover: '#047857',
    },
    background: {
      ...bmwTheme.colors.background,
      gradient: 'linear-gradient(135deg, #059669 0%, #2c3e50 100%)',
    },
  },
};

// Luxury Theme
const luxuryTheme: Theme = {
  ...bmwTheme,
  name: 'Luxury',
  colors: {
    ...bmwTheme.colors,
    palette: {
      ...bmwTheme.colors.palette,
      primary: '#8b5a2b',
      primaryLight: '#a0694a',
      primaryDark: '#6b441f',
      secondary: '#2c2416',
      secondaryLight: '#3d3220',
      secondaryDark: '#1a1509',
      accent: '#d4af37',
      accentLight: '#dcc155',
      accentDark: '#b8941f',
    },
    text: {
      ...bmwTheme.colors.text,
      link: '#8b5a2b',
      linkHover: '#6b441f',
    },
    background: {
      ...bmwTheme.colors.background,
      gradient: 'linear-gradient(135deg, #8b5a2b 0%, #2c2416 100%)',
    },
  },
};

// Sport Theme
const sportTheme: Theme = {
  ...bmwTheme,
  name: 'Sport',
  colors: {
    ...bmwTheme.colors,
    palette: {
      ...bmwTheme.colors.palette,
      primary: '#dc2626',
      primaryLight: '#ef4444',
      primaryDark: '#b91c1c',
      secondary: '#1f2937',
      secondaryLight: '#374151',
      secondaryDark: '#111827',
      accent: '#fbbf24',
      accentLight: '#fcd34d',
      accentDark: '#f59e0b',
    },
    text: {
      ...bmwTheme.colors.text,
      link: '#dc2626',
      linkHover: '#b91c1c',
    },
    background: {
      ...bmwTheme.colors.background,
      gradient: 'linear-gradient(135deg, #dc2626 0%, #1f2937 100%)',
    },
  },
};

// Elegant Theme
const elegantTheme: Theme = {
  ...bmwTheme,
  name: 'Elegant',
  colors: {
    ...bmwTheme.colors,
    palette: {
      ...bmwTheme.colors.palette,
      primary: '#6366f1',
      primaryLight: '#818cf8',
      primaryDark: '#4f46e5',
      secondary: '#1e293b',
      secondaryLight: '#334155',
      secondaryDark: '#0f172a',
      accent: '#06b6d4',
      accentLight: '#22d3ee',
      accentDark: '#0891b2',
    },
    text: {
      ...bmwTheme.colors.text,
      link: '#6366f1',
      linkHover: '#4f46e5',
    },
    background: {
      ...bmwTheme.colors.background,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #1e293b 100%)',
    },
  },
};

// Theme Configuration
export const themeConfig: ThemeConfig = {
  bmw: bmwTheme,
  sivi: siviTheme,
  luxury: luxuryTheme,
  sport: sportTheme,
  elegant: elegantTheme,
};

// Default theme
export const defaultTheme = siviTheme;

// Utility functions
export const getTheme = (themeName: string): Theme => {
  return themeConfig[themeName] || defaultTheme;
};

export const getThemeNames = (): string[] => {
  return Object.keys(themeConfig);
};

export const createCustomTheme = (primaryColor: string, name: string = 'Custom'): Theme => {
  const variations = generateColorVariations(primaryColor);
  
  return {
    ...defaultTheme,
    name,
    colors: {
      ...defaultTheme.colors,
      palette: {
        ...defaultTheme.colors.palette,
        ...variations,
      },
      text: {
        ...defaultTheme.colors.text,
        link: primaryColor,
        linkHover: variations.primaryDark,
      },
      background: {
        ...defaultTheme.colors.background,
        gradient: `linear-gradient(135deg, ${primaryColor} 0%, ${defaultTheme.colors.palette.secondary} 100%)`,
      },
    },
  };
}; 