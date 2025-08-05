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
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import MainLayout from "@/components/layout/MainLayout";
import ScrollToTop from "@/components/ScrollToTop";
import FaviconManager from "@/components/FaviconManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin Pages
import {
  DashboardPage,
  ProductListPage,
  AddProductPage,
  EditProductPage,
  UserListPage,
  CategoryListPage,
  ServiceListPage,
  AddServicePage,
  EditServicePage,
  NewsListPage,
  AddNewsPage,
  EditNewsPage,
  SettingsPage,
  BookingListPage,
  // Pricing Management
  PricingListPage,
  AddPricingPage,
  EditPricingPage,
  // Permission Management
  PermissionListPage,
} from "@/pages/admin";

// Public Pages
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ProductDetailPage,
  ProductListPage as UserProductListPage,
  FavoritesPage,
  ProfilePage,
  PriceListPage,
  ServicePage,
  BookingPage,
  NewsPage,
  NewsDetailPage,
  NotFoundPage,
} from "@/pages/user";

// Auth Pages
import AuthSuccess from "@/pages/AuthSuccess";
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
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.REGISTER,
    element: RegisterPage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.PRODUCTS,
    element: UserProductListPage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.PRODUCTS_DETAIL,
    element: ProductDetailPage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.SERVICE,
    element: ServicePage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.PRICE_LIST,
    element: PriceListPage,
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
    path: ROUTERS.USER.BOOKING,
    element: BookingPage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.AUTH.SUCCESS,
    element: AuthSuccess,
    layout: MainLayout,
  },
];

const protectedRoutes = [
  {
    path: ROUTERS.USER.PROFILE,
    element: ProfilePage,
    layout: MainLayout,
  },
  {
    path: ROUTERS.USER.FAVORITES,
    element: FavoritesPage,
    layout: MainLayout,
  },
];

const adminRoutes = [
  {
    path: ROUTERS.ADMIN.DASHBOARD,
    element: DashboardPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.PRODUCTS,
    element: ProductListPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.PRODUCTS_ADD,
    element: AddProductPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.PRODUCTS_EDIT,
    element: EditProductPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.BOOKINGS,
    element: BookingListPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.USERS,
    element: UserListPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.CATEGORIES,
    element: CategoryListPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.SERVICES,
    element: ServiceListPage,
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
    element: NewsListPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.NEWS_ADD,
    element: AddNewsPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.NEWS_EDIT,
    element: EditNewsPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.SETTINGS,
    element: SettingsPage,
    layout: AdminLayout,
  },
  // Pricing Management Routes
  {
    path: ROUTERS.ADMIN.PRICE_LIST,
    element: PricingListPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.PRICE_LIST_ADD,
    element: AddPricingPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.PRICE_LIST_EDIT,
    element: EditPricingPage,
    layout: AdminLayout,
  },
  {
    path: ROUTERS.ADMIN.PERMISSIONS,
    element: PermissionListPage,
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
                            <ProtectedRoute requireEmployee={true}>
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
