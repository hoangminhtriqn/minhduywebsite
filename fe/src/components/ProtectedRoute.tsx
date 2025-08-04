import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTERS } from "@/utils/constant";
import { Result, Button } from "antd";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requireAdmin?: boolean;
  requireEmployee?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requireAdmin = false,
  requireEmployee = false,
}) => {
  const { isAuthenticated, isAdmin, isEmployee, hasAnyPermission, loading } =
    useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTERS.USER.LOGIN} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        }
      />
    );
  }

  // Check employee requirement
  if (requireEmployee && !isEmployee && !isAdmin) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        }
      />
    );
  }

  // Check specific permissions
  if (requiredPermissions.length > 0 && !isAdmin) {
    if (!hasAnyPermission(requiredPermissions)) {
      return (
        <Result
          status="403"
          title="403"
          subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
          extra={
            <Button type="primary" onClick={() => window.history.back()}>
              Quay lại
            </Button>
          }
        />
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
