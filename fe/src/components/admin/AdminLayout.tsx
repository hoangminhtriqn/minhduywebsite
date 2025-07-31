import {
  CalendarOutlined,
  CarryOutOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Dropdown, Layout, Menu, Space } from "antd";
import React, { useEffect, useState } from "react";

import ThemeController from "@/components/ThemeController";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTERS } from "@/utils/constant";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css"; // Import CSS module

const { Header, Content, Footer, Sider } = Layout;

const isMobile = () => window.innerWidth < 992;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileState, setIsMobileState] = useState(isMobile());

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setCollapsed(true);
        setShowOverlay(false);
        setIsMobileState(true);
      } else {
        setCollapsed(false);
        setShowOverlay(false);
        setIsMobileState(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileState) {
      if (!collapsed) {
        setShowOverlay(true);
      } else {
        setShowOverlay(false);
      }
    } else {
      setShowOverlay(false);
    }
  }, [collapsed, isMobileState]);

  const handleLogout = () => {
    logout();
    navigate(ROUTERS.USER.LOGIN);
  };

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      handleLogout();
    }
  };

  // Determine selected menu key based on current path
  const getSelectedKey = () => {
    const path = location.pathname;

    // List of admin routes that correspond to menu keys
    const adminRoutes = [
      ROUTERS.ADMIN.PRODUCTS,
      ROUTERS.ADMIN.BOOKINGS,
      ROUTERS.ADMIN.USERS,
      ROUTERS.ADMIN.CATEGORIES,
      ROUTERS.ADMIN.SERVICES,
      ROUTERS.ADMIN.NEWS,
      ROUTERS.ADMIN.SETTINGS,
      ROUTERS.ADMIN.DASHBOARD,
      ROUTERS.ADMIN.PRICE_LIST,
    ];

    // Find all routes that are a prefix of the current path
    const matchingKeys = adminRoutes.filter(
      (route) => route && path.startsWith(route)
    );

    // If there are matches, return the longest one (most specific)
    if (matchingKeys.length > 0) {
      return matchingKeys.reduce((a, b) => (a.length > b.length ? a : b));
    }

    return ROUTERS.ADMIN.DASHBOARD; // Default to dashboard
  };

  // Menu items configuration using new items API
  const menuItems = [
    {
      key: ROUTERS.ADMIN.DASHBOARD,
      icon: <DashboardOutlined />,
      label: <Link to={ROUTERS.ADMIN.DASHBOARD}>Thống kê</Link>,
    },
    {
      key: ROUTERS.ADMIN.USERS,
      icon: <TeamOutlined />,
      label: <Link to={ROUTERS.ADMIN.USERS}>Người dùng</Link>,
    },
    {
      key: ROUTERS.ADMIN.CATEGORIES,
      icon: <TagsOutlined />,
      label: <Link to={ROUTERS.ADMIN.CATEGORIES}>Danh mục</Link>,
    },
    {
      key: ROUTERS.ADMIN.PRODUCTS,
      icon: <ProfileOutlined />,
      label: <Link to={ROUTERS.ADMIN.PRODUCTS}>Sản phẩm</Link>,
    },
    {
      key: ROUTERS.ADMIN.BOOKINGS,
      icon: <CarryOutOutlined />,
      label: <Link to={ROUTERS.ADMIN.BOOKINGS}>Đặt lịch</Link>,
    },

    {
      key: ROUTERS.ADMIN.SERVICES,
      icon: <DashboardOutlined />,
      label: <Link to={ROUTERS.ADMIN.SERVICES}>Dịch vụ</Link>,
    },
    {
      key: ROUTERS.ADMIN.PRICE_LIST,
      icon: <CalendarOutlined />,
      label: <Link to={ROUTERS.ADMIN.PRICE_LIST}>Bảng giá</Link>,
    },
    {
      key: ROUTERS.ADMIN.NEWS,
      icon: <FileTextOutlined />,
      label: <Link to={ROUTERS.ADMIN.NEWS}>Tin tức</Link>,
    },
    {
      key: ROUTERS.ADMIN.SETTINGS,
      icon: <SettingOutlined />,
      label: <Link to={ROUTERS.ADMIN.SETTINGS}>Cài đặt</Link>,
    },
  ];

  return (
    <Layout className={styles.adminLayout}>
      {(!isMobileState || (isMobileState && !collapsed)) && (
        <Sider
          collapsible
          collapsed={isMobileState ? collapsed : false}
          onCollapse={setCollapsed}
          className={styles.adminSidebar}
          trigger={null}
          width={isMobileState ? 280 : 280}
          collapsedWidth={isMobileState ? 0 : 80}
          style={
            isMobileState
              ? {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  height: "100vh",
                  zIndex: 1100,
                  transition: "left 0.3s",
                  boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
                }
              : {}
          }
        >
          <div
            className={styles.adminLogo}
            style={{ alignItems: "center", gap: 18 }}
            onClick={() => navigate(ROUTERS.USER.HOME)}
          >
            <img src="/images/logo.png" alt="Logo" className={styles.logoImg} />
            {!collapsed && <span className={styles.logoText}>Minh Duy</span>}
          </div>
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            className={styles.adminMenu}
            items={menuItems}
          />
        </Sider>
      )}
      {showOverlay && isMobileState && !collapsed && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 1000,
          }}
          onClick={() => setCollapsed(true)}
        />
      )}
      <Layout
        className={`${styles.adminContentLayout} ${collapsed ? styles.collapsed : ""}`}
      >
        <Header className={styles.adminHeader}>
          <div className={styles.headerLeft}>
            {/* Luôn hiển thị icon menu trigger khi sidebar collapsed */}
            {collapsed && (
              <div
                className={styles.mobileMenuTrigger}
                onClick={() => setCollapsed(false)}
              >
                <MenuUnfoldOutlined />
              </div>
            )}
          </div>
          <div className={styles.headerUser}>
            {user && (
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleMenuClick }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  className={styles.userDropdownLink}
                >
                  <Space>
                    <div className={styles.userAvatar}>
                      <UserOutlined />
                    </div>
                    <span className={styles.userName}>{user.UserName}</span>
                  </Space>
                </a>
              </Dropdown>
            )}
          </div>
        </Header>
        <Content className={styles.adminContent}>{children}</Content>
        <Footer className={styles.adminFooter}>
          <div className={styles.footerContent}>
            © {new Date().getFullYear()} - Sản phẩm thuộc về Minh Duy - Đà Nẵng
          </div>
        </Footer>
      </Layout>
      <ThemeController />
    </Layout>
  );
};

export default AdminLayout;
