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
  UnlockOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Layout, List, Menu, Space } from "antd";
import React, { useEffect, useState } from "react";

import ThemeController from "@/components/ThemeController";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTERS } from "@/utils/constant";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.scss"; // Import CSS module
import {
  DashboardPermissions,
  UserPermissions,
  CategoryPermissions,
  ProductPermissions,
  BookingPermissions,
  ServicePermissions,
  PricingPermissions,
  NewsPermissions,
  PermissionManagementPermissions,
  SettingsPermissions,
} from "@/types/enum";
import { getBookings } from "@/api/services/admin/bookings";

const { Header, Content, Footer, Sider } = Layout;

const isMobile = () => window.innerWidth < 992;

const getInitials = (name?: string) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Define required permissions for each menu item using enums
const MENU_PERMISSIONS = {
  [ROUTERS.ADMIN.DASHBOARD]: [DashboardPermissions.VIEW],
  [ROUTERS.ADMIN.USERS]: [UserPermissions.VIEW],
  [ROUTERS.ADMIN.CATEGORIES]: [CategoryPermissions.VIEW],
  [ROUTERS.ADMIN.PRODUCTS]: [ProductPermissions.VIEW],
  [ROUTERS.ADMIN.BOOKINGS]: [BookingPermissions.VIEW],
  [ROUTERS.ADMIN.SERVICES]: [ServicePermissions.VIEW],
  [ROUTERS.ADMIN.PRICE_LIST]: [PricingPermissions.VIEW],
  [ROUTERS.ADMIN.NEWS]: [NewsPermissions.VIEW],
  [ROUTERS.ADMIN.PERMISSIONS]: [PermissionManagementPermissions.VIEW],
  [ROUTERS.ADMIN.SETTINGS]: [SettingsPermissions.VIEW],
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { user, logout, hasAnyPermission, isAdmin } = useAuth();
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
      ROUTERS.ADMIN.PERMISSIONS,
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

  // All menu items configuration
  const allMenuItems = [
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
      key: ROUTERS.ADMIN.PERMISSIONS,
      icon: <UnlockOutlined />,
      label: <Link to={ROUTERS.ADMIN.PERMISSIONS}>Phân quyền</Link>,
    },
    {
      key: ROUTERS.ADMIN.SETTINGS,
      icon: <SettingOutlined />,
      label: <Link to={ROUTERS.ADMIN.SETTINGS}>Cài đặt</Link>,
    },
  ];

  // Filter menu items based on permissions
  const menuItems = allMenuItems.filter((item) => {
    // Admin can see all menu items
    if (isAdmin) return true;

    // Check if user has required permissions for this menu item
    const requiredPermissions = MENU_PERMISSIONS[item.key];
    if (!requiredPermissions) return false;

    return hasAnyPermission(requiredPermissions);
  });

  // Determine if current admin path is accessible; if not, redirect appropriately
  useEffect(() => {
    const path = location.pathname;
    // Only apply for admin area
    const isAdminArea = path.startsWith(
      ROUTERS.ADMIN.DASHBOARD.split("/")[1] ? "/admin" : "/admin"
    );
    if (!isAdminArea) return;

    // Admin can access everything
    if (isAdmin) return;

    // Find the best matching admin route key for current path
    const adminKeys = Object.keys(MENU_PERMISSIONS);
    const matchingKeys = adminKeys.filter((key) => path.startsWith(key));
    const matchedKey = matchingKeys.length
      ? matchingKeys.reduce((a, b) => (a.length > b.length ? a : b))
      : undefined;

    let allowed = false;
    if (matchedKey) {
      const required = MENU_PERMISSIONS[matchedKey];
      allowed = hasAnyPermission(required);
    }

    if (!allowed) {
      // If currently at /admin (dashboard root), keep layout without redirect
      if (path === ROUTERS.ADMIN.DASHBOARD) {
        return;
      }
      // Otherwise redirect to first permitted admin page, or fallback to /admin
      const firstAllowed = menuItems[0]?.key;
      if (firstAllowed) {
        navigate(firstAllowed, { replace: true });
      } else {
        navigate(ROUTERS.ADMIN.DASHBOARD, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isAdmin, hasAnyPermission]);

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
            onClick={(e) => {
              e.preventDefault();
              window.open(ROUTERS.USER.HOME, "_blank");
            }}
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
            {(isAdmin || hasAnyPermission([BookingPermissions.VIEW])) && (
              <div className={styles.notificationsWrapper}>
                <AdminNotificationsBell />
              </div>
            )}
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
                      {user.Avatar ? (
                        <img
                          src={user.Avatar}
                          alt="Avatar"
                          className={styles.avatarImage}
                        />
                      ) : (
                        <span className={styles.avatarInitials}>
                          {getInitials(user.FullName)}
                        </span>
                      )}
                    </div>
                    <span className={styles.userName}>{user.UserName}</span>
                  </Space>
                </a>
              </Dropdown>
            )}
          </div>
        </Header>
        <Content className={styles.adminContent}>
          {(() => {
            const path = location.pathname;
            const isAdminArea = path.startsWith(
              ROUTERS.ADMIN.DASHBOARD.split("/")[1] ? "/admin" : "/admin"
            );
            if (!isAdminArea) return children;
            if (isAdmin) return children;

            const adminKeys = Object.keys(MENU_PERMISSIONS);
            const matchingKeys = adminKeys.filter((key) =>
              path.startsWith(key)
            );
            const matchedKey = matchingKeys.length
              ? matchingKeys.reduce((a, b) => (a.length > b.length ? a : b))
              : undefined;

            let allowed = false;
            if (matchedKey) {
              const required = MENU_PERMISSIONS[matchedKey];
              allowed = hasAnyPermission(required);
            }

            // If user is at /admin without required permission, show empty content
            if (path === ROUTERS.ADMIN.DASHBOARD && !allowed) {
              return null;
            }
            return children;
          })()}
        </Content>
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

// Lightweight notifications bell: uses pending bookings as notification source
const AdminNotificationsBell: React.FC = () => {
  const { isAdmin, hasAnyPermission } = useAuth();
  const canViewBookings =
    isAdmin || hasAnyPermission([BookingPermissions.VIEW]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [items, setItems] = useState<
    { _id: string; title: string; subtitle: string; createdAt: string }[]
  >([]);
  const READ_KEY = "md_admin_read_booking_ids";
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(READ_KEY);
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      return new Set(parsed);
    } catch {
      return new Set();
    }
  });

  const persistRead = (next: Set<string>) => {
    setReadIds(new Set(next));
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(Array.from(next)));
    } catch {
      // no-op
    }
  };
  const [open, setOpen] = useState(false);

  const fetchPending = async () => {
    if (!canViewBookings) return;
    try {
      const res = await getBookings({
        page: 1,
        limit: 8,
        search: "",
        status: "pending",
      });
      const bookings = res.data.data.bookings || [];
      setPendingCount(res.data.data.pagination?.total ?? bookings.length);
      setItems(
        bookings.map((b: import("@/api/services/admin/bookings").Booking) => ({
          _id: b._id,
          title: b.FullName || "Khách hàng",
          subtitle:
            `${b.BookingTime || ""} ${b.BookingDate ? new Date(b.BookingDate).toLocaleDateString("vi-VN") : ""}`.trim(),
          createdAt: b.createdAt,
        }))
      );
    } catch {
      // ignore silently
    }
  };

  useEffect(() => {
    fetchPending();
    const id = window.setInterval(fetchPending, 60000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewBookings]);

  if (!canViewBookings) return null;

  const markItemRead = (id: string) => {
    if (!id) return;
    const next = new Set(readIds);
    next.add(id);
    persistRead(next);
  };

  // const markAllVisibleRead = () => {
  //   const next = new Set(readIds);
  //   items.forEach((i) => next.add(i._id));
  //   persistRead(next);
  // };

  const readCountInVisible = items.reduce(
    (acc, i) => acc + (readIds.has(i._id) ? 1 : 0),
    0
  );
  const badgeCount = Math.max(
    (pendingCount || items.length) - readCountInVisible,
    0
  );

  const overlay = (
    <div
      style={{
        width: 340,
        padding: 10,
        background: "var(--theme-bg-paper)",
        border: "1px solid var(--theme-border-light)",
        borderRadius: 12,
        boxShadow: "0 8px 24px var(--theme-shadow)",
        maxHeight: 420,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span style={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
          Thông báo đặt lịch
        </span>
      </div>
      <div style={{ overflowY: "auto", maxHeight: 356, paddingRight: 2 }}>
        {items.length === 0 ? (
          <div style={{ padding: 12, color: "var(--theme-text-secondary)" }}>
            Không có thông báo mới
          </div>
        ) : (
          <List
            size="small"
            dataSource={items}
            split={true}
            renderItem={(item) => (
              <List.Item
                style={{
                  cursor: "pointer",
                  paddingLeft: 4,
                  paddingRight: 4,
                  opacity: readIds.has(item._id) ? 0.6 : 1,
                }}
                onClick={() => {
                  markItemRead(item._id);
                  // navigate to bookings page with query to open modal
                  window.location.hash = `#${ROUTERS.ADMIN.BOOKINGS}?openBooking=${item._id}`;
                  setOpen(false);
                }}
              >
                <List.Item.Meta
                  title={
                    <span
                      style={{
                        fontWeight: 600,
                        color: "var(--theme-text-primary)",
                      }}
                    >
                      {item.title}
                    </span>
                  }
                  description={
                    <span style={{ color: "var(--theme-text-secondary)" }}>
                      {item.subtitle}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );

  if (badgeCount === 0) return null;

  return (
    <Dropdown
      dropdownRender={() => overlay}
      placement="bottomRight"
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
      arrow={false}
      getPopupContainer={() => document.body}
    >
      <a onClick={(e) => e.preventDefault()} style={{ marginRight: 0 }}>
        <Badge count={badgeCount} offset={[-2, 2]}>
          <BellOutlined style={{ fontSize: 18 }} />
        </Badge>
      </a>
    </Dropdown>
  );
};
