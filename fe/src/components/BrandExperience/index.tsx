import React, { useState } from "react";
import styles from "./style.module.scss";

const BrandExperience: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const repairSteps = [
    {
      id: "booking",
      title: "Nhận đặt lịch",
      description: "Khách hàng đặt lịch sửa chữa qua website hoặc hotline",
    },
    {
      id: "consultation",
      title: "Tiếp nhận và tư vấn",
      description: "Đội ngũ kỹ thuật viên tiếp nhận và tư vấn chi tiết",
    },
    {
      id: "repair",
      title: "Sửa chữa",
      description: "Thực hiện sửa chữa với quy trình chuyên nghiệp",
    },
    {
      id: "warranty",
      title: "Bảo hành",
      description: "Cam kết bảo hành và hỗ trợ sau sửa chữa",
    },
  ];

  return (
    <section className={styles.brandExperience}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <h2 className={styles.title}>Quy trình sửa chữa</h2>
            <p className={styles.description}>
              Trải nghiệm dịch vụ sửa chữa thiết bị công nghệ trực tuyến với quy
              trình chuyên nghiệp và tiện lợi. Từ đặt lịch đến bảo hành, chúng
              tôi đảm bảo mọi bước đều được thực hiện một cách hoàn hảo.
            </p>

            <div className={styles.stepsContainer}>
              {repairSteps.map((step, index) => (
                <div key={step.id} className={styles.step}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.textSection}>
            <h2 className={styles.title}>Về chúng tôi</h2>
            <p className={styles.description}>
              Là một công ty Công nghệ hàng đầu với với nhiều năm kinh nghiệm
              trong lĩnh vực cung cấp, phân phối, lắp đặt và sửa chữa các thiết
              bị điện tử văn phòng.
            </p>

            <div className={styles.cardsGrid}>
              <div
                className={`${styles.card} ${hoveredCard === "innovation" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("innovation")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>Thiết bị văn phòng</h3>
                <p className={styles.cardDescription}>
                  Máy vi tính laptop và PC, máy in, máy photo copy, máy chấm
                  công, máy đếm tiền, camera, thiết bị ngoại vi và các dòng máy
                  phục vụ văn phòng
                </p>
              </div>
              <div
                className={`${styles.card} ${hoveredCard === "quality" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("quality")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>Hệ thống mạng & IT</h3>
                <p className={styles.cardDescription}>
                  Thiết bị mạng internet, server, trung tâm điều khiển IT, cáp
                  quang, tổng đài điện thoại và các giải pháp kết nối chuyên
                  nghiệp
                </p>
              </div>
              <div
                className={`${styles.card} ${hoveredCard === "performance" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("performance")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>Điện & Tự động hóa</h3>
                <p className={styles.cardDescription}>
                  Điện dân dụng, điện thông minh, nhà thông minh, điện đèn năng
                  lượng, thiết bị hẹn giờ, cảm biến chiếu sáng tự động
                </p>
              </div>
              <div
                className={`${styles.card} ${hoveredCard === "safety" ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredCard("safety")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className={styles.cardTitle}>An ninh & Bảo vệ</h3>
                <p className={styles.cardDescription}>
                  Hệ thống báo động, báo cháy, chống sét, camera giám sát và các
                  giải pháp an ninh toàn diện cho doanh nghiệp
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
