import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import styles from "./BrandExperience.module.scss";

const BrandExperience: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const handleVideoClick = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  useEffect(() => {
    setIsVideoPlaying(true);
  }, []);

  return (
    <section className={styles.brandExperience}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.videoSection}>
            <div className={styles.videoContainer} onClick={handleVideoClick}>
              <video
                className={styles.video}
                poster="/images/brand-video-poster.jpg"
                controls={isVideoPlaying}
                autoPlay={true}
                muted={true}
                loop={true}
                playsInline={true}
              >
                <source src="/video/intro_2.mp4" type="video/mp4" />
              </video>
              {!isVideoPlaying && (
                <div className={styles.playIcon}>
                  <PlayCircleOutlined />
                </div>
              )}
            </div>
          </div>

          <div className={styles.textSection}>
            <h2 className={styles.title}>KHÁM PHÁ SỨC MẠNH BMW</h2>
            <p className={styles.description}>
              Trải nghiệm đẳng cấp Đức với công nghệ tiên tiến và thiết kế xuất
              sắc. Từ những chiếc sedan sang trọng đến SUV mạnh mẽ, BMW mang đến
              sự hoàn hảo trong từng chi tiết. Khám phá ngay bộ sưu tập xe hơi
              đỉnh cao của chúng tôi.
            </p>

            <div className={styles.cardsGrid}>
              <div
                className={`${styles.card} ${hoveredCard === "innovation" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("innovation")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>Công nghệ tương lai</h3>
                <p className={styles.cardDescription}>
                  iDrive 8.0, tự động lái cấp 3, kết nối 5G và trí tuệ nhân tạo
                </p>
              </div>
              <div
                className={`${styles.card} ${hoveredCard === "quality" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("quality")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>Thiết kế kiệt tác</h3>
                <p className={styles.cardDescription}>
                  Ngoại thất thể thao, nội thất da Nappa, ánh sáng ambient 11
                  màu
                </p>
              </div>
              <div
                className={`${styles.card} ${hoveredCard === "performance" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("performance")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>Hiệu suất đỉnh cao</h3>
                <p className={styles.cardDescription}>
                  Động cơ TwinPower Turbo, xDrive AWD, 0-100km/h chỉ 3.2 giây
                </p>
              </div>
              <div
                className={`${styles.card} ${hoveredCard === "safety" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("safety")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>An toàn toàn diện</h3>
                <p className={styles.cardDescription}>
                  Driving Assistant Professional, 5 sao Euro NCAP, 8 túi khí
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandExperience;
