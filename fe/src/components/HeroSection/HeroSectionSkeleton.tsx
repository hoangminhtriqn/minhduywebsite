import React from "react";
import { Skeleton } from "antd";
import styles from "./HeroSection.module.scss";

const HeroSectionSkeleton: React.FC = () => {
  return (
    <div className={styles.heroSection}>
      {/* Video background skeleton */}
      <div className={styles.heroVideo}>
        <Skeleton.Image
          active
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </div>

      <div className={styles.heroContent}>
        {/* Title skeleton */}
        <div className={styles.heroTitle}>
          <Skeleton.Input
            active
            size="large"
            style={{
              width: 400,
              height: 60,
              marginBottom: 16,
            }}
          />
          <Skeleton.Input
            active
            size="large"
            style={{
              width: 350,
              height: 60,
            }}
          />
        </div>

        {/* Subtitle skeleton */}
        <div className={styles.heroSubtitle}>
          <Skeleton.Input
            active
            size="default"
            style={{
              width: 500,
              height: 24,
              marginBottom: 8,
            }}
          />
          <Skeleton.Input
            active
            size="default"
            style={{
              width: 450,
              height: 24,
            }}
          />
        </div>

        {/* Search input skeleton */}
        <div className={styles.heroSearch}>
          <Skeleton.Input
            active
            size="large"
            style={{
              width: 500,
              height: 48,
            }}
          />
        </div>

        {/* Buttons skeleton */}
        <div className={styles.heroButtons}>
          <Skeleton.Button
            active
            size="large"
            style={{
              width: 150,
              height: 48,
              marginRight: 16,
            }}
          />
          <Skeleton.Button
            active
            size="large"
            style={{
              width: 180,
              height: 48,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSectionSkeleton;
