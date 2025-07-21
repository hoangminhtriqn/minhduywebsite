import React, { useEffect } from "react";

const FaviconManager: React.FC = () => {
  useEffect(() => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach((link) => link.remove());

    // Create new favicon link with proper attributes
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = "/images/logo.png";
    link.sizes = "16x16 32x32";

    // Add to head
    document.head.appendChild(link);

    // Also add shortcut icon
    const shortcutLink = document.createElement("link");
    shortcutLink.rel = "shortcut icon";
    shortcutLink.type = "image/png";
    shortcutLink.href = "/images/logo.png";
    document.head.appendChild(shortcutLink);

    // Add apple touch icon
    const appleTouchLink = document.createElement("link");
    appleTouchLink.rel = "apple-touch-icon";
    appleTouchLink.href = "/images/logo.png";
    document.head.appendChild(appleTouchLink);

    // Force browser to reload favicon
    const link2 = document.createElement("link");
    link2.rel = "icon";
    link2.type = "image/png";
    link2.href = "/images/logo.png?" + new Date().getTime();
    document.head.appendChild(link2);
  }, []);

  return null;
};

export default FaviconManager;
