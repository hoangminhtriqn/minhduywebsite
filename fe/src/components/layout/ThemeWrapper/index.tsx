import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({
  children,
  className = "",
}) => {
  const { theme } = useTheme();

  // Create a unique ID for this wrapper to avoid conflicts
  const wrapperId = React.useMemo(
    () => `theme-wrapper-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  React.useEffect(() => {
    try {
      const styleElement = document.createElement("style");
      styleElement.id = `${wrapperId}-styles`;
      styleElement.textContent = `
        #${wrapperId} {
          /* Force theme colors with maximum specificity */
          background-color: ${theme.colors.background.primary} !important;
          color: ${theme.colors.text.primary} !important;
          font-family: var(--font-family-base) !important;
          transition: all 0.3s ease !important;
        }
        
        /* Force header theme */
        #${wrapperId} header,
        #${wrapperId} .header,
        #${wrapperId} [data-theme="header"] {
          background-color: transparent !important;
          color: ${theme.colors.text.primary} !important;
          border: none !important;
          transition: all 0.3s ease !important;
        }
        
        /* Auth bar styles */
        #${wrapperId} [data-theme="auth-bar"] {
          background-color: ${theme.colors.palette.secondary} !important;
          color: ${theme.colors.text.white} !important;
        }
        
        /* Auth links */
        #${wrapperId} [data-theme="auth-link"] {
          color: ${theme.colors.text.white} !important;
          text-decoration: none !important;
        }
        
        #${wrapperId} [data-theme="auth-link"]:hover {
          background-color: ${theme.colors.palette.primaryDark} !important;
        }
        
        /* Navigation links */
        #${wrapperId} [data-theme="nav-link"] {
          color: ${theme.colors.text.primary} !important;
          text-decoration: none !important;
          border-bottom: 2px solid transparent !important;
          transition: all 0.3s ease !important;
        }
        
        #${wrapperId} [data-theme="nav-link"]:hover {
          color: ${theme.colors.palette.primary} !important;
          border-bottom-color: ${theme.colors.palette.primary} !important;
        }
        
        /* Search box */
        #${wrapperId} [data-theme="search-container"] {
          border: 2px solid ${theme.colors.surface.border} !important;
          background-color: ${theme.colors.background.light} !important;
        }
        
        #${wrapperId} [data-theme="search-container"]:focus-within {
          border-color: ${theme.colors.palette.primary} !important;
        }
        
        #${wrapperId} [data-theme="search-box"] {
          background-color: transparent !important;
          color: ${theme.colors.text.primary} !important;
          border: none !important;
          outline: none !important;
        }
        
        #${wrapperId} [data-theme="search-button"] {
          background-color: ${theme.colors.palette.primary} !important;
          color: ${theme.colors.text.white} !important;
          border: none !important;
        }
        
        /* Cart link */
        #${wrapperId} [data-theme="cart-link"] {
          color: ${theme.colors.text.primary} !important;
          text-decoration: none !important;
        }
        
        #${wrapperId} [data-theme="cart-link"]:hover {
          background-color: ${theme.colors.background.light} !important;
          color: ${theme.colors.palette.primary} !important;
        }
        
        #${wrapperId} [data-theme="cart-count"] {
          background-color: ${theme.colors.palette.primary} !important;
          color: ${theme.colors.text.white} !important;
        }
        
        /* Footer styles - COMMENTED OUT */
        /*
        #${wrapperId} footer,
        #${wrapperId} .footer,
        #${wrapperId} [data-theme="footer"] {
          background-color: ${theme.colors.palette.secondary} !important;
          color: ${theme.colors.text.white} !important;
        }
        */
        
        #${wrapperId} [data-theme="footer-link"] {
          color: ${theme.colors.text.white} !important;
          opacity: 0.8 !important;
          text-decoration: none !important;
          transition: all 0.3s ease !important;
        }
        
        #${wrapperId} [data-theme="footer-link"]:hover {
          color: ${theme.colors.palette.primaryLight} !important;
          opacity: 1 !important;
        }
        
        /* Mobile menu */
        #${wrapperId} [data-theme="mobile-menu"] {
          background-color: ${theme.colors.background.paper} !important;
          border-left: 1px solid ${theme.colors.surface.border} !important;
        }
        
        #${wrapperId} [data-theme="mobile-menu-link"] {
          color: ${theme.colors.text.primary} !important;
          border-bottom: 1px solid ${theme.colors.surface.border} !important;
          text-decoration: none !important;
        }
        
        #${wrapperId} [data-theme="mobile-menu-link"]:hover {
          background-color: ${theme.colors.background.light} !important;
          color: ${theme.colors.palette.primary} !important;
        }
        
        #${wrapperId} [data-theme="overlay"] {
          background-color: ${theme.colors.background.overlay} !important;
        }
      `;

      // Remove existing styles
      const existing = document.getElementById(`${wrapperId}-styles`);
      if (existing) {
        existing.remove();
      }

      document.head.appendChild(styleElement);

      return () => {
        const element = document.getElementById(`${wrapperId}-styles`);
        if (element) {
          element.remove();
        }
      };
    } catch {
      // Silent fail
    }
  }, [theme, wrapperId]);

  const wrapperStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background.primary,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily,
    transition: "all 0.3s ease",
    minHeight: "100vh",
    width: "100%",
    margin: 0,
    padding: 0,
    border: "none",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      id={wrapperId}
      className={className}
      style={wrapperStyle}
      data-theme="wrapper"
    >
      {children}
    </div>
  );
};

export default ThemeWrapper;
