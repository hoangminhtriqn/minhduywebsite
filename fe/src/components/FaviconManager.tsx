import React, { useEffect } from "react";

const FaviconManager: React.FC = () => {
  useEffect(() => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach((link) => link.remove());

    // Create new favicon link
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = "/favicon.ico";

    // Add to head
    document.head.appendChild(link);

    // Also add shortcut icon
    const shortcutLink = document.createElement("link");
    shortcutLink.rel = "shortcut icon";
    shortcutLink.type = "image/x-icon";
    shortcutLink.href = "/favicon.ico";
    document.head.appendChild(shortcutLink);
  }, []);

  return null;
};

export default FaviconManager;
