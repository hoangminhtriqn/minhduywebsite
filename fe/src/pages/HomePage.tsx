import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import HeroSection from "../components/HeroSection/HeroSection";
import FeaturedModels from "../components/FeaturedModels/FeaturedModels";
import BrandExperience from "../components/BrandExperience/BrandExperience";

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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        padding: "0",
      }}
    >
      <HeroSection />
      <BrandExperience />
      <FeaturedModels />
    </div>
  );
};

export default HomePage;
