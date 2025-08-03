import React from "react";
import SEOStructuredData from "../SEOStructuredData";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: {
    type: "organization" | "carDealer" | "breadcrumb" | "product";
    data: {
      currentPage?: string;
      currentPath?: string;
      name?: string;
      description?: string;
      price?: string;
    };
  }[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = "/images/logo.png",
  ogType = "website",
  structuredData = [],
}) => {
  return (
    <>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Minh Duy Đà Nẵng" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Vietnamese" />
      <meta name="revisit-after" content="7 days" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta
        property="og:url"
        content={canonical || "https://minduywebsite.com/"}
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Minh Duy Đà Nẵng" />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta
        property="twitter:url"
        content={canonical || "https://minduywebsite.com/"}
      />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="VN-60" />
      <meta name="geo.placename" content="Đà Nẵng" />
      <meta name="geo.position" content="16.0544;108.2022" />
      <meta name="ICBM" content="16.0544, 108.2022" />

      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <SEOStructuredData key={index} type={data.type} data={data.data} />
      ))}
    </>
  );
};

export default SEOHead;
