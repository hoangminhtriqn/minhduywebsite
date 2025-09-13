import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { authService } from "@/api/services/user/auth";
import { toast } from "react-toastify";
import { useSettings } from "@/contexts/SettingsContext";
import styles from "./styles.module.scss";
import { RegisterData } from "@/api/types";
import { ROUTERS } from "@/utils/constant";
import {
  USERNAME_ALLOWED_CHARS_REGEX,
  EMAIL_REGEX,
  PHONE_VN_REGEX,
  getPasswordRules,
} from "@/utils/validation";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EnvironmentOutlined,
  LockOutlined,
} from "@ant-design/icons";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { settings } = useSettings();
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

    // Username validation
    if (formData.UserName.length < 3) {
      toast.error("Tên đăng nhập phải có ít nhất 3 ký tự.");
      return;
    }
    if (formData.UserName.length > 32) {
      toast.error("Tên đăng nhập tối đa 32 ký tự.");
      return;
    }
    if (!USERNAME_ALLOWED_CHARS_REGEX.test(formData.UserName)) {
      toast.error(
        "Chỉ cho phép chữ, số, dấu chấm (.), gạch dưới (_) và gạch nối (-) cho tên đăng nhập."
      );
      return;
    }

    // Basic Email format validation (shared)
    if (!EMAIL_REGEX.test(formData.Email)) {
      toast.error("Email không hợp lệ.");
      return;
    }

    // Basic Phone number validation (shared VN pattern)
    if (!PHONE_VN_REGEX.test(formData.Phone)) {
      toast.error("Số điện thoại không hợp lệ.");
      return;
    }

    // Password minimum length validation (shared default min 6)
    const pwdRules = getPasswordRules();
    const minRule = pwdRules.find((r) => "min" in r) as
      | { min?: number; message?: string }
      | undefined;
    if (minRule?.min && formData.Password.length < minRule.min) {
      toast.error(
        minRule.message || `Mật khẩu phải có ít nhất ${minRule.min} ký tự.`
      );
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
    } catch (error: unknown) {
      // Xử lý lỗi từ server response
      let errorMessage = "Có lỗi xảy ra khi đăng ký";

      if (error && typeof error === "object" && "response" in error) {
        // Lỗi từ server với response
        const apiError = error as ApiError;
        const serverResponse = apiError.response?.data;
        if (serverResponse && serverResponse.message) {
          errorMessage = serverResponse.message;
        } else if (apiError.response?.status === 400) {
          errorMessage = "Dữ liệu không hợp lệ";
        } else if (apiError.response?.status === 409) {
          errorMessage = "Tên đăng nhập hoặc email đã tồn tại";
        } else if (apiError.response?.status === 500) {
          errorMessage = "Lỗi server, vui lòng thử lại sau";
        }
      } else if (error && typeof error === "object" && "message" in error) {
        // Lỗi từ network hoặc axios
        errorMessage =
          (error as ApiError).message || "Có lỗi xảy ra khi đăng ký";
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
            src={settings?.logo}
            alt="Minh Duy Logo"
            className={styles["register__logo-image"]}
          />
          <h1 className={styles["register__logo-text"]}>MINH DUY</h1>
        </div>
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
                maxLength={32}
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
