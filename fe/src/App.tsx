import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import viVN from "antd/locale/vi_VN";
import { Provider } from "react-redux";
import { store } from "@/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import MainLayout from "@/components/layout/MainLayout";
import ScrollToTop from "@/components/ScrollToTop";
import FaviconManager from "@/components/FaviconManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin Pages
import DashboardPage from "@/pages/admin/DashboardPage";
import AdminProductListPage from "@/pages/admin/ProductListPage";
import ProductFormPage from "@/pages/admin/ProductFormPage";
import OrderDetailPage from "@/pages/admin/OrderDetailPage";
import UserListPage from "@/pages/admin/UserListPage";
import CategoryListPage from "@/pages/admin/CategoryListPage";
import ServiceListPage from "@/pages/admin/ServiceListPage";
import TestDriveBookingListPage from "@/pages/admin/TestDriveBookingListPage";
import NewsListPage from "@/pages/admin/NewsListPage";
import NewsFormPage from "@/pages/admin/NewsFormPage";
import SettingsPage from "@/pages/admin/SettingsPage";

// Public Pages
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ProductDetailPage,
  ProductListPage as PublicProductListPage,
  FavoritesPage,
  ProfilePage,
  PriceListPage,
  ServicePage,
  BookingPage,
  NewsPage,
  PriceListDetailPage,
  NewsDetailPage,
} from "@/pages/user";
import "./styles/main.scss";
import { ROUTERS } from "@/utils/constant";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
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
                    <Route
                      path="/"
                      element={
                        <MainLayout>
                          <HomePage />
                        </MainLayout>
                      }
                    />
                    <Route
                      path={ROUTERS.USER.LOGIN}
                      element={
                        <PublicRoute>
                          <LoginPage />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.USER.REGISTER}
                      element={
                        <PublicRoute>
                          <RegisterPage />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.USER.PRODUCTS}
                      element={
                        <MainLayout>
                          <PublicProductListPage />
                        </MainLayout>
                      }
                    />
                    <Route
                      path={ROUTERS.USER.PRODUCTS_DETAIL}
                      element={
                        <MainLayout>
                          <ProductDetailPage />
                        </MainLayout>
                      }
                    />
                    <Route
                      path={ROUTERS.USER.NEWS}
                      element={
                        <MainLayout>
                          <NewsPage />
                        </MainLayout>
                      }
                    />
                    <Route
                      path={ROUTERS.USER.NEWS_DETAIL}
                      element={
                        <MainLayout>
                          <NewsDetailPage />
                        </MainLayout>
                      }
                    />
                    <Route
                      path={ROUTERS.USER.SERVICE}
                      element={
                        <MainLayout>
                          <ServicePage />
                        </MainLayout>
                      }
                    />
                    <Route
                      path={ROUTERS.USER.BOOKING}
                      element={
                        <MainLayout>
                          <BookingPage />
                        </MainLayout>
                      }
                    />
                    <Route
                      path={ROUTERS.USER.PRICE_LIST}
                      element={
                        <MainLayout>
                          <PriceListPage />
                        </MainLayout>
                      }
                    />
                    <Route
                      path={ROUTERS.USER.PRICE_LIST_DETAIL}
                      element={
                        <MainLayout>
                          <PriceListDetailPage />
                        </MainLayout>
                      }
                    />

                    {/* Protected Routes */}
                    <Route
                      path={ROUTERS.USER.FAVORITES}
                      element={
                        <ProtectedRoute>
                          <MainLayout>
                            <FavoritesPage />
                          </MainLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.USER.PROFILE}
                      element={
                        <ProtectedRoute>
                          <MainLayout>
                            <ProfilePage />
                          </MainLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path={ROUTERS.ADMIN.DASHBOARD}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <DashboardPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.PRODUCTS}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <AdminProductListPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.PRODUCTS_ADD}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <ProductFormPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.PRODUCTS_EDIT}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <ProductFormPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.ORDERS}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <TestDriveBookingListPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.ORDERS_DETAIL}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <OrderDetailPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.USERS}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <UserListPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.CATEGORIES}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <CategoryListPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.SERVICES}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <ServiceListPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.TEST_DRIVE_BOOKINGS}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <TestDriveBookingListPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.NEWS}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <NewsListPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.NEWS_ADD}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <NewsFormPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTERS.ADMIN.NEWS_EDIT}
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <NewsFormPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/settings"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <SettingsPage />
                          </AdminLayout>
                        </ProtectedRoute>
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
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
