import React, { useState, useEffect } from "react";

import {
  ToolOutlined,
  EyeOutlined,
  PhoneOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CarOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Row, Col, Card, Typography, Spin, Empty, Button } from "antd";
import { useNavigate } from "react-router-dom";
import PageBanner from "@/components/PageBanner";
import useScrollToTop from "@/hooks/useScrollToTop";
import styles from "./ServicePage.module.scss";
import axios from "axios";
import { message } from "antd";
import { API_BASE_URL } from "@/api/config";
import moment from "moment"; // Import moment for potential date handling if needed
import { Service } from "@/api/types";
import { ROUTERS } from "@/utils/constant";
import { formatCurrency } from "@/utils/format";

const ServicePage: React.FC = () => {
  // Use scroll to top hook
  useScrollToTop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    FullName: "",
    Phone: "",
    Email: "",
    CarModel: "",
    AppointmentDate: "",
    AppointmentTime: "",
    ServiceType: "",
    Notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form when closing modal
    setFormData({
      FullName: "",
      Phone: "",
      Email: "",
      CarModel: "",
      AppointmentDate: "",
      AppointmentTime: "",
      ServiceType: "",
      Notes: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Enhanced validation with specific error messages
    const errors: string[] = [];

    if (!formData.FullName.trim()) {
      errors.push("Họ và tên không được để trống");
    } else if (formData.FullName.trim().length < 2) {
      errors.push("Họ và tên phải có ít nhất 2 ký tự");
    }

    if (!formData.Phone.trim()) {
      errors.push("Số điện thoại không được để trống");
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.Phone.trim())) {
      errors.push("Số điện thoại không hợp lệ");
    }

    if (!formData.Email.trim()) {
      errors.push("Email không được để trống");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email.trim())) {
      errors.push("Email không hợp lệ");
    }

    if (!formData.CarModel) {
      errors.push("Vui lòng chọn mẫu xe");
    }

    if (!formData.AppointmentDate) {
      errors.push("Vui lòng chọn ngày đặt lịch");
    } else {
      const selectedDate = new Date(formData.AppointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.push("Ngày đặt lịch không thể là ngày trong quá khứ");
      }
    }

    if (!formData.AppointmentTime) {
      errors.push("Vui lòng chọn thời gian đặt lịch");
    }

    if (!formData.ServiceType) {
      errors.push("Vui lòng chọn loại dịch vụ");
    }

    // Show all validation errors
    if (errors.length > 0) {
      errors.forEach((error) => {
        message.error(error);
      });
      return;
    }

    try {
      // Show loading message
      const loadingMessage = message.loading("Đang gửi yêu cầu đặt lịch...", 0);

      const dataToSend = {
        ...formData,
        FullName: formData.FullName.trim(),
        Phone: formData.Phone.trim(),
        Email: formData.Email.trim(),
      };

      const response = await axios.post(
        `${API_BASE_URL}/service-requests`,
        dataToSend
      );

      // Close loading message
      loadingMessage();

      if (response.data.success) {
        message.success({
          content:
            "Yêu cầu đặt lịch đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
          duration: 5,
        });

        // Reset form fields and close modal
        setFormData({
          FullName: "",
          Phone: "",
          Email: "",
          CarModel: "",
          AppointmentDate: "",
          AppointmentTime: "",
          ServiceType: "",
          Notes: "",
        });
        closeModal();
      } else {
        // Handle specific error messages from backend if any
        message.error(
          response.data.message || "Đã xảy ra lỗi khi gửi yêu cầu đặt lịch."
        );
      }
    } catch (error: any) {
      console.error("Error submitting service request:", error);

      // Handle different types of errors
      if (error.response?.status === 400) {
        message.error(
          "Thông tin không hợp lệ. Vui lòng kiểm tra lại các trường thông tin."
        );
      } else if (error.response?.status === 409) {
        message.error(
          "Đã có lịch hẹn cho thời gian này. Vui lòng chọn thời gian khác."
        );
      } else if (error.response?.status === 500) {
        message.error("Lỗi hệ thống. Vui lòng thử lại sau.");
      } else if (error.code === "NETWORK_ERROR") {
        message.error(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet."
        );
      } else {
        message.error(
          error.response?.data?.message ||
            error.message ||
            "Đã xảy ra lỗi khi gửi yêu cầu đặt lịch."
        );
      }
    }
  };

  return (
    <div className={styles["service-page"]}>
      <PageBanner
        title="DỊCH VỤ BẢO DƯỠNG VÀ SỬA CHỮA CHUYÊN NGHIỆP"
        subtitle="Chăm sóc toàn diện cho chiếc BMW của bạn với đội ngũ kỹ thuật viên hàng đầu và phụ tùng chính hãng."
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
              TẠI SAO CHỌN DỊCH VỤ BMW?
            </h2>
            <p className={styles["service-overview__description"]}>
              Với kinh nghiệm và sự chuyên môn cao, chúng tôi cam kết mang đến
              cho bạn trải nghiệm dịch vụ tốt nhất, giúp chiếc xe của bạn luôn
              hoạt động trong tình trạng hoàn hảo.
            </p>
            <div className={styles["service-overview__highlights"]}>
              <div className={styles["service-overview__highlight-item"]}>
                <FaCheckCircle
                  className={styles["service-overview__highlight-icon"]}
                />
                <span>Phụ tùng chính hãng 100%</span>
              </div>
              <div className={styles["service-overview__highlight-item"]}>
                <FaCheckCircle
                  className={styles["service-overview__highlight-icon"]}
                />
                <span>Bảo hành dịch vụ toàn quốc</span>
              </div>
              <div className={styles["service-overview__highlight-item"]}>
                <FaCheckCircle
                  className={styles["service-overview__highlight-icon"]}
                />
                <span>Kỹ thuật viên được đào tạo tại Đức</span>
              </div>
              <div className={styles["service-overview__highlight-item"]}>
                <FaCheckCircle
                  className={styles["service-overview__highlight-icon"]}
                />
                <span>Công nghệ chẩn đoán hiện đại</span>
              </div>
            </div>
            <div className={styles["service-overview__cta"]}>
              <button
                onClick={openModal}
                className={`${styles["service-overview__btn"]} btn btn--primary`}
              >
                Đặt lịch dịch vụ ngay
              </button>
            </div>
          </div>
        </div>

        <h2 className="section-title">CÁC GÓI DỊCH VỤ NỔI BẬT</h2>
        <div className={styles["service-categories__row"]}>
          <div className={styles["service-card"]}>
            <div className={styles["service-card__icon"]}>
              <ToolOutlined />
            </div>
            <h3 className={styles["service-card__title"]}>Bảo Dưỡng Định Kỳ</h3>
            <p className={styles["service-card__description"]}>
              Thực hiện kiểm tra và bảo dưỡng theo định kỳ để đảm bảo xe luôn
              vận hành ổn định và an toàn.
            </p>
          </div>

          <div className={`${styles["service-card"]} ${styles.featured}`}>
            <div className={styles["service-card__badge"]}>Phổ biến</div>
            <div className={styles["service-card__icon"]}>
              <CarOutlined />
            </div>
            <h3 className={styles["service-card__title"]}>
              Sửa Chữa & Đồng Sơn
            </h3>
            <p className={styles["service-card__description"]}>
              Khắc phục các hư hỏng, làm mới ngoại hình xe với quy trình sửa
              chữa và sơn tiêu chuẩn BMW.
            </p>
          </div>

          <div className={styles["service-card"]}>
            <div className={styles["service-card__icon"]}>
              <DashboardOutlined />
            </div>
            <h3 className={styles["service-card__title"]}>
              Nâng Cấp Hiệu Suất
            </h3>
            <p className={styles["service-card__description"]}>
              Cải thiện sức mạnh và khả năng vận hành của xe với các gói nâng
              cấp chính hãng.
            </p>
          </div>
        </div>

        <h2 className="section-title">CÁC GÓI BẢO DƯỠNG ĐỊNH KỲ</h2>
        <div className={styles["service-packages__row"]}>
          {/* Basic Package */}
          <div className={styles["package-card"]}>
            <div className={styles["package-card__header"]}>
              <h3 className={styles["package-card__title"]}>Gói Cơ Bản</h3>
              <span className={styles["package-card__price"]}>Liên hệ</span>
            </div>
            <div className={styles["package-card__body"]}>
              <ul className={styles["package-card__features"]}>
                <li>
                  <FaCheckCircle /> Thay dầu động cơ
                </li>
                <li>
                  <FaCheckCircle /> Thay lọc dầu
                </li>
                <li>
                  <FaCheckCircle /> Kiểm tra 20 điểm an toàn
                </li>
                <li>
                  <FaCheckCircle /> Cập nhật phần mềm cơ bản
                </li>
                <li>
                  <FaCheckCircle /> Vệ sinh nội thất cơ bản
                </li>
                <li className={styles["package-card__features--unavailable"]}>
                  Thay lọc gió điều hòa
                </li>
                <li className={styles["package-card__features--unavailable"]}>
                  Thay lọc gió động cơ
                </li>
                <li className={styles["package-card__features--unavailable"]}>
                  Vệ sinh kim phun
                </li>
              </ul>
              <a href="#" className={styles["package-card__btn"]}>
                Chọn gói
              </a>
            </div>
          </div>

          {/* Standard Package */}
          <div className={`${styles["package-card"]} ${styles.featured}`}>
            <div className={styles["package-card__header"]}>
              <h3 className={styles["package-card__title"]}>Gói Tiêu Chuẩn</h3>
              <span className={styles["package-card__price"]}>Liên hệ</span>
            </div>
            <div className={styles["package-card__body"]}>
              <ul className={styles["package-card__features"]}>
                <li>
                  <FaCheckCircle /> Thay dầu động cơ
                </li>
                <li>
                  <FaCheckCircle /> Thay lọc dầu
                </li>
                <li>
                  <FaCheckCircle /> Kiểm tra 30 điểm an toàn
                </li>
                <li>
                  <FaCheckCircle /> Cập nhật phần mềm đầy đủ
                </li>
                <li>
                  <FaCheckCircle /> Vệ sinh nội thất toàn diện
                </li>
                <li>
                  <FaCheckCircle /> Thay lọc gió điều hòa
                </li>
                <li>
                  <FaCheckCircle /> Thay lọc gió động cơ
                </li>
                <li className={styles["package-card__features--unavailable"]}>
                  Vệ sinh kim phun
                </li>
              </ul>
              <a href="#" className={styles["package-card__btn"]}>
                Chọn gói
              </a>
            </div>
          </div>

          {/* Premium Package */}
          <div className={styles["package-card"]}>
            <div className={styles["package-card__header"]}>
              <h3 className={styles["package-card__title"]}>Gói Cao Cấp</h3>
              <span className={styles["package-card__price"]}>Liên hệ</span>
            </div>
            <div className={styles["package-card__body"]}>
              <ul className={styles["package-card__features"]}>
                <li>
                  <FaCheckCircle /> Thay dầu động cơ cao cấp
                </li>
                <li>
                  <FaCheckCircle /> Thay lọc dầu
                </li>
                <li>
                  <FaCheckCircle /> Kiểm tra 40 điểm an toàn
                </li>
                <li>
                  <FaCheckCircle /> Cập nhật phần mềm đầy đủ
                </li>
                <li>
                  <FaCheckCircle /> Vệ sinh nội thất chuyên sâu
                </li>
                <li>
                  <FaCheckCircle /> Thay lọc gió điều hòa
                </li>
                <li>
                  <FaCheckCircle /> Thay lọc gió động cơ
                </li>
                <li>
                  <FaCheckCircle /> Vệ sinh kim phun
                </li>
              </ul>
              <a href="#" className={styles["package-card__btn"]}>
                Chọn gói
              </a>
            </div>
          </div>
        </div>

        <h2 className="section-title">TRUNG TÂM DỊCH VỤ BMW</h2>
        <div className={styles["service-locations__row"]}>
          {/* Location Card 1 */}
          <div className={styles["location-card"]}>
            <div className={styles["location-card__info"]}>
              <h3 className={styles["location-card__name"]}>
                BMW Service Hà Nội
              </h3>
              <p className={styles["location-card__address"]}>
                <EnvironmentOutlined />
                Số 132 Lê Duẩn, Đống Đa, Hà Nội
              </p>
              <p className={styles["location-card__phone"]}>
                <PhoneOutlined />
                024.3333.7777
              </p>
              <p className={styles["location-card__hours"]}>
                <ClockCircleOutlined />
                Thứ 2 - Thứ 7: 8:00 - 17:30
              </p>
            </div>
            <a href="#" className={styles["location-card__btn"]}>
              Xem bản đồ
            </a>
          </div>

          {/* Location Card 2 */}
          <div className={styles["location-card"]}>
            <div className={styles["location-card__info"]}>
              <h3 className={styles["location-card__name"]}>
                BMW Service Hồ Chí Minh
              </h3>
              <p className={styles["location-card__address"]}>
                <EnvironmentOutlined />
                Số 245 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
              </p>
              <p className={styles["location-card__phone"]}>
                <PhoneOutlined />
                028.3333.7777
              </p>
              <p className={styles["location-card__hours"]}>
                <ClockCircleOutlined />
                Thứ 2 - Thứ 7: 8:00 - 17:30
              </p>
            </div>
            <a href="#" className={styles["location-card__btn"]}>
              Xem bản đồ
            </a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles["modal-overlay"]} onClick={closeModal}>
          <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h2 className={styles["modal-title"]}>ĐẶT LỊCH DỊCH VỤ</h2>
              <button
                className={styles["modal-close"]}
                onClick={closeModal}
                aria-label="Đóng"
              >
                <CloseOutlined />
              </button>
            </div>
            <div className={styles["modal-body"]}>
              <p className={styles["modal-subtitle"]}>
                Điền thông tin để đặt lịch dịch vụ tại trung tâm BMW gần nhất
              </p>
              <form
                className={`${styles["booking-form__form"]} booking-form__form`}
                onSubmit={handleSubmit}
              >
                <div
                  className={`${styles["booking-form__row"]} booking-form__row`}
                >
                  <div
                    className={`${styles["booking-form__col"]} booking-form__col`}
                  >
                    <label
                      htmlFor="fullName"
                      className={`${styles["booking-form__label"]} booking-form__label`}
                    >
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="FullName"
                      className={`${styles["booking-form__input"]} booking-form__input`}
                      placeholder="Nhập họ và tên"
                      value={formData.FullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div
                    className={`${styles["booking-form__col"]} booking-form__col`}
                  >
                    <label
                      htmlFor="phoneNumber"
                      className={`${styles["booking-form__label"]} booking-form__label`}
                    >
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      id="Phone"
                      className={`${styles["booking-form__input"]} booking-form__input`}
                      placeholder="Nhập số điện thoại"
                      value={formData.Phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div
                  className={`${styles["booking-form__row"]} booking-form__row`}
                >
                  <div
                    className={`${styles["booking-form__col"]} booking-form__col`}
                  >
                    <label
                      htmlFor="email"
                      className={`${styles["booking-form__label"]} booking-form__label`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="Email"
                      className={`${styles["booking-form__input"]} booking-form__input`}
                      placeholder="Nhập email"
                      value={formData.Email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div
                    className={`${styles["booking-form__col"]} booking-form__col`}
                  >
                    <label
                      htmlFor="carModel"
                      className={`${styles["booking-form__label"]} booking-form__label`}
                    >
                      Mẫu xe
                    </label>
                    <select
                      id="CarModel"
                      className={`${styles["booking-form__select"]} booking-form__select`}
                      value={formData.CarModel}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn mẫu xe</option>
                      <option value="BMW 3 Series">BMW 3 Series</option>
                      <option value="BMW 5 Series">BMW 5 Series</option>
                      <option value="BMW X3">BMW X3</option>
                      <option value="BMW X5">BMW X5</option>
                      <option value="Other">Khác</option>
                    </select>
                  </div>
                </div>

                <div
                  className={`${styles["booking-form__row"]} booking-form__row`}
                >
                  <div
                    className={`${styles["booking-form__col"]} booking-form__col`}
                  >
                    <label
                      htmlFor="bookingDate"
                      className={`${styles["booking-form__label"]} booking-form__label`}
                    >
                      Ngày đặt lịch
                    </label>
                    <input
                      type="date"
                      id="AppointmentDate"
                      className={`${styles["booking-form__input"]} booking-form__input`}
                      placeholder="mm/dd/yyyy"
                      value={formData.AppointmentDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div
                    className={`${styles["booking-form__col"]} booking-form__col`}
                  >
                    <label
                      htmlFor="bookingTime"
                      className={`${styles["booking-form__label"]} booking-form__label`}
                    >
                      Thời gian
                    </label>
                    <select
                      id="AppointmentTime"
                      className={`${styles["booking-form__select"]} booking-form__select`}
                      value={formData.AppointmentTime}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn thời gian</option>
                      <option value="08:00">08:00</option>
                      <option value="10:00">10:00</option>
                      <option value="13:00">13:00</option>
                      <option value="15:00">15:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </div>
                </div>

                <div
                  className={`${styles["booking-form__row"]} booking-form__row ${styles["booking-form__full-width"]}`}
                >
                  <div
                    className={`${styles["booking-form__col"]} booking-form__col`}
                  >
                    <label
                      htmlFor="serviceType"
                      className={`${styles["booking-form__label"]} booking-form__label`}
                    >
                      Loại dịch vụ
                    </label>
                    <select
                      id="ServiceType"
                      className={`${styles["booking-form__select"]} booking-form__select`}
                      value={formData.ServiceType}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn loại dịch vụ</option>
                      <option value="Bảo dưỡng định kỳ">
                        Bảo dưỡng định kỳ
                      </option>
                      <option value="Sửa chữa">Sửa chữa</option>
                      <option value="Đồng sơn">Đồng sơn</option>
                      <option value="Nâng cấp hiệu suất">
                        Nâng cấp hiệu suất
                      </option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div
                  className={`${styles["booking-form__row"]} booking-form__row ${styles["booking-form__full-width"]}`}
                >
                  <div
                    className={`${styles["booking-form__col"]} booking-form__col`}
                  >
                    <label
                      htmlFor="notes"
                      className={`${styles["booking-form__label"]} booking-form__label`}
                    >
                      Ghi chú (Tùy chọn)
                    </label>
                    <textarea
                      id="Notes"
                      className={`${styles["booking-form__textarea"]} booking-form__textarea`}
                      rows={4}
                      value={formData.Notes}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>

                <div
                  className={`${styles["booking-form__actions"]} booking-form__actions`}
                >
                  <button
                    type="button"
                    onClick={closeModal}
                    className={`${styles["booking-form__btn-cancel"]} booking-form__btn-cancel btn btn--secondary`}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={`${styles["booking-form__btn-submit"]} booking-form__btn-submit btn btn--primary`}
                  >
                    Đặt lịch ngay
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
