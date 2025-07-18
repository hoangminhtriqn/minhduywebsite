import React from "react";
import SEOHead from "./SEOHead";
import { getSEOConfig, SEOConfig, PageKeys } from "./seoConfig";

interface PageSEOProps {
  pageKey: PageKeys;
  dynamicData?: Record<string, string>;
  customConfig?: Partial<SEOConfig>;
}

const PageSEO: React.FC<PageSEOProps> = ({
  pageKey,
  dynamicData,
  customConfig,
}) => {
  // Get the base SEO config for the page
  const baseConfig = getSEOConfig(pageKey, dynamicData);

  // Merge with custom config if provided
  const finalConfig = customConfig
    ? { ...baseConfig, ...customConfig }
    : baseConfig;

  return <SEOHead {...finalConfig} />;
};

export default PageSEO;
