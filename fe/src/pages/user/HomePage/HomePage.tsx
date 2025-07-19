import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import HeroSection from "@/components/HeroSection";
import FeaturedModels from "@/components/FeaturedModels/FeaturedModels";
import BrandExperience from "@/components/BrandExperience";
import { PageSEO } from "@/components/SEO";
import { PageKeys } from "@/components/SEO/seoConfig";
import styles from "./HomePage.module.scss";

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

        {/* SEO Content Section */}
        <section
          className={styles.seoContent}
          aria-label="About Minh Duy BMW Đà Nẵng"
        >
          <div className={styles.container}>
            <h2>Minh Duy BMW Đà Nẵng - Đại Lý BMW Chính Hãng</h2>
            <div className={styles.contentGrid}>
              <div className={styles.contentBlock}>
                <h3>Về Minh Duy BMW Đà Nẵng</h3>
                <p>
                  Minh Duy BMW Đà Nẵng là đại lý BMW chính hãng uy tín tại Đà
                  Nẵng, chuyên cung cấp các dòng xe BMW cao cấp với chất lượng
                  và dịch vụ tốt nhất. Chúng tôi cam kết mang đến trải nghiệm
                  mua xe và sử dụng xe BMW hoàn hảo cho khách hàng tại Đà Nẵng
                  và khu vực miền Trung.
                </p>
              </div>

              <div className={styles.contentBlock}>
                <h3>Dịch Vụ BMW Tại Minh Duy</h3>
                <ul>
                  <li>Bán xe BMW chính hãng mới</li>
                  <li>Dịch vụ bảo hành và bảo dưỡng</li>
                  <li>Sửa chữa xe BMW chuyên nghiệp</li>
                  <li>Cung cấp phụ tùng BMW chính hãng</li>
                  <li>Dịch vụ test drive miễn phí</li>
                  <li>Tư vấn mua xe và tài chính</li>
                </ul>
              </div>

              <div className={styles.contentBlock}>
                <h3>Tại Sao Chọn Minh Duy BMW Đà Nẵng?</h3>
                <ul>
                  <li>Đại lý BMW chính hãng được ủy quyền</li>
                  <li>Đội ngũ kỹ thuật viên được đào tạo chuyên nghiệp</li>
                  <li>Dịch vụ khách hàng 24/7</li>
                  <li>Chế độ bảo hành toàn diện</li>
                  <li>Hỗ trợ tài chính linh hoạt</li>
                  <li>Vị trí thuận tiện tại trung tâm Đà Nẵng</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;
