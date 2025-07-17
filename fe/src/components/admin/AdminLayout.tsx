import {
  CarryOutOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu, Space } from "antd";
import React, { useEffect, useState } from "react";
import { FaCar } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTERS } from "../../utils/constant";
import ThemeController from "../ThemeController";
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
    if (path.startsWith("/admin/products")) return "products";
    if (path.startsWith("/admin/orders")) return "orders";
    if (path.startsWith("/admin/users")) return "users";
    if (path.startsWith("/admin/categories")) return "categories";
    if (path.startsWith("/admin/services")) return "services";
    if (path.startsWith("/admin/news")) return "news";
    if (path.startsWith("/admin/test-drive-bookings"))
      return "test-drive-bookings";
    return "dashboard"; // Default to dashboard
  };

  // Menu items configuration using new items API
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to={ROUTERS.ADMIN.DASHBOARD}>Thống kê</Link>,
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">Người dùng</Link>,
    },
    {
      key: "products",
      icon: <FaCar />,
      label: <Link to={ROUTERS.ADMIN.PRODUCTS}>Xe thử</Link>,
    },
    {
      key: "orders",
      icon: <CarryOutOutlined />,
      label: <Link to="/admin/orders">Đăng ký lái thử</Link>,
    },
    {
      key: "categories",
      icon: <TagsOutlined />,
      label: <Link to="/admin/categories">Danh mục</Link>,
    },
    {
      key: "services",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/services">Dịch vụ</Link>,
    },
    {
      key: "news",
      icon: <FileTextOutlined />,
      label: <Link to={ROUTERS.ADMIN.NEWS}>Tin tức</Link>,
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
            {!collapsed && <span className={styles.logoText}>SiVi CAR</span>}
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
            © {new Date().getFullYear()} - Sản phẩm thuộc về SiVi CODE
          </div>
        </Footer>
      </Layout>
      <ThemeController />
    </Layout>
  );
};

export default AdminLayout;
