import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import viVN from "antd/locale/vi_VN";
import { Provider } from "react-redux";
import { store } from "@/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import MainLayout from "@/components/layout/MainLayout";
import ScrollToTop from "@/components/ScrollToTop";
import FaviconManager from "@/components/FaviconManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin Pages
import {
  AdminDashboardPage,
  AdminProductListPage,
  AdminProductUpsetPage,
  AdminUserListPage,
  AdminCategoryListPage,
  AdminServiceListPage,
  AddServicePage,
  EditServicePage,
  AdminNewsListPage,
  AdminNewsFormPage,
  AdminSettingsPage,
  AdminBookingListPage,
} from "@/pages/admin";

// Public Pages
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ProductDetailPage,
  ProductListPage,
  FavoritesPage,
  ProfilePage,
  PriceListPage,
  ServicePage,
  BookingPage,
  NewsPage,
  NewsDetailPage,
  NotFoundPage,
} from "@/pages/user";
import "./styles/main.scss";
import { ROUTERS } from "@/utils/constant";

// Route configurations
const publicRoutes = [
  {
    path: "/",
    element: HomePage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.LOGIN,
    element: LoginPage,
    layout: PublicRoute,
  },
  {
    path: ROUTERS.USER.REGISTER,
    element: RegisterPage,
    layout: PublicRoute,
  },
  {
    path: ROUTERS.USER.PRODUCTS,
    element: ProductListPage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.PRODUCTS_DETAIL,
    element: ProductDetailPage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.NEWS,
    element: NewsPage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.NEWS_DETAIL,
    element: NewsDetailPage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.SERVICE,
    element: ServicePage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.BOOKING,
    element: BookingPage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.PRICE_LIST,
    element: PriceListPage,
    layout: MainLayout,
  },
];

const protectedRoutes = [
  {
    path: ROUTERS.USER.FAVORITES,
    element: FavoritesPage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.PROFILE,
    element: ProfilePage,
    layout: MainLayout,
  },
];

const adminRoutes = [
  {
    path: ROUTERS.ADMIN.DASHBOARD,
    element: AdminDashboardPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.PRODUCTS,
    element: AdminProductListPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.PRODUCTS_ADD,
    element: AdminProductUpsetPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.PRODUCTS_EDIT,
    element: AdminProductUpsetPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.BOOKINGS,
    element: AdminBookingListPage,
    layout: AdminLayout,
  },

  {
    path: ROUTERS.ADMIN.USERS,
    element: AdminUserListPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.CATEGORIES,
    element: AdminCategoryListPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.SERVICES,
    element: AdminServiceListPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.SERVICES_ADD,
    element: AddServicePage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.SERVICES_EDIT,
    element: EditServicePage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.NEWS,
    element: AdminNewsListPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.NEWS_ADD,
    element: AdminNewsFormPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.NEWS_EDIT,
    element: AdminNewsFormPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.SETTINGS,
    element: AdminSettingsPage,
    layout: AdminLayout,
  },
];

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <SettingsProvider>
              <ConfigProvider
                locale={viVN}
                theme={{
                  token: {
                    colorPrimary: "#1890ff",
                  },
                }}
              >
                <AntdApp>
                  <Router
                    future={{
                      v7_startTransition: true,
                      v7_relativeSplatPath: true,
                    }}
                  >
                    <FaviconManager />
                    <ScrollToTop />
                    <Routes>
                      {/* Public Routes */}
                      {publicRoutes.map((route) => (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <route.layout>
                              <route.element />
                            </route.layout>
                          }
                        />
                      ))}

                      {/* Protected Routes */}
                      {protectedRoutes.map((route) => (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <ProtectedRoute>
                              <route.layout>
                                <route.element />
                              </route.layout>
                            </ProtectedRoute>
                          }
                        />
                      ))}

                      {/* Admin Routes */}
                      {adminRoutes.map((route) => (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <ProtectedRoute requireAdmin>
                              <route.layout>
                                <route.element />
                              </route.layout>
                            </ProtectedRoute>
                          }
                        />
                      ))}

                      {/* 404 Not Found Route - Must be last */}
                      <Route
                        path="*"
                        element={
                          <MainLayout>
                            <NotFoundPage />
                          </MainLayout>
                        }
                      />
                    </Routes>
                  </Router>
                </AntdApp>
              </ConfigProvider>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </SettingsProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
