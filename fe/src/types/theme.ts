// Theme Color Palette Interface
export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// Text Colors Interface
export interface TextColors {
  primary: string;
  secondary: string;
  light: string;
  white: string;
  muted: string;
  link: string;
  linkHover: string;
}

// Background Colors Interface
export interface BackgroundColors {
  primary: string;
  secondary: string;
  light: string;
  dark: string;
  paper: string;
  overlay: string;
  gradient: string;
}

// Border and Surface Colors Interface
export interface SurfaceColors {
  border: string;
  borderLight: string;
  borderDark: string;
  shadow: string;
  shadowLight: string;
  shadowDark: string;
  divider: string;
}

// Complete Theme Interface
export interface Theme {
  name: string;
  colors: {
    palette: ColorPalette;
    text: TextColors;
    background: BackgroundColors;
    surface: SurfaceColors;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    base: string;
    slow: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// Theme Context Interface
export interface ThemeContextType {
  theme: Theme;
  themeName: string;
  setTheme: (theme: ThemeName) => void;
  updatePrimaryColor: (color: string) => void;
  resetTheme: () => void;
}

// Available Theme Names
export type ThemeName = 'minhduy' | 'sivi' | 'luxury' | 'sport' | 'elegant' | 'custom';

// Theme Configuration Interface
export interface ThemeConfig {
  [key: string]: Theme;
} 