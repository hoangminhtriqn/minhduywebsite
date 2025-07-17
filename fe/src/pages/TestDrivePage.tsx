import { message } from "antd";
import axios from "axios";
import { useState } from "react";
import {
  FaCar,
  FaComments,
  FaEdit,
  FaPhone,
  FaRoute,
  FaUserTie,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import useScrollToTop from "../hooks/useScrollToTop";

const TestDrivePage = () => {
  // Use scroll to top hook
  useScrollToTop();

  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Phone: "",
    Address: "", // Thay City thành Address
    CarModel: "",
    TestDriveDate: "", // Thay PreferredDate thành TestDriveDate
    TestDriveTime: "", // Thay PreferredTime thành TestDriveTime
    Notes: "",
    privacyPolicy: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.FullName ||
      !formData.Email ||
      !formData.Phone ||
      !formData.Address ||
      !formData.CarModel ||
      !formData.TestDriveDate ||
      !formData.TestDriveTime ||
      !formData.privacyPolicy
    ) {
      message.error(
        "Vui lòng điền đầy đủ thông tin bắt buộc và đồng ý với chính sách bảo mật."
      );
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      message.error("Vui lòng nhập địa chỉ email hợp lệ.");
      return false;
    }

    // Validate phone number format (Vietnamese phone numbers)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.Phone)) {
      message.error("Vui lòng nhập số điện thoại hợp lệ.");
      return false;
    }

    // Validate test drive date is not in the past
    const selectedDate = new Date(formData.TestDriveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      message.error("Ngày lái thử không được trong quá khứ.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Gộp TestDriveDate và TestDriveTime thành Test_Drive_Date
      const testDriveDateTime = new Date(
        `${formData.TestDriveDate}T${formData.TestDriveTime}:00`
      );

      const dataToSend = {
        // Thông tin người đăng ký
        FullName: formData.FullName,
        Email: formData.Email,
        Phone: formData.Phone,

        // Thông tin đặt lịch
        Test_Drive_Date: testDriveDateTime.toISOString(),
        CarModel: formData.CarModel,
        Address: formData.Address,
        Notes: formData.Notes || "",

        // Thông tin hệ thống
        Order_Date: new Date().toISOString(),
        Status: "pending", // Trạng thái mặc định khi tạo mới
        Total_Amount: 0, // Lái thử miễn phí

        // Các trường bắt buộc từ backend schema
        UserID: localStorage.getItem("userId") || "000000000000000000000000", // Lấy UserID từ localStorage
      };

      const response = await axios.post(
        `${API_BASE_URL}/lich-lai-thu`,
        dataToSend
      );
      message.success("Đăng ký lái thử thành công!");

      // Reset form after successful submission
      setFormData({
        FullName: "",
        Email: "",
        Phone: "",
        Address: "",
        CarModel: "",
        TestDriveDate: "",
        TestDriveTime: "",
        Notes: "",
        privacyPolicy: false,
      });
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi đăng ký lái thử. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="test-drive-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="page-banner__container">
          <h1 className="page-banner__title">ĐẶT HẸN LÁI THỬ</h1>
        </div>
      </section>

      {/* Test Drive Form Section */}
      <section className="test-drive-section">
        <div className="test-drive-section__container">
          <div className="test-drive-section__row">
            <div className="test-drive-section__col">
              <div className="test-drive-info">
                <h2 className="test-drive-info__heading">
                  TRẢI NGHIỆM CẢM GIÁC LÁI BMW
                </h2>
                <p className="test-drive-info__description">
                  Đăng ký lái thử xe BMW ngay hôm nay để trải nghiệm cảm giác
                  lái đỉnh cao cùng công nghệ tiên tiến và thiết kế sang trọng
                  của BMW.
                </p>
                <p className="test-drive-info__description">
                  Đội ngũ tư vấn viên chuyên nghiệp sẽ hướng dẫn bạn chi tiết về
                  các tính năng và ưu điểm của mẫu xe bạn quan tâm, đồng thời
                  giải đáp mọi thắc mắc.
                </p>

                <div className="test-drive-info__benefits-header">
                  <h3 className="test-drive-info__benefits-title">
                    3 Ưu Điểm Nổi Bật
                  </h3>
                  <p className="test-drive-info__benefits-subtitle">
                    Những lợi ích bạn sẽ nhận được khi lái thử BMW
                  </p>
                </div>

                <div className="test-drive-info__benefits">
                  <div className="test-drive-info__benefit-item">
                    <div className="test-drive-info__benefit-number">1</div>
                    <div className="test-drive-info__benefit-icon">
                      <FaCar />
                    </div>
                    <div className="test-drive-info__benefit-content">
                      <h3 className="test-drive-info__benefit-title">
                        Trải nghiệm thực tế
                      </h3>
                      <p className="test-drive-info__benefit-description">
                        Cảm nhận trực tiếp hiệu suất và công nghệ của BMW trong
                        điều kiện thực tế trên đường.
                      </p>
                    </div>
                  </div>

                  <div className="test-drive-info__benefit-item">
                    <div className="test-drive-info__benefit-number">2</div>
                    <div className="test-drive-info__benefit-icon">
                      <FaUserTie />
                    </div>
                    <div className="test-drive-info__benefit-content">
                      <h3 className="test-drive-info__benefit-title">
                        Tư vấn chuyên nghiệp
                      </h3>
                      <p className="test-drive-info__benefit-description">
                        Đội ngũ chuyên gia BMW sẵn sàng cung cấp thông tin chi
                        tiết và hỗ trợ bạn lựa chọn xe phù hợp.
                      </p>
                    </div>
                  </div>

                  <div className="test-drive-info__benefit-item">
                    <div className="test-drive-info__benefit-number">3</div>
                    <div className="test-drive-info__benefit-icon">
                      <FaRoute />
                    </div>
                    <div className="test-drive-info__benefit-content">
                      <h3 className="test-drive-info__benefit-title">
                        Lộ trình linh hoạt
                      </h3>
                      <p className="test-drive-info__benefit-description">
                        Tùy chỉnh lộ trình lái thử để trải nghiệm xe trong các
                        điều kiện đường xá khác nhau.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="test-drive-section__col">
              <div className="test-drive-form">
                <h3 className="test-drive-form__title">ĐĂNG KÝ LÁI THỬ</h3>
                <form className="test-drive-form__form" onSubmit={handleSubmit}>
                  <div className="test-drive-form__group">
                    <label
                      htmlFor="FullName"
                      className="test-drive-form__label"
                    >
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      className="test-drive-form__input"
                      id="FullName"
                      name="FullName"
                      value={formData.FullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="test-drive-form__group">
                    <label htmlFor="Email" className="test-drive-form__label">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="test-drive-form__input"
                      id="Email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="test-drive-form__group">
                    <label htmlFor="Phone" className="test-drive-form__label">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      className="test-drive-form__input"
                      id="Phone"
                      name="Phone"
                      value={formData.Phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="test-drive-form__group">
                    <label htmlFor="Address" className="test-drive-form__label">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      className="test-drive-form__input"
                      id="Address"
                      name="Address"
                      value={formData.Address}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập địa chỉ cụ thể (tỉnh/thành phố, quận/huyện, ...)"
                    />
                  </div>

                  <div className="test-drive-form__group">
                    <label
                      htmlFor="CarModel"
                      className="test-drive-form__label"
                    >
                      Mẫu xe quan tâm *
                    </label>
                    <select
                      className="test-drive-form__select"
                      id="CarModel"
                      name="CarModel"
                      value={formData.CarModel}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Chọn mẫu xe
                      </option>
                      <option value="BMW 3 Series">BMW 3 Series</option>
                      <option value="BMW 5 Series">BMW 5 Series</option>
                      <option value="BMW 7 Series">BMW 7 Series</option>
                      <option value="BMW X3">BMW X3</option>
                      <option value="BMW X5">BMW X5</option>
                      <option value="BMW X7">BMW X7</option>
                      <option value="BMW i4">BMW i4</option>
                      <option value="BMW i7">BMW i7</option>
                      <option value="BMW iX">BMW iX</option>
                    </select>
                  </div>

                  <div className="test-drive-form__group">
                    <label
                      htmlFor="TestDriveDate"
                      className="test-drive-form__label"
                    >
                      Ngày lái thử mong muốn *
                    </label>
                    <input
                      type="date"
                      className="test-drive-form__input"
                      id="TestDriveDate"
                      name="TestDriveDate"
                      value={formData.TestDriveDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split("T")[0]} // Chỉ cho phép chọn từ ngày hiện tại trở đi
                    />
                  </div>

                  <div className="test-drive-form__group">
                    <label
                      htmlFor="TestDriveTime"
                      className="test-drive-form__label"
                    >
                      Thời gian lái thử mong muốn *
                    </label>
                    <select
                      className="test-drive-form__select"
                      id="TestDriveTime"
                      name="TestDriveTime"
                      value={formData.TestDriveTime}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Chọn thời gian
                      </option>
                      <option value="09:00">Sáng (9:00)</option>
                      <option value="11:00">Sáng (11:00)</option>
                      <option value="13:00">Chiều (13:00)</option>
                      <option value="15:00">Chiều (15:00)</option>
                      <option value="18:00">Tối (18:00)</option>
                    </select>
                  </div>

                  <div className="test-drive-form__group">
                    <label htmlFor="Notes" className="test-drive-form__label">
                      Ghi chú
                    </label>
                    <textarea
                      className="test-drive-form__textarea"
                      id="Notes"
                      name="Notes"
                      rows={3}
                      value={formData.Notes}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="test-drive-form__group test-drive-form__check-group">
                    <input
                      type="checkbox"
                      className="test-drive-form__check-input"
                      id="privacyPolicy"
                      name="privacyPolicy"
                      checked={formData.privacyPolicy}
                      onChange={handleInputChange}
                      required
                    />
                    <label
                      className="test-drive-form__check-label"
                      htmlFor="privacyPolicy"
                    >
                      Tôi đồng ý với{" "}
                      <Link
                        to="/privacy"
                        className="test-drive-form__privacy-link"
                      >
                        chính sách bảo mật
                      </Link>{" "}
                      của BMW Vietnam
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="test-drive-form__btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? "Đang gửi..." : "Đăng ký lái thử"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Drive Process */}
      <section className="test-drive-process">
        <div className="test-drive-process__container">
          <div className="test-drive-process__header">
            <h2 className="test-drive-process__title">Quy trình lái thử BMW</h2>
            <p className="test-drive-process__subtitle">
              4 bước đơn giản để trải nghiệm xe BMW của bạn
            </p>
          </div>

          <div className="test-drive-process__grid">
            <div className="test-drive-process__card">
              <div className="test-drive-process__card-number">1</div>
              <div className="test-drive-process__card-icon">
                <FaEdit />
              </div>
              <h3 className="test-drive-process__card-title">Đăng ký online</h3>
              <p className="test-drive-process__card-description">
                Điền thông tin cá nhân và chọn mẫu xe BMW bạn muốn trải nghiệm
              </p>
            </div>

            <div className="test-drive-process__card">
              <div className="test-drive-process__card-number">2</div>
              <div className="test-drive-process__card-icon">
                <FaPhone />
              </div>
              <h3 className="test-drive-process__card-title">
                Xác nhận lịch hẹn
              </h3>
              <p className="test-drive-process__card-description">
                Nhân viên BMW sẽ liên hệ xác nhận và sắp xếp lịch phù hợp
              </p>
            </div>

            <div className="test-drive-process__card">
              <div className="test-drive-process__card-number">3</div>
              <div className="test-drive-process__card-icon">
                <FaCar />
              </div>
              <h3 className="test-drive-process__card-title">
                Trải nghiệm lái thử
              </h3>
              <p className="test-drive-process__card-description">
                Đến showroom và trải nghiệm cảm giác lái BMW thực tế
              </p>
            </div>

            <div className="test-drive-process__card">
              <div className="test-drive-process__card-number">4</div>
              <div className="test-drive-process__card-icon">
                <FaComments />
              </div>
              <h3 className="test-drive-process__card-title">Tư vấn mua xe</h3>
              <p className="test-drive-process__card-description">
                Nhận tư vấn về xe và các chương trình ưu đãi từ BMW
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestDrivePage;
