import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { authService } from "@/api/services/auth";
import { Button, Dropdown, Space, Avatar } from "antd";
import styles from "./Header.module.css"; // Import CSS module
import { ROUTERS } from "@/utils/constant";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSearchOpen(false); // Close search when opening mobile menu
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMobileMenuOpen(false); // Close mobile menu when opening search
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <div className={styles.headerLogo}>
          <Link to="/">
            <img
              src="/images/logo.png"
              alt="Minh Duy Logo"
              className={styles.headerLogoImage}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.headerNavDesktop}>
          <Link to={ROUTERS.USER.CARS} className={styles.headerNavLink}>
            Thiết bị
          </Link>
          <Link to={ROUTERS.USER.PRICE_LIST} className={styles.headerNavLink}>
            Bảng giá
          </Link>
          <Link to={ROUTERS.USER.SERVICE} className={styles.headerNavLink}>
            Dịch vụ
          </Link>
          <Link to={ROUTERS.USER.TEST_DRIVE} className={styles.headerNavLink}>
            Tư vấn
          </Link>
          <Link to={ROUTERS.USER.NEWS} className={styles.headerNavLink}>
            Tin tức
          </Link>
        </nav>

        {/* Actions (Search, Auth/Profile) */}
        <div className={styles.headerActions}>
          {/* Search Toggle Button (Visible on Desktop/Tablet) */}
          <button onClick={toggleSearch} className={styles.headerSearchToggle}>
            <FaSearch />
          </button>

          {/* Search Input (Visible when toggled) */}
          {isSearchOpen && (
            <div className={styles.headerSearchInputContainer}>
              <input
                type="text"
                placeholder="Tìm kiếm thiết bị..."
                className={styles.headerSearchBox}
              />
              <FaSearch className={styles.headerSearchButton} />
            </div>
          )}

          {/* Auth/Profile Links */}
          <div className={styles.headerAuth}>
            {user ? (
              <div className={styles.headerProfile}>
                <Link
                  to={ROUTERS.USER.PROFILE}
                  className={styles.headerNavLink}
                >
                  {user.UserName}
                </Link>
                <button onClick={handleLogout} className={styles.headerNavLink}>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className={styles.headerAuthLinks}>
                <Link to={ROUTERS.USER.LOGIN} className={styles.headerNavLink}>
                  Đăng nhập
                </Link>
                <Link
                  to={ROUTERS.USER.REGISTER}
                  className={styles.headerNavLink}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={styles.headerMobileMenuButton}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Visible when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className={styles.headerMobileMenu}>
          <div className={styles.headerMobileMenuHeader}>
            {/* Logo or Close Button */}
            <button
              onClick={toggleMobileMenu}
              className={styles.headerMobileMenuCloseButton}
            >
              <FaTimes />
            </button>
          </div>
          <nav className={styles.headerMobileMenuNav}>
            <Link
              to={ROUTERS.USER.CARS}
              className={styles.headerMobileNavLink}
              onClick={toggleMobileMenu}
            >
              Thiết bị
            </Link>
            <Link
              to={ROUTERS.USER.PRICE_LIST}
              className={styles.headerMobileNavLink}
              onClick={toggleMobileMenu}
            >
              Bảng giá
            </Link>
            <Link
              to={ROUTERS.USER.SERVICE}
              className={styles.headerMobileNavLink}
              onClick={toggleMobileMenu}
            >
              Dịch vụ
            </Link>
            <Link
              to={ROUTERS.USER.TEST_DRIVE}
              className={styles.headerMobileNavLink}
              onClick={toggleMobileMenu}
            >
              Tư vấn
            </Link>
            <Link
              to={ROUTERS.USER.NEWS}
              className={styles.headerMobileNavLink}
              onClick={toggleMobileMenu}
            >
              Tin tức
            </Link>

            {/* Auth/Profile Links for Mobile */}
            {user ? (
              <>
                <Link
                  to={ROUTERS.USER.PROFILE}
                  className={styles.headerMobileNavLink}
                  onClick={toggleMobileMenu}
                >
                  {user.UserName}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className={styles.headerMobileNavLink}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTERS.USER.LOGIN}
                  className={styles.headerMobileNavLink}
                  onClick={toggleMobileMenu}
                >
                  Đăng nhập
                </Link>
                <Link
                  to={ROUTERS.USER.REGISTER}
                  className={styles.headerMobileNavLink}
                  onClick={toggleMobileMenu}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
