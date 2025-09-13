import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { useSettings } from "@/contexts/SettingsContext";
import { ROUTERS } from "@/utils/constant";
import styles from "./styles.module.scss"; // Import SCSS module
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  // Get login function and loading state from AuthContext
  const { login, googleLogin, loading } = useAuth();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    UserNameOrEmail: "",
    Password: "",
    rememberMe: false, // Added remember me state
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend Validation
    if (!formData.UserNameOrEmail || !formData.Password) {
      toast.error("Vui lòng điền đầy đủ Tên đăng nhập hoặc Email và Mật khẩu.");
      return;
    }

    try {
      // Call login function from AuthContext and get redirect path
      const redirectPath = await login(
        formData.UserNameOrEmail,
        formData.Password
      );
      navigate(redirectPath); // Navigate to the appropriate page based on user role
    } catch (error: unknown) {
      // Display error message from the backend
      const errorMessage =
        error instanceof Error ? error.message : "Đăng nhập thất bại";
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      // Redirect sẽ được xử lý tự động bởi Google OAuth flow
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Đăng nhập Google thất bại";
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__container}>
        {/* Logo Section */}
        <div className={styles.login__logo}>
          <img
            src={settings?.logo}
            alt="Minh Duy Logo"
            className={styles["login__logo-image"]}
          />
          <h1 className={styles["login__logo-text"]}>MINH DUY</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.login__form}>
          <div className={styles["login__form-group"]}>
            {/* Visually hidden label */}
            <label htmlFor="usernameOrEmail" className="sr-only">
              Tên đăng nhập hoặc Email
            </label>
            <div className={styles["login__input-group"]}>
              {/* Icon for username/email field */}
              <div className={styles["login__input-group-icon"]}>
                <UserOutlined />
              </div>
              <input
                type="text"
                id="usernameOrEmail"
                name="UserNameOrEmail"
                value={formData.UserNameOrEmail}
                onChange={handleInputChange}
                required
                placeholder="Tên đăng nhập hoặc Email"
                className={styles.login__input}
                autoComplete="username"
              />
            </div>
          </div>

          <div className={styles["login__form-group"]}>
            {/* Visually hidden label */}
            <label htmlFor="password" className="sr-only">
              Mật khẩu
            </label>
            <div className={styles["login__input-group"]}>
              {/* Icon for password field */}
              <div className={styles["login__input-group-icon"]}>
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
                className={styles.login__input}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className={styles.login__options}>
            <div className={styles["login__form-check"]}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className={styles["login__form-check-input"]}
              />
              <label
                htmlFor="rememberMe"
                className={styles["login__form-check-label"]}
              >
                Ghi nhớ đăng nhập
              </label>
            </div>
            {/* Add Forgot Password Link */}
            <Link
              to="/forgot-password"
              className={styles["login__forgot-password-link"]}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div className={styles["login__form-group"]}>
            <button
              type="submit"
              disabled={loading}
              className={styles.login__button}
              aria-label={loading ? "Đang đăng nhập..." : "Đăng nhập"}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>
        </form>

        {/* Google Login Button */}
        <div
          className={`${styles["login__form-group"]} ${styles["login__google-group"]}`}
        >
          <button
            type="button"
            className={styles.login__google_button}
            onClick={handleGoogleLogin}
            disabled={loading}
            aria-label="Đăng nhập bằng Google"
          >
            <svg
              className={styles["login__google-icon"]}
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Đăng nhập bằng Google
          </button>
        </div>

        <p className={styles["login__register-text"]}>
          Chưa có tài khoản?{" "}
          <Link to={ROUTERS.USER.REGISTER}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
