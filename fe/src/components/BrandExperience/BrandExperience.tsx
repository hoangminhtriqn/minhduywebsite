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
            <h2 className={styles.title}>KHÁM PHÁ GIÁ TRỊ MINH DUY</h2>
            <p className={styles.description}>
              Trải nghiệm dịch vụ thiết bị công nghệ chuyên nghiệp với giải pháp
              toàn diện và chất lượng hàng đầu. Từ thiết bị văn phòng đến hệ
              thống công nghệ cao, Minh Duy mang đến sự hoàn hảo trong từng sản
              phẩm. Khám phá ngay bộ sưu tập thiết bị công nghệ đỉnh cao của
              chúng tôi.
            </p>

            <div className={styles.cardsGrid}>
              <div
                className={`${styles.card} ${hoveredCard === "innovation" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("innovation")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>Giải pháp</h3>
                <p className={styles.cardDescription}>
                  Hệ thống quản lý thông minh, tự động hóa, kết nối IoT và trí
                  tuệ nhân tạo
                </p>
              </div>
              <div
                className={`${styles.card} ${hoveredCard === "quality" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("quality")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>Thiết bị hiện đại</h3>
                <p className={styles.cardDescription}>
                  Công nghệ tiên tiến, thiết kế tối ưu, hiệu suất cao và tiết
                  kiệm năng lượng
                </p>
              </div>
              <div
                className={`${styles.card} ${hoveredCard === "performance" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("performance")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>Dịch vụ</h3>
                <p className={styles.cardDescription}>
                  Tư vấn tận tâm, lắp đặt chuyên nghiệp, bảo hành toàn diện và
                  hỗ trợ 24/7
                </p>
              </div>
              <div
                className={`${styles.card} ${hoveredCard === "safety" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("safety")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>Hỗ trợ toàn diện</h3>
                <p className={styles.cardDescription}>
                  Bảo trì định kỳ, cập nhật phần mềm, đào tạo sử dụng và khắc
                  phục sự cố nhanh chóng
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
