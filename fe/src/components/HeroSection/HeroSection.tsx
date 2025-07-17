import React, { useRef, useEffect } from "react";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./HeroSection.module.scss";

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays on mobile devices
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback to poster image if video fails to load
        if (videoRef.current) {
          videoRef.current.style.display = "none";
        }
      });
    }
  }, []);

  const handleVideoError = () => {
    // Hide video and show fallback background
    if (videoRef.current) {
      videoRef.current.style.display = "none";
    }
  };

  return (
    <div className={styles.heroSection}>
      {/* Video background */}
      <video
        ref={videoRef}
        className={styles.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/bmw-3840x2160.jpg"
        onError={handleVideoError}
      >
        <source src="/video/intro.mp4" type="video/mp4" />
        <source src="/video/intro_2.mp4" type="video/mp4" />
        {/* Fallback background image if video fails to load */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/images/bmw-3840x2160.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </video>

      <div className={styles.heroContent}>
        <div className={styles.heroTitle}>
          <span className={styles.gradientText}>SỨC MẠNH</span>
          <span className={styles.gradientText2}> VÀ ĐẲNG CẤP</span>
        </div>
        <div className={styles.heroSubtitle}>
          <span className={styles.subtitleGradient}>
            Khám phá thế giới xe BMW
          </span>
          <span className={styles.subtitleGradient2}>
            {" "}
            - Nơi công nghệ hòa trộn với cá tính
          </span>
        </div>

        <div className={styles.heroSearch}>
          <Input
            size="large"
            placeholder="Tìm kiếm model, giá, hoặc tính năng..."
            prefix={<SearchOutlined />}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.heroButtons}>
          <Button type="primary" size="large" className={styles.primaryButton}>
            Khám phá ngay
          </Button>
          <Button
            size="large"
            onClick={() => (window.location.href = "/dat-hen-lai-thu")}
            className={styles.secondaryButton}
          >
            Đặt lịch lái thử
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
