import React from "react";
import { Skeleton } from "antd";
import styles from "./BrandExperience.module.scss";

const BrandExperienceSkeleton: React.FC = () => {
  return (
    <section className={styles.brandExperience}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Video section skeleton */}
          <div className={styles.videoSection}>
            <div className={styles.videoContainer}>
              <Skeleton.Image
                active
                style={{
                  width: "100%",
                  height: "400px",
                  borderRadius: "12px",
                }}
              />
            </div>
          </div>

          {/* Text section skeleton */}
          <div className={styles.textSection}>
            {/* Title skeleton */}
            <Skeleton.Input
              active
              size="large"
              style={{
                width: 400,
                height: 48,
                marginBottom: 24,
              }}
            />

            {/* Description skeleton */}
            <div style={{ marginBottom: 40 }}>
              <Skeleton.Input
                active
                size="default"
                style={{
                  width: "100%",
                  height: 20,
                  marginBottom: 8,
                }}
              />
              <Skeleton.Input
                active
                size="default"
                style={{
                  width: "90%",
                  height: 20,
                  marginBottom: 8,
                }}
              />
              <Skeleton.Input
                active
                size="default"
                style={{
                  width: "85%",
                  height: 20,
                }}
              />
            </div>

            {/* Cards grid skeleton */}
            <div className={styles.cardsGrid}>
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className={styles.card}>
                  <Skeleton.Input
                    active
                    size="default"
                    style={{
                      width: "80%",
                      height: 24,
                      marginBottom: 12,
                    }}
                  />
                  <Skeleton.Input
                    active
                    size="default"
                    style={{
                      width: "100%",
                      height: 16,
                      marginBottom: 8,
                    }}
                  />
                  <Skeleton.Input
                    active
                    size="default"
                    style={{
                      width: "90%",
                      height: 16,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandExperienceSkeleton;
