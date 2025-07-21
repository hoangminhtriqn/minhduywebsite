import React from "react";
import styles from "./styles.module.scss";

const HeroSectionSkeleton: React.FC = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        {/* Left Sidebar Skeleton */}
        <div className={styles.sidebarContainer}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <div className={styles.skeletonHeader} />
            </div>
            {/* Desktop Category List Skeleton */}
            <ul className={styles.categoryList}>
              {Array.from({ length: 7 }).map((_, i) => (
                <li key={i} className={styles.categoryItem}>
                  <span className={styles.skeletonIcon} />
                  <span
                    className={styles.skeletonText}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <span className={styles.skeletonArrow} />
                </li>
              ))}
            </ul>
            {/* Mobile Collapse Skeleton */}
            <div className={styles.mobileCollapse}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={styles.skeletonCollapseItem}>
                  <div
                    className={styles.skeletonCollapseHeader}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <span
                      className={styles.skeletonIcon}
                      style={{ marginRight: 12 }}
                    />
                    <span className={styles.skeletonText} style={{ flex: 1 }} />
                  </div>
                  <ul className={styles.skeletonCollapseList}>
                    {Array.from({ length: 2 }).map((_, j) => (
                      <li
                        key={j}
                        className={styles.skeletonCollapseSubItem}
                        style={{ width: "80%" }}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right Side - Image Carousel Skeleton */}
        <div className={styles.carouselSection}>
          <div className={styles.carousel}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`${styles.carouselSlide} ${i === 0 ? styles.active : ""}`}
              >
                <div className={styles.skeletonBanner} />
              </div>
            ))}
            {/* Carousel Navigation Skeleton */}
            <button
              className={styles.carouselNav}
              style={{ left: "10px" }}
              disabled
            >
              <span className={styles.skeletonNavBtn} />
            </button>
            <button
              className={styles.carouselNav}
              style={{ right: "10px" }}
              disabled
            >
              <span className={styles.skeletonNavBtn} />
            </button>
            {/* Carousel Dots Skeleton */}
            <div className={styles.carouselDots}>
              {Array.from({ length: 4 }).map((_, i) => (
                <button
                  key={i}
                  className={`${styles.carouselDot} ${i === 0 ? styles.active : ""}`}
                  disabled
                >
                  <span className={styles.skeletonDot} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionSkeleton;
