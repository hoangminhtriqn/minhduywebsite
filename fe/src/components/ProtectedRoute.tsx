import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import { ROUTERS } from "../utils/constant";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading spinner while checking authentication status
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login page, saving the current location so the user can be redirected back after login
    return (
      <Navigate to={ROUTERS.USER.LOGIN} state={{ from: location }} replace />
    );
  }

  if (requireAdmin && !isAdmin) {
    // Redirect non-admin users to the home page or an unauthorized page
    return <Navigate to="/" replace />;
  }

  // If authenticated and meets role requirements, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
