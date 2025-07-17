import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTERS } from "../utils/constant";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <div className="registration-page">
      <div className="registration-page__container">
        <div className="registration-page__card">
          <h4 className="registration-page__card-title">Đăng Ký Tài Khoản</h4>

          <form className="registration-page__form" onSubmit={handleSubmit}>
            <div className="registration-page__form-group">
              <label htmlFor="fullName" className="registration-page__label">
                Họ và tên *
              </label>
              <div className="registration-page__input-group">
                <span className="registration-page__input-group-text">
                  <UserOutlined />
                </span>
                <input
                  type="text"
                  className="registration-page__input"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="registration-page__form-group">
              <label htmlFor="email" className="registration-page__label">
                Email *
              </label>
              <div className="registration-page__input-group">
                <span className="registration-page__input-group-text">
                  <MailOutlined />
                </span>
                <input
                  type="email"
                  className="registration-page__input"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="registration-page__form-group">
              <label htmlFor="phone" className="registration-page__label">
                Số điện thoại *
              </label>
              <div className="registration-page__input-group">
                <span className="registration-page__input-group-text">
                  <PhoneOutlined />
                </span>
                <input
                  type="tel"
                  className="registration-page__input"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="registration-page__form-group">
              <label htmlFor="password" className="registration-page__label">
                Mật khẩu *
              </label>
              <div className="registration-page__input-group">
                <span className="registration-page__input-group-text">
                  <LockOutlined />
                </span>
                <input
                  type="password"
                  className="registration-page__input"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="registration-page__form-group">
              <label
                htmlFor="confirmPassword"
                className="registration-page__label"
              >
                Xác nhận mật khẩu *
              </label>
              <div className="registration-page__input-group">
                <span className="registration-page__input-group-text">
                  <LockOutlined />
                </span>
                <input
                  type="password"
                  className="registration-page__input"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="registration-page__form-group registration-page__form-check">
              <input
                type="checkbox"
                className="registration-page__check-input"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
              />
              <label
                htmlFor="agreeToTerms"
                className="registration-page__check-label"
              >
                Tôi đồng ý với{" "}
                <Link to="/terms" className="registration-page__terms-link">
                  điều khoản và điều kiện
                </Link>
              </label>
            </div>

            <div className="registration-page__actions">
              <button type="submit" className="registration-page__btn-submit">
                Đăng ký
              </button>
            </div>
          </form>

          <p className="registration-page__login-text">
            Đã có tài khoản?{" "}
            <Link
              to={ROUTERS.USER.LOGIN}
              className="registration-page__login-link"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
