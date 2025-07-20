import React from "react";
import { useNavigate } from "react-router-dom";

import PageBanner from "@/components/PageBanner";
import useScrollToTop from "@/hooks/useScrollToTop";
import { ROUTERS } from "@/utils/constant";
import { CheckCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";

import styles from "./styles.module.scss";

const ServicePage: React.FC = () => {
  // Use scroll to top hook
  useScrollToTop();

  // Navigation hook
  const navigate = useNavigate();

  // Locations data with isMainAddress property
  const locations = [
    {
      id: 1,
      name: "MINH DUY - Đà Nẵng",
      address: "Số 132 Lê Duẩn, Đống Đa, Hà Nội",
      coordinates: "15.566762797033958,108.47919866217119",
      mapUrl: "https://maps.app.goo.gl/tjX4cmFR9nJFaur58",
      isMainAddress: true,
    },
    {
      id: 2,
      name: "MINH DUY - Hồ Chí Minh",
      address: "Số 456 Nguyễn Huệ, Quận 1, TP.HCM",
      coordinates: "10.123456,106.123456",
      mapUrl: "https://maps.app.goo.gl/example2",
      isMainAddress: false,
    },
    {
      id: 3,
      name: "MINH DUY - Hà Nội",
      address: "Số 789 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
      coordinates: "21.123456,105.123456",
      mapUrl: "https://maps.app.goo.gl/example3",
      isMainAddress: false,
    },
  ];

  // Get main address for map
  const mainAddress = locations.find((location) => location.isMainAddress);

  return (
    <div className={styles["service-page"]}>
      <PageBanner
        title="DỊCH VỤ SỮA CHỮA, LẮP ĐẶT VÀ THI CÔNG"
        subtitle="Chúng tôi cung cấp dịch vụ sửa chữa, lắp đặt và thi công với đội ngũ kỹ thuật viên dày dặn kinh nghiệm và thiết bị tốt nhất."
      />

      <div className={styles["service-overview__container"]}>
        <div className={styles["service-overview__row"]}>
          <div className={styles["service-overview__col"]}>
            <img
              src="/images/service_overview.jpg"
              alt="BMW Service"
              className={styles["service-overview__image"]}
            />
          </div>
          <div className={styles["service-overview__col"]}>
            <h2 className={styles["service-overview__heading"]}>
              Lý do nên chọn dịch vụ của chúng tôi?
            </h2>
            <p className={styles["service-overview__description"]}>
              Với kinh nghiệm và sự chuyên môn cao, chúng tôi cam kết mang đến
              cho bạn trải nghiệm dịch vụ tốt nhất, cung cấp dịch vụ sửa chữa,
              lắp đặt và thi công với đội ngũ kỹ thuật viên dày dặn kinh nghiệm
              và thiết bị tốt nhất.
            </p>
            <div className={styles["service-overview__highlights"]}>
              <div className={styles["service-overview__highlights__col"]}>
                <div className={styles["service-overview__highlight-item"]}>
                  <CheckCircleOutlined
                    className={styles["service-overview__highlight-icon"]}
                  />
                  <span>Tư vấn hoàn toàn miễn phí</span>
                </div>
                <div className={styles["service-overview__highlight-item"]}>
                  <CheckCircleOutlined
                    className={styles["service-overview__highlight-icon"]}
                  />
                  <span>Bảo hành dịch vụ toàn quốc</span>
                </div>
              </div>
              <div className={styles["service-overview__highlights__col"]}>
                <div className={styles["service-overview__highlight-item"]}>
                  <CheckCircleOutlined
                    className={styles["service-overview__highlight-icon"]}
                  />
                  <span>Đội ngũ kỹ thuật viên dày dặn kinh nghiệm</span>
                </div>
                <div className={styles["service-overview__highlight-item"]}>
                  <CheckCircleOutlined
                    className={styles["service-overview__highlight-icon"]}
                  />
                  <span>Cam kết bảo hành bảo trì nhanh chóng</span>
                </div>
              </div>
            </div>
            <div className={styles["service-overview__cta"]}>
              <button
                onClick={() => navigate(ROUTERS.USER.BOOKING)}
                className={`${styles["service-overview__btn"]} btn btn--primary`}
              >
                Đặt lịch tư vấn ngay
              </button>
            </div>
          </div>
        </div>

        <h2 className="section-title">CÁC DỊCH VỤ CỦA CHÚNG TÔI</h2>
        <div className={styles["service-categories__row"]}>
          <div className={styles["service-card"]}>
            <div className={styles["service-card__header"]}>
              <div className={styles["service-card__icon"]}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1995/1995515.png"
                  alt="Bảo dưỡng"
                />
              </div>
              <h3 className={styles["service-card__title"]}>
                Bảo Dưỡng Định Kỳ
              </h3>
            </div>
            <p className={styles["service-card__description"]}>
              Thực hiện kiểm tra và bảo dưỡng theo định kỳ để đảm bảo xe luôn
              vận hành ổn định và an toàn.
            </p>
          </div>

          <div className={`${styles["service-card"]} ${styles.featured}`}>
            <div className={styles["service-card__header"]}>
              <div className={styles["service-card__icon"]}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1995/1995516.png"
                  alt="Sửa chữa"
                />
              </div>
              <h3 className={styles["service-card__title"]}>
                Sửa Chữa & Đồng Sơn
              </h3>
            </div>
            <p className={styles["service-card__description"]}>
              Khắc phục các hư hỏng, làm mới ngoại hình xe với quy trình sửa
              chữa và sơn tiêu chuẩn BMW.
            </p>
          </div>

          <div className={styles["service-card"]}>
            <div className={styles["service-card__header"]}>
              <div className={styles["service-card__icon"]}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1995/1995517.png"
                  alt="Nâng cấp"
                />
              </div>
              <h3 className={styles["service-card__title"]}>
                Nâng Cấp Hiệu Suất
              </h3>
            </div>
            <p className={styles["service-card__description"]}>
              Cải thiện sức mạnh và khả năng vận hành của xe với các gói nâng
              cấp chính hãng.
            </p>
          </div>
        </div>

        <h2 className="section-title">ĐỊA ĐIỂM KINH DOANH</h2>
        <div className={styles["service-locations__row"]}>
          {/* Location Cards */}
          <div className={styles["location-cards"]}>
            {locations.map((location) => (
              <div key={location.id} className={styles["location-card"]}>
                <div className={styles["location-card__info"]}>
                  <h3 className={styles["location-card__name"]}>
                    {location.name}
                  </h3>
                  <p className={styles["location-card__address"]}>
                    <EnvironmentOutlined />
                    {location.address}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <div className={styles["location-map"]}>
            <iframe
              src={`https://maps.google.com/maps?q=${mainAddress?.coordinates}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`MINH DUY - ${mainAddress?.name}`}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
