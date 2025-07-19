import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import HeroSection from "@/components/HeroSection";
import FeaturedModels from "@/components/FeaturedModels";
import BrandExperience from "@/components/BrandExperience";
import PopularNews from "@/components/PopularNews";
import { PageSEO } from "@/components/SEO";
import { PageKeys } from "@/components/SEO/seoConfig";

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
        <p style={{ marginTop: 16, fontSize: 16, color: "#666" }}>
          Đang tải trang...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* SEO for Homepage */}
      <PageSEO pageKey={PageKeys.HOME} />

      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          padding: "0",
        }}
      >
        {/* SEO-friendly main content */}
        <section aria-label="Hero Section">
          <HeroSection />
        </section>

        {/* Brand Experience Section */}
        <section aria-label="Brand Experience">
          <BrandExperience />
        </section>

        {/* Featured Models Section */}
        <section aria-label="Featured BMW Models">
          <FeaturedModels />
        </section>

        {/* Popular News Section */}
        <section aria-label="Tin Tức Được Xem Nhiều">
          <PopularNews />
        </section>
      </main>
    </>
  );
};

export default HomePage;
