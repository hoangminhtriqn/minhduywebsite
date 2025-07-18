import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  MenuOutlined,
  CloseOutlined,
  HeartOutlined,
  HomeOutlined,
  CarOutlined,
  SettingOutlined,
  DollarOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Space, Avatar, Badge } from "antd";
import { ROUTERS } from "@/utils/constant";

// Hàm chuyển hex sang rgba
function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  if (c.length !== 6) return hex;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { favoritesCount } = useFavorites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSticky, setIsSticky] = useState(false);
  const [isFavoritesHovered, setIsFavoritesHovered] = useState(false);
  const mainBarRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTERS.USER.LOGIN);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleFavoritesHover = () => {
    setIsFavoritesHovered(true);
  };

  const handleFavoritesLeave = () => {
    setIsFavoritesHovered(false);
  };

  // Modern CSS-in-JS Styles with Responsive Design
  const headerStyle: React.CSSProperties = {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    width: "100%",
    background: "transparent",
    pointerEvents: "auto",
  };

  const authBarStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, ${hexToRgba(theme.colors.palette.primaryDark, 0.16)} 0%, ${hexToRgba(theme.colors.palette.primary, 0.16)} 50%, ${hexToRgba(theme.colors.palette.primaryLight, 0.16)} 100%)`,
    color: "#ffffff",
    padding: isMobile ? "3px 0" : "5px 0",
    fontSize: isMobile ? "13px" : "15px",
    width: "100%",
    display: isMobile ? "none" : "block",
    backdropFilter: "blur(32px)",
    WebkitBackdropFilter: "blur(32px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: isSticky ? 0 : 1,
    transform: isSticky ? "translateY(-100%)" : "translateY(0)",
    pointerEvents: isSticky ? "none" : "auto",
    height: isSticky ? 0 : "auto",
    overflow: "hidden",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: isMobile ? "0 15px" : isTablet ? "0 20px" : "0 20px",
  };

  const authContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  };

  const authLinksStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "8px" : "16px",
    flexWrap: "wrap",
  };

  const authLinkStyle: React.CSSProperties = {
    color: "#ffffff",
    textDecoration: "none",
    padding: isMobile ? "4px 8px" : "6px 12px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    fontSize: isMobile ? "13px" : "15px",
    fontWeight: 500,
    whiteSpace: "nowrap",
  };

  const authButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
    padding: isMobile ? "4px 8px" : "6px 12px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    fontSize: isMobile ? "13px" : "15px",
    fontWeight: 500,
    whiteSpace: "nowrap",
  };

  const mainBarStyle: React.CSSProperties = {
    background: isSticky
      ? "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)"
      : "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.7) 100%)",
    backdropFilter: isSticky ? "blur(48px)" : "blur(40px)",
    WebkitBackdropFilter: isSticky ? "blur(48px)" : "blur(40px)",
    padding: isMobile ? "8px 0" : "10px 0",
    width: "100%",
    borderBottom: isSticky
      ? "1px solid rgba(0, 0, 0, 0.06)"
      : "1px solid rgba(0, 0, 0, 0.08)",
    boxShadow: isSticky
      ? "0 12px 40px rgba(0, 0, 0, 0.08)"
      : "0 8px 32px rgba(0, 0, 0, 0.12)",
    display: "block",
    position: isSticky ? "fixed" : "relative",
    top: isSticky ? 0 : "auto",
    zIndex: isSticky ? 1000 : "auto",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: isMobile ? "12px" : "16px",
    width: "100%",
    minHeight: isMobile ? "40px" : "48px",
  };

  const logoStyle: React.CSSProperties = {
    height: "50px",
    width: "auto",
    flexShrink: 0,
    display: "block",
    order: isMobile ? 1 : 1,
  };

  const navStyle: React.CSSProperties = {
    display: isMobile ? "none" : "flex",
    alignItems: "center",
    gap: isTablet ? "12px" : "20px",
    flexShrink: 0,
    justifyContent: "center",
    flex: 1,
    margin: isTablet ? "0 15px" : "0 20px",
    minHeight: isMobile ? "40px" : "48px",
    order: isMobile ? 3 : 2,
  };

  const navLinkStyle: React.CSSProperties = {
    color: theme.colors.text.primary,
    textDecoration: "none",
    fontWeight: 600,
    padding: isTablet ? "8px 12px" : "12px 20px",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    fontSize: isTablet ? "14px" : "16px",
    whiteSpace: "nowrap",
    flexShrink: 0,
    textAlign: "center",
    minWidth: "fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: isMobile ? "40px" : "48px",
    position: "relative",
  };

  const favoritesLinkStyle: React.CSSProperties = {
    position: "relative",
    display: isMobile ? "none" : "flex",
    alignItems: "center",
    color: "#ff4757",
    textDecoration: "none",
    fontSize: isMobile ? "16px" : "18px",
    padding: isMobile ? "8px" : "10px",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    backgroundColor: isFavoritesHovered
      ? "rgba(255, 71, 87, 0.15)"
      : "rgba(255, 255, 255, 0.1)",
    marginRight: isMobile ? "10px" : "15px",
    boxShadow: isFavoritesHovered
      ? "0 4px 15px rgba(255, 71, 87, 0.2)"
      : "0 2px 8px rgba(0, 0, 0, 0.1)",
    transform: isFavoritesHovered ? "scale(1.05)" : "scale(1)",
    order: isMobile ? 2 : 3,
  };

  const favoritesCountStyle: React.CSSProperties = {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    backgroundColor: "#ff4757",
    color: "#ffffff",
    borderRadius: "50%",
    width: isMobile ? "16px" : "18px",
    height: isMobile ? "16px" : "18px",
    fontSize: isMobile ? "9px" : "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    boxShadow: "0 2px 6px rgba(255, 71, 87, 0.3)",
  };

  const mobileMenuButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    color: theme.colors.text.primary,
    fontSize: isMobile ? "18px" : "20px",
    cursor: "pointer",
    padding: "8px",
    display: isMobile ? "block" : "none",
    order: isMobile ? 4 : 4,
  };

  const mobileMenuStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    right: isMobileMenuOpen ? 0 : "-100%",
    width: isMobile ? "260px" : "300px",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
    transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 1001,
    display: "flex",
    flexDirection: "column",
    boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.15)",
  };

  const mobileMenuHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isMobile ? "16px 20px" : "20px 24px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  };

  const mobileMenuCloseStyle: React.CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    border: "none",
    color: theme.colors.text.primary,
    fontSize: isMobile ? "18px" : "20px",
    cursor: "pointer",
    padding: isMobile ? "10px" : "12px",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: isMobile ? "40px" : "44px",
    height: isMobile ? "40px" : "44px",
  };

  const mobileMenuNavStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    padding: isMobile ? "12px 0" : "16px 0",
    flex: 1,
    overflowY: "auto",
  };

  const mobileMenuLinkStyle: React.CSSProperties = {
    color: theme.colors.text.primary,
    textDecoration: "none",
    padding: isMobile ? "14px 20px" : "16px 24px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
    fontSize: isMobile ? "15px" : "16px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "10px" : "12px",
    position: "relative",
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    opacity: isMobileMenuOpen ? 1 : 0,
    visibility: isMobileMenuOpen ? "visible" : "hidden",
    transition: "all 0.3s ease",
  };

  // Event handlers
  const handleAuthLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
  };

  const handleAuthLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = "transparent";
  };

  const handleAuthButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
  };

  const handleAuthButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "transparent";
  };

  const handleNavLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = theme.colors.palette.primary;
    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
  };

  const handleNavLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = theme.colors.text.primary;
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "none";
  };

  const handleMobileLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
    e.currentTarget.style.color = theme.colors.palette.primary;
  };

  const handleMobileLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = theme.colors.text.primary;
  };

  return (
    <div style={headerStyle}>
      {/* AUTH BAR: ẩn/hiện mượt mà */}
      <div style={authBarStyle} data-theme="auth-bar">
        <div style={containerStyle}>
          <div style={authContainerStyle}>
            <div style={authLinksStyle}>
              {user ? (
                <>
                  <Link
                    to={ROUTERS.USER.PROFILE}
                    style={authLinkStyle}
                    onMouseEnter={handleAuthLinkHover}
                    onMouseLeave={handleAuthLinkLeave}
                  >
                    {isMobile ? "Cá nhân" : "Thông tin cá nhân"}
                  </Link>
                  {user.Role === "admin" && (
                    <Link
                      to={ROUTERS.ADMIN.DASHBOARD}
                      style={authLinkStyle}
                      onMouseEnter={handleAuthLinkHover}
                      onMouseLeave={handleAuthLinkLeave}
                    >
                      {isMobile ? "Admin" : "Quản trị"}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    style={authButtonStyle}
                    onMouseEnter={handleAuthButtonHover}
                    onMouseLeave={handleAuthButtonLeave}
                  >
                    {isMobile ? "Đăng xuất" : "Đăng xuất"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTERS.USER.LOGIN}
                    style={authLinkStyle}
                    onMouseEnter={handleAuthLinkHover}
                    onMouseLeave={handleAuthLinkLeave}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to={ROUTERS.USER.REGISTER}
                    style={authLinkStyle}
                    onMouseEnter={handleAuthLinkHover}
                    onMouseLeave={handleAuthLinkLeave}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div ref={mainBarRef} style={mainBarStyle} data-theme="main-bar">
        <div style={containerStyle}>
          <div style={rowStyle}>
            <Link to={ROUTERS.USER.HOME} onClick={closeMobileMenu}>
              <img src="/images/logo.png" alt="Logo" style={logoStyle} />
            </Link>

            <nav style={navStyle}>
              <Link
                to={ROUTERS.USER.HOME}
                style={navLinkStyle}
                onClick={closeMobileMenu}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
                data-theme="nav-link"
              >
                Trang chủ
              </Link>
              <Link
                to={ROUTERS.USER.CARS}
                style={navLinkStyle}
                onClick={closeMobileMenu}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
                data-theme="nav-link"
              >
                Xe thử
              </Link>
              <Link
                to={ROUTERS.USER.SERVICE}
                style={navLinkStyle}
                onClick={closeMobileMenu}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
                data-theme="nav-link"
              >
                Dịch vụ
              </Link>
              <Link
                to={ROUTERS.USER.PRICE_LIST}
                style={navLinkStyle}
                onClick={closeMobileMenu}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
                data-theme="nav-link"
              >
                Bảng giá
              </Link>
              <Link
                to={ROUTERS.USER.NEWS}
                style={navLinkStyle}
                onClick={closeMobileMenu}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
                data-theme="nav-link"
              >
                Tin tức
              </Link>
              <Link
                to={ROUTERS.USER.TEST_DRIVE}
                style={navLinkStyle}
                onClick={closeMobileMenu}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
                data-theme="nav-link"
              >
                {isTablet ? "Lái thử" : "Đăng ký lái thử"}
              </Link>
            </nav>

            {/* Favorites Link */}
            <Link
              to={ROUTERS.USER.FAVORITES}
              style={favoritesLinkStyle}
              onClick={closeMobileMenu}
              onMouseEnter={handleFavoritesHover}
              onMouseLeave={handleFavoritesLeave}
              data-theme="favorites-link"
            >
              <HeartOutlined />
              {favoritesCount > 0 && (
                <span style={favoritesCountStyle} data-theme="favorites-count">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </Link>

            <button style={mobileMenuButtonStyle} onClick={toggleMobileMenu}>
              <MenuOutlined />
            </button>
          </div>
        </div>
      </div>

      <div style={mobileMenuStyle} data-theme="mobile-menu">
        <div style={mobileMenuHeaderStyle}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: theme.colors.text.primary,
            }}
          >
            Danh mục
          </div>
          <button style={mobileMenuCloseStyle} onClick={toggleMobileMenu}>
            <CloseOutlined />
          </button>
        </div>
        <nav style={mobileMenuNavStyle}>
          <Link
            to={ROUTERS.USER.HOME}
            style={mobileMenuLinkStyle}
            onClick={closeMobileMenu}
            onMouseEnter={handleMobileLinkHover}
            onMouseLeave={handleMobileLinkLeave}
            data-theme="mobile-menu-link"
          >
            <HomeOutlined />
            Trang chủ
          </Link>
          <Link
            to={ROUTERS.USER.CARS}
            style={mobileMenuLinkStyle}
            onClick={closeMobileMenu}
            onMouseEnter={handleMobileLinkHover}
            onMouseLeave={handleMobileLinkLeave}
            data-theme="mobile-menu-link"
          >
            <CarOutlined />
            Xe thử
          </Link>
          <Link
            to={ROUTERS.USER.SERVICE}
            style={mobileMenuLinkStyle}
            onClick={closeMobileMenu}
            onMouseEnter={handleMobileLinkHover}
            onMouseLeave={handleMobileLinkLeave}
            data-theme="mobile-menu-link"
          >
            <SettingOutlined />
            Dịch vụ
          </Link>
          <Link
            to={ROUTERS.USER.PRICE_LIST}
            style={mobileMenuLinkStyle}
            onClick={closeMobileMenu}
            onMouseEnter={handleMobileLinkHover}
            onMouseLeave={handleMobileLinkLeave}
            data-theme="mobile-menu-link"
          >
            <DollarOutlined />
            Bảng giá
          </Link>
          <Link
            to={ROUTERS.USER.NEWS}
            style={mobileMenuLinkStyle}
            onClick={closeMobileMenu}
            onMouseEnter={handleMobileLinkHover}
            onMouseLeave={handleMobileLinkLeave}
            data-theme="mobile-menu-link"
          >
            <FileTextOutlined />
            Tin tức
          </Link>
          <Link
            to={ROUTERS.USER.TEST_DRIVE}
            style={mobileMenuLinkStyle}
            onClick={closeMobileMenu}
            onMouseEnter={handleMobileLinkHover}
            onMouseLeave={handleMobileLinkLeave}
            data-theme="mobile-menu-link"
          >
            <CalendarOutlined />
            Đăng ký lái thử
          </Link>
          <Link
            to={ROUTERS.USER.FAVORITES}
            style={{
              ...mobileMenuLinkStyle,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#ff4757",
            }}
            onClick={closeMobileMenu}
            onMouseEnter={handleMobileLinkHover}
            onMouseLeave={handleMobileLinkLeave}
            data-theme="mobile-menu-link"
          >
            <HeartOutlined />
            Yêu thích
            {favoritesCount > 0 && (
              <span
                style={{
                  backgroundColor: "#ff4757",
                  color: "#ffffff",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  marginLeft: "auto",
                }}
              >
                {favoritesCount > 99 ? "99+" : favoritesCount}
              </span>
            )}
          </Link>
        </nav>
        <div
          style={{
            padding: isMobile ? "16px 20px" : "20px 24px",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            backgroundColor: "rgba(248, 249, 250, 0.8)",
          }}
        >
          {user ? (
            <>
              <Link
                to={ROUTERS.USER.PROFILE}
                style={{
                  ...mobileMenuLinkStyle,
                  padding: isMobile ? "10px 0" : "12px 0",
                  borderBottom: "none",
                  color: theme.colors.palette.primary,
                }}
                onClick={closeMobileMenu}
                onMouseEnter={handleMobileLinkHover}
                onMouseLeave={handleMobileLinkLeave}
                data-theme="mobile-menu-link"
              >
                <UserOutlined />
                Thông tin cá nhân
              </Link>
              {user.Role === "admin" && (
                <Link
                  to={ROUTERS.ADMIN.DASHBOARD}
                  style={{
                    ...mobileMenuLinkStyle,
                    padding: isMobile ? "10px 0" : "12px 0",
                    borderBottom: "none",
                    color: theme.colors.palette.primary,
                  }}
                  onClick={closeMobileMenu}
                  onMouseEnter={handleMobileLinkHover}
                  onMouseLeave={handleMobileLinkLeave}
                  data-theme="mobile-menu-link"
                >
                  <SettingOutlined />
                  Quản trị
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{
                  ...mobileMenuLinkStyle,
                  padding: isMobile ? "10px 0" : "12px 0",
                  borderBottom: "none",
                  width: "100%",
                  textAlign: "left",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#dc3545",
                }}
                onMouseEnter={handleAuthButtonHover}
                onMouseLeave={handleAuthButtonLeave}
                data-theme="mobile-menu-link"
              >
                <LogoutOutlined />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTERS.USER.LOGIN}
                style={{
                  ...mobileMenuLinkStyle,
                  padding: isMobile ? "10px 0" : "12px 0",
                  borderBottom: "none",
                  color: theme.colors.palette.primary,
                }}
                onClick={closeMobileMenu}
                onMouseEnter={handleMobileLinkHover}
                onMouseLeave={handleMobileLinkLeave}
                data-theme="mobile-menu-link"
              >
                <LoginOutlined />
                Đăng nhập
              </Link>
              <Link
                to={ROUTERS.USER.REGISTER}
                style={{
                  ...mobileMenuLinkStyle,
                  padding: isMobile ? "10px 0" : "12px 0",
                  borderBottom: "none",
                  color: theme.colors.palette.primary,
                }}
                onClick={closeMobileMenu}
                onMouseEnter={handleMobileLinkHover}
                onMouseLeave={handleMobileLinkLeave}
                data-theme="mobile-menu-link"
              >
                <UserAddOutlined />
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          style={overlayStyle}
          onClick={toggleMobileMenu}
          data-theme="overlay"
        ></div>
      )}
    </div>
  );
};

export default Header;
