import React from "react";
import HeroSectionSkeleton from "./HeroSection/HeroSectionSkeleton";
import BrandExperienceSkeleton from "./BrandExperience/BrandExperienceSkeleton";
import FeaturedModelsSkeleton from "./FeaturedModels/FeaturedModelsSkeleton";

const HomePageSkeleton: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        padding: "0",
      }}
    >
      <HeroSectionSkeleton />
      <BrandExperienceSkeleton />
      <FeaturedModelsSkeleton />
    </div>
  );
};

export default HomePageSkeleton;
