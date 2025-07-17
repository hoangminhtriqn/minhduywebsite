import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { ROUTERS } from "../utils/constant";
import styles from "./LoginPage.module.scss"; // Import SCSS module
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  // Get login function and loading state from AuthContext
  const { login, loading } = useAuth();

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
      // Call login function from AuthContext
      await login(formData.UserNameOrEmail, formData.Password);
      navigate(ROUTERS.USER.HOME); // Navigate after successful login
    } catch (error: any) {
      // Error message is already handled in AuthContext, just show it
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__container}>
        {/* Logo Section */}
        <div className={styles.login__logo}>
          <img
            src="/images/logo.png"
            alt="BMW Logo"
            className={styles["login__logo-image"]}
          />
          <h1 className={styles["login__logo-text"]}>BMW</h1>
        </div>

        <h2 className={styles.login__title}>Đăng nhập</h2>
        {/* You can add an Alert component here for displaying errors if needed */}
        {/* {error && <div className="alert alert-danger">{error}</div>} */}

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
        <p className={styles["login__register-text"]}>
          Chưa có tài khoản?{" "}
          <Link to={ROUTERS.USER.REGISTER}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
