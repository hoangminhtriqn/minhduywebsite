import React, { useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";

const FaviconManager: React.FC = () => {
  const { settings } = useSettings();
  const faviconUrl = settings?.logo;

  useEffect(() => {
    if (!faviconUrl) return;

    // Remove existing favicon links
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach((link) => link.remove());

    // Create new favicon link with proper attributes
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = faviconUrl;
    link.sizes = "16x16 32x32";

    // Add to head
    document.head.appendChild(link);

    // Also add shortcut icon
    const shortcutLink = document.createElement("link");
    shortcutLink.rel = "shortcut icon";
    shortcutLink.type = "image/png";
    shortcutLink.href = faviconUrl;
    document.head.appendChild(shortcutLink);

    // Add apple touch icon
    const appleTouchLink = document.createElement("link");
    appleTouchLink.rel = "apple-touch-icon";
    appleTouchLink.href = faviconUrl;
    document.head.appendChild(appleTouchLink);

    // Force browser to reload favicon
    const link2 = document.createElement("link");
    link2.rel = "icon";
    link2.type = "image/png";
    link2.href = faviconUrl + "?" + new Date().getTime();
    document.head.appendChild(link2);
  }, [faviconUrl]);

  // Update Open Graph and Twitter meta tags with logo from settings
  useEffect(() => {
    if (!faviconUrl) return;

    // Update Open Graph image
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute("content", faviconUrl);
    }

    // Update Twitter image
    const twitterImage = document.querySelector(
      'meta[property="twitter:image"]'
    );
    if (twitterImage) {
      twitterImage.setAttribute("content", faviconUrl);
    }

    // Update structured data logo if it exists
    const structuredDataScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (structuredDataScript) {
      try {
        const structuredData = JSON.parse(
          structuredDataScript.textContent || "{}"
        );
        if (structuredData.logo) {
          structuredData.logo = faviconUrl;
          structuredData.image = faviconUrl;
          structuredDataScript.textContent = JSON.stringify(structuredData);
        }
      } catch (error) {
        console.warn("Could not update structured data:", error);
      }
    }
  }, [faviconUrl]);

  return null;
};

export default FaviconManager;
