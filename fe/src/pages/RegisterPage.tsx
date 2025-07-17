import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { authService } from "../api/services/auth";
import { toast } from "react-toastify";
import styles from "./RegisterPage.module.scss";
import { RegisterData } from "../api/types";
import { ROUTERS } from "../utils/constant";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EnvironmentOutlined,
  LockOutlined,
} from "@ant-design/icons";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    Phone: "",
    FullName: "",
    Address: "",
    Password: "",
    ConfirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend Validation
    if (
      !formData.UserName ||
      !formData.Email ||
      !formData.Phone ||
      !formData.Password ||
      !formData.ConfirmPassword
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin các trường bắt buộc.");
      return;
    }

    // Basic Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.Email)) {
      toast.error("Email không hợp lệ.");
      return;
    }

    // Basic Phone number validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.Phone)) {
      toast.error("Số điện thoại không hợp lệ (chỉ chấp nhận 10 chữ số).");
      return;
    }

    // Password minimum length validation (matching backend schema if possible)
    if (formData.Password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    // Confirm Password validation (existing logic, improved message)
    if (formData.Password !== formData.ConfirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp với mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      // Construct registerData with required and optionally provided fields
      const registerData = {
        UserName: formData.UserName,
        Email: formData.Email,
        Phone: formData.Phone,
        Password: formData.Password,
        // Include FullName and Address if they are present in the form data
        ...(formData.FullName && { FullName: formData.FullName }),
        ...(formData.Address && { Address: formData.Address }),
        Role: "user",
        Status: "active",
      };

      // Type assertion to inform TypeScript about the structure
      const dataToSend: RegisterData = registerData as RegisterData;

      const user = await authService.register(dataToSend);

      // Validate that user object exists and has required properties
      if (!user || !user._id) {
        throw new Error("Dữ liệu người dùng không hợp lệ từ server");
      }

      dispatch(setUser(user));
      toast.success("Đăng ký thành công!");
      navigate("/");
    } catch (error: any) {
      // Xử lý lỗi từ server response
      let errorMessage = "Có lỗi xảy ra khi đăng ký";

      if (error.response) {
        // Lỗi từ server với response
        const serverResponse = error.response.data;
        if (serverResponse && serverResponse.message) {
          errorMessage = serverResponse.message;
        } else if (error.response.status === 400) {
          errorMessage = "Dữ liệu không hợp lệ";
        } else if (error.response.status === 409) {
          errorMessage = "Tên đăng nhập hoặc email đã tồn tại";
        } else if (error.response.status === 500) {
          errorMessage = "Lỗi server, vui lòng thử lại sau";
        }
      } else if (error.message) {
        // Lỗi từ network hoặc axios
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.register}>
      <div className={styles.register__container}>
        {/* Logo Section */}
        <div className={styles.register__logo}>
          <img
            src="/images/logo.png"
            alt="BMW Logo"
            className={styles["register__logo-image"]}
          />
          <h1 className={styles["register__logo-text"]}>BMW</h1>
        </div>

        <h2 className={styles.register__title}>Đăng ký tài khoản mới</h2>
        <form onSubmit={handleSubmit} className={styles.register__form}>
          {/* Tên đăng nhập */}
          <div className={styles["register__form-group"]}>
            <label htmlFor="username" className="sr-only">
              Tên đăng nhập
            </label>
            <div className={styles["register__input-group"]}>
              <div className={styles["register__input-group-icon"]}>
                <UserOutlined />
              </div>
              <input
                type="text"
                id="username"
                name="UserName"
                value={formData.UserName}
                onChange={handleInputChange}
                required
                placeholder="Tên đăng nhập"
                className={styles.register__input}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Email */}
          <div className={styles["register__form-group"]}>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className={styles["register__input-group"]}>
              <div className={styles["register__input-group-icon"]}>
                <MailOutlined />
              </div>
              <input
                type="email"
                id="email"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
                required
                placeholder="Email"
                className={styles.register__input}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className={styles["register__form-group"]}>
            <label htmlFor="phone" className="sr-only">
              Số điện thoại
            </label>
            <div className={styles["register__input-group"]}>
              <div className={styles["register__input-group-icon"]}>
                <PhoneOutlined />
              </div>
              <input
                type="tel"
                id="phone"
                name="Phone"
                value={formData.Phone}
                onChange={handleInputChange}
                required
                placeholder="Số điện thoại"
                className={styles.register__input}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Họ và tên */}
          <div className={styles["register__form-group"]}>
            <label htmlFor="fullName" className="sr-only">
              Họ và tên
            </label>
            <div className={styles["register__input-group"]}>
              <div className={styles["register__input-group-icon"]}>
                <IdcardOutlined />
              </div>
              <input
                type="text"
                id="fullName"
                name="FullName"
                value={formData.FullName}
                onChange={handleInputChange}
                placeholder="Họ và tên (không bắt buộc)"
                className={styles.register__input}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div className={styles["register__form-group"]}>
            <label htmlFor="address" className="sr-only">
              Địa chỉ
            </label>
            <div className={styles["register__input-group"]}>
              <div className={styles["register__input-group-icon"]}>
                <EnvironmentOutlined />
              </div>
              <input
                type="text"
                id="address"
                name="Address"
                value={formData.Address}
                onChange={handleInputChange}
                placeholder="Địa chỉ (không bắt buộc)"
                className={styles.register__input}
                autoComplete="address-line1"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div className={styles["register__form-group"]}>
            <label htmlFor="password" className="sr-only">
              Mật khẩu
            </label>
            <div className={styles["register__input-group"]}>
              <div className={styles["register__input-group-icon"]}>
                <LockOutlined />
              </div>
              <input
                type="password"
                id="password"
                name="Password"
                value={formData.Password}
                onChange={handleInputChange}
                required
                placeholder="Mật khẩu"
                className={styles.register__input}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className={styles["register__form-group"]}>
            <label htmlFor="confirmPassword" className="sr-only">
              Xác nhận mật khẩu
            </label>
            <div className={styles["register__input-group"]}>
              <div className={styles["register__input-group-icon"]}>
                <LockOutlined />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="ConfirmPassword"
                value={formData.ConfirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Xác nhận mật khẩu"
                className={styles.register__input}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className={styles["register__form-group"]}>
            <button
              type="submit"
              disabled={loading}
              className={styles.register__button}
              aria-label={loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </div>
        </form>
        <p className={styles["register__login-text"]}>
          Đã có tài khoản?{" "}
          <Link to={ROUTERS.USER.LOGIN} className={styles.register__login_link}>
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
