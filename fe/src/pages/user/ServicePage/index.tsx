import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBanner from "@/components/PageBanner";

import { ROUTERS } from "@/utils/constant";
import { CheckCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import ServiceCard from "./ServiceCard";
import { useSettings } from "@/contexts/SettingsContext";
import { serviceApi } from "@/api/services/user/service";
import styles from "./styles.module.scss";

interface Service {
  _id: string;
  icon: string;
  title: string;
  description: string;
  isFeatured: boolean;
}

const ServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { locations } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await serviceApi.getAllServices();
        setServices(response.data || []);
      } catch (err) {
        setError("Không thể tải danh sách dịch vụ.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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
              alt="Minh Duy Service"
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
                  <span>Đội ngũ kỹ thuật nhiều kinh nghiệm</span>
                </div>
                <div className={styles["service-overview__highlight-item"]}>
                  <CheckCircleOutlined
                    className={styles["service-overview__highlight-icon"]}
                  />
                  <span>Cam kết bảo trì nhanh chóng</span>
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
          {loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            services.map((service) => (
              <ServiceCard
                key={service._id}
                icon={service.icon}
                title={service.title}
                description={service.description}
                isFeatured={service.isFeatured}
              />
            ))
          )}
        </div>

        <h2 className="section-title">ĐỊA ĐIỂM KINH DOANH</h2>
        <div className={styles["service-locations__row"]}>
          <div className={styles["location-cards"]}>
            {locations.map((location) => (
              <div
                key={location._id || location.id}
                className={styles["location-card"]}
              >
                <div className={styles["location-card__info"]}>
                  <h3 className={styles["location-card__name"]}>
                    {location.name}
                  </h3>
                  <p className={styles["location-card__address"]}>
                    <EnvironmentOutlined />
                    {location.address}
                  </p>
                  {location.description && (
                    <p className={styles["location-card__description"]}>
                      {location.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

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
