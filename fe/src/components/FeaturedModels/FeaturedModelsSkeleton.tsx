import React from "react";
import { Skeleton, Row, Col } from "antd";
import styles from "./FeaturedModels.module.scss";

const FeaturedModelsSkeleton: React.FC = () => {
  // Generate 9 skeleton product cards (3x3 grid)
  const skeletonProducts = Array.from({ length: 9 }, (_, index) => index);

  return (
    <section className={styles.featuredModels}>
      <div className={styles.container}>
        {/* Header skeleton */}
        <div className={styles.header}>
          <Skeleton.Input
            active
            size="large"
            style={{
              width: 300,
              height: 48,
              marginBottom: 16,
            }}
          />
          <Skeleton.Input
            active
            size="default"
            style={{
              width: 500,
              height: 24,
            }}
          />
        </div>

        {/* Products grid skeleton */}
        <div className={styles.productsGrid}>
          <Row gutter={[24, 24]}>
            {skeletonProducts.map((index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <div className={styles.productCardSkeleton}>
                  {/* Product image skeleton */}
                  <Skeleton.Image
                    active
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "8px",
                      marginBottom: 16,
                    }}
                  />

                  {/* Product title skeleton */}
                  <Skeleton.Input
                    active
                    size="default"
                    style={{
                      width: "80%",
                      height: 24,
                      marginBottom: 12,
                    }}
                  />

                  {/* Product price skeleton */}
                  <Skeleton.Input
                    active
                    size="default"
                    style={{
                      width: "60%",
                      height: 20,
                      marginBottom: 16,
                    }}
                  />

                  {/* Product specs skeleton */}
                  <div style={{ marginBottom: 16 }}>
                    <Skeleton.Input
                      active
                      size="small"
                      style={{
                        width: "100%",
                        height: 16,
                        marginBottom: 8,
                      }}
                    />
                    <Skeleton.Input
                      active
                      size="small"
                      style={{
                        width: "90%",
                        height: 16,
                        marginBottom: 8,
                      }}
                    />
                    <Skeleton.Input
                      active
                      size="small"
                      style={{
                        width: "85%",
                        height: 16,
                      }}
                    />
                  </div>

                  {/* Button skeleton */}
                  <Skeleton.Button
                    active
                    size="default"
                    style={{
                      width: "100%",
                      height: 40,
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Load more button skeleton */}
        <div className={styles.loadMoreContainer}>
          <Skeleton.Button
            active
            size="large"
            style={{
              width: 200,
              height: 48,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedModelsSkeleton;
